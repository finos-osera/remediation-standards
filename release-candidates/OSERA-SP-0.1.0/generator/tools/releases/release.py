#!/usr/bin/env python3
"""Prepare once, validate, and promote reviewed standards snapshots without rebuilding."""
import argparse
import hashlib
import html
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import posixpath
import re
import shutil
import subprocess
import tempfile
from urllib.parse import unquote, urlsplit
import zipfile

ROOT = Path(__file__).resolve().parents[2]
PACK_RE = re.compile(r'OSERA-SP-\d+\.\d+\.\d+\Z')
SECTIONS = ('included_standards', 'advisory_standards', 'observe_standards', 'deferred_standards')
SITE = 'https://standards.osera.finos.org'
REPO = 'https://github.com/finos-osera/remediation-standards'


def run(*args, cwd=ROOT, **kwargs):
    return subprocess.check_output(args, cwd=cwd, **kwargs).decode().strip()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + '\n')


def pack_id(value):
    if not PACK_RE.fullmatch(value):
        raise ValueError('Pack must be OSERA-SP-x.y.z')
    return value


def files(root):
    result = {}
    for path in sorted(root.rglob('*')):
        if path.is_symlink():
            raise ValueError(f'Symlink forbidden: {path}')
        if path.is_file():
            result[path.relative_to(root).as_posix()] = path
    return result


def selected_metadata(data):
    by_id = {s['standard_id']: s for s in data['standards']}
    selected = {}
    for section in SECTIONS:
        for entry in data['pack'].get(section, []):
            standard = by_id.get(entry['id'])
            if not standard or str(standard['standard-version']) != str(entry['version']):
                raise ValueError(f"Missing exact version: {entry['id']} {entry['version']}")
            if entry['id'] in selected and selected[entry['id']]['version'] != entry['version']:
                raise ValueError('Conflicting versions within a pack')
            effective = data['profiles'][entry['id']]['effective']
            check_ids = {c['id'] for c in effective['checks'].values()}
            if not set(entry.get('checks', [])) <= check_ids:
                raise ValueError(f"Unknown effective check in {entry['id']}")
            selected.setdefault(entry['id'], {
                'version': entry['version'], 'title': standard['title'],
                'url': standard['url'].lstrip('/') + 'index.html',
                'source_path': standard['source_path'], 'roles': [],
                'ratified': False, 'effective': effective,
                'relationships': data['profiles'][entry['id']]['relationships']})
            selected[entry['id']]['roles'].append(section)
            if section in ('included_standards', 'advisory_standards'):
                selected[entry['id']]['ratified'] = standard['doc-status'] == 'Ratified'
    for id_ in selected:
        parent = by_id[id_].get('extends')
        if parent and parent not in selected:
            raise ValueError(f'{id_}: parent {parent} must be pinned in this pack')
    return selected


class Links(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.ids = [], set()
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        for name in ('href', 'src', 'poster'):
            if name in attrs:
                self.links.append(attrs[name])


def local_target(root, path, url):
    parsed = urlsplit(html.unescape(url))
    if parsed.scheme or parsed.netloc:
        return None, None
    if parsed.path.startswith('/'):
        raise ValueError(f'Root-relative link is not portable: {path}: {url}')
    target = (path.parent / unquote(parsed.path)).resolve() if parsed.path else path.resolve()
    if not target.is_relative_to(root.resolve()):
        raise ValueError(f'Link escapes snapshot: {path}: {url}')
    if target.is_dir():
        target /= 'index.html'
    return target, unquote(parsed.fragment)


def check_links(root):
    root = root.resolve()
    pages = {p.resolve(): Links(p.read_text()) for p in root.rglob('*.html') if 'source' not in p.relative_to(root).parts}
    for path, page in pages.items():
        for url in page.links:
            target, anchor = local_target(root, path, url)
            if target is None:
                continue
            if not target.is_file():
                raise ValueError(f'Broken internal link: {path.relative_to(root)} -> {url}')
            if anchor and target in pages and anchor not in pages[target].ids:
                raise ValueError(f'Broken anchor: {path.relative_to(root)} -> {url}')


def portable_html(root):
    # Jekyll emits quoted URL attributes. Resolve them into file-relative paths,
    # with explicit index.html so the extracted ZIP also works over file://.
    for path in root.rglob('*.html'):
        if 'source' in path.relative_to(root).parts or 'generator' in path.relative_to(root).parts:
            continue
        text = path.read_text()
        text = re.sub(r'<link\b[^>]*https://fonts\.[^>]*>\s*', '', text)
        def replace(match):
            name, quote, value = match.groups()
            parsed = urlsplit(html.unescape(value))
            if value == SITE + '/releases/':
                return match.group(0)
            if parsed.netloc == 'standards.osera.finos.org':
                value = parsed.path + ('#' + parsed.fragment if parsed.fragment else '')
                parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or not parsed.path:
                return match.group(0)
            target = root / unquote(parsed.path.lstrip('/')) if parsed.path.startswith('/') else path.parent / unquote(parsed.path)
            if target.is_dir():
                target /= 'index.html'
            relative = os.path.relpath(target, path.parent)
            if parsed.query:
                relative += '?' + parsed.query
            if parsed.fragment:
                relative += '#' + parsed.fragment
            return f'{name}={quote}{html.escape(relative, quote=True)}{quote}'
        text = re.sub(r'\b(href|src|poster)=(\"|\')(.*?)\2', replace, text)
        path.write_text(text)


def seal(root):
    id_ = json.loads((root / 'manifest.json').read_text())['id']
    excluded = {'SHA256SUMS', f'{id_}.zip', f'{id_}.zip.sha256'}
    payload = {name: path for name, path in files(root).items() if name not in excluded}
    (root / 'SHA256SUMS').write_text(''.join(f'{digest(path)}  {name}\n' for name, path in payload.items()))
    # Fixed timestamps/permissions and sorted paths make archive bytes reproducible.
    with zipfile.ZipFile(root / f'{id_}.zip', 'w', compression=zipfile.ZIP_DEFLATED) as archive:
        for name in sorted([*payload, 'SHA256SUMS']):
            info = zipfile.ZipInfo(f'{id_}/{name}', date_time=(1980, 1, 1, 0, 0, 0))
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, (root / name).read_bytes())
    (root / f'{id_}.zip.sha256').write_text(f'{digest(root / f"{id_}.zip")}  {id_}.zip\n')


def validate(root):
    manifest = json.loads((root / 'manifest.json').read_text())
    id_ = pack_id(manifest['id'])
    expected = {}
    for line in (root / 'SHA256SUMS').read_text().splitlines():
        checksum, name = line.split('  ', 1)
        if name in expected or not re.fullmatch(r'[a-f0-9]{64}', checksum):
            raise ValueError('Invalid checksum manifest')
        expected[name] = checksum
    actual = files(root)
    excluded = {'SHA256SUMS', f'{id_}.zip', f'{id_}.zip.sha256'}
    if set(actual) - excluded != set(expected):
        raise ValueError('Snapshot file inventory differs from checksums')
    for name, checksum in expected.items():
        if digest(actual[name]) != checksum:
            raise ValueError(f'Changed snapshot file: {name}')
    zip_path = root / f'{id_}.zip'
    if (root / f'{id_}.zip.sha256').read_text() != f'{digest(zip_path)}  {id_}.zip\n':
        raise ValueError('Archive checksum mismatch')
    with zipfile.ZipFile(zip_path) as archive:
        names = [f'{id_}/{name}' for name in [*expected, 'SHA256SUMS']]
        if sorted(archive.namelist()) != sorted(names):
            raise ValueError('Archive inventory differs from snapshot')
        for name in names:
            if archive.read(name) != (root / name.split('/', 1)[1]).read_bytes():
                raise ValueError(f'Archive content differs: {name}')
    data = json.loads((root / 'resolved.json').read_text())
    selected = selected_metadata(data)
    for id2, standard in selected.items():
        source = root / 'source' / standard['source_path']
        if manifest['standards'][id2] != dict(standard, source_sha256=digest(source)):
            raise ValueError(f'Manifest differs from selected content: {id2}')
    if set(selected) != set(manifest['standards']) or data['pack']['id'] != id_:
        raise ValueError('Pack identity or membership mismatch')
    check_links(root)
    return manifest


def prepare(args):
    id_ = pack_id(args.pack)
    output = Path(args.output).resolve() if args.output else ROOT / 'release-candidates' / id_
    if output.exists():
        raise ValueError('Output already exists; never overwrite a prepared snapshot. Use a new output directory.')
    source = run('git', 'rev-parse', '--verify', args.source + '^{commit}')
    if not re.fullmatch(r'[a-f0-9]{40}', source):
        raise ValueError('Expected a full source commit')
    with tempfile.TemporaryDirectory() as temp:
        staging = Path(temp)
        src = staging / 'input'
        src.mkdir()
        # git archive reads only tracked content at the exact ref, not dirty files.
        import tarfile, io
        with tarfile.open(fileobj=io.BytesIO(subprocess.check_output(['git', 'archive', source, 'docs'], cwd=ROOT))) as archive:
            for member in archive.getmembers():
                if not (member.isfile() or member.isdir()) or not (src / member.name).resolve().is_relative_to(src.resolve()):
                    raise ValueError('Unsupported source archive entry')
            archive.extractall(src)
        data = json.loads(run('ruby', str(ROOT / 'tools/releases/export.rb'), str(src), id_))
        selected = selected_metadata(data)
        dest = staging / 'snapshot'
        dest.mkdir()
        shutil.copytree(src / 'docs', dest / 'source/docs')
        # Preserve the complete historical docs tree, including informative material,
        # so no local cross-reference silently falls through to today's website.
        for id2, standard in selected.items():
            standard['source_sha256'] = digest(src / standard['source_path'])
        tool_paths = ['tools/releases/release.py', 'tools/releases/export.rb', 'tools/lib/profile_relationships.rb', 'tools/generate_catalog.rb', 'docs/Gemfile', 'docs/Gemfile.lock']
        for name in tool_paths:
            if (ROOT / name).is_file():
                target = dest / 'generator' / name
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(ROOT / name, target)
        manifest = {'schema_version': 1, 'id': id_, 'source_commit': source,
                    'decision': args.decision, 'prepared_date': args.date,
                    'ratified_date': data['pack'].get('ratified_date'),
                    'source_pack_status': data['pack']['status'],
                    'provenance': args.provenance, 'standards': selected,
                    'toolchain': {'ruby': run('ruby', '--version'), 'jekyll': run('bundle', 'exec', 'jekyll', '--version', cwd=ROOT / 'docs')},
                    'supporting_material': 'Complete source docs tree; pack membership determines normative standards. Examples and guidance are informative unless a standard incorporates them.',
                    'publication': 'Prepared payload. Official publication is established by the release register, approval record and immutable GitHub Release, not by this manifest alone.'}
        write_json(dest / 'manifest.json', manifest)
        write_json(dest / 'resolved.json', data)
        # Regenerate catalogs from the selected historical source, using the stored generator.
        shutil.copytree(ROOT / 'tools', src / 'tools', ignore=shutil.ignore_patterns('__pycache__'))
        run('ruby', 'tools/generate_catalog.rb', cwd=src)
        source_docs = src / 'docs'
        for name in ('releases', 'release-candidates'):
            shutil.rmtree(source_docs / name, ignore_errors=True)
        # Frozen banner is accurate both before and after publication; status lives
        # in the mutable register, so promotion never changes reviewed bytes.
        layout = source_docs / '_layouts/default.html'
        banner = f'''<aside class="release-notice" style="padding:1rem 5%;background:#fff4d6;border-bottom:2px solid #bd8419;color:#342700"><strong>{id_} · Preserved release snapshot</strong><p>Prepared for review. Treat this copy as official only when its publication is confirmed in the <a href="{SITE}/releases/">release register</a>. It does not follow working-draft edits.</p><a href="/">Snapshot contents and downloads</a> · <a href="{REPO}/commit/{source}">Source revision</a></aside>'''
        layout.write_text(layout.read_text().replace('<body>', '<body>\n' + banner))
        rows = '\n'.join(f"| [{id2}]({s['url']}) | {s['version']} | {', '.join(s['roles'])} |" for id2, s in selected.items())
        landing = f'''---\ntitle: {id_} release snapshot\nlayout: page\n---\n\nThis is a self-contained snapshot prepared from an exact repository revision. **Publication status is recorded in the [release register]({SITE}/releases/).**\n\nRatification recorded in source: **{manifest['ratified_date']}**. Archive prepared: **{args.date}**.\n\n[Decision record]({args.decision}) · [Source revision]({REPO}/commit/{source})\n\n## Download and inspect\n\n[Download complete ZIP]({id_}.zip) · [ZIP checksum]({id_}.zip.sha256) · [File checksums](SHA256SUMS) · [Release manifest](manifest.json) · [Resolved definitions](resolved.json)\n\nOpen `index.html` after extracting the ZIP. All local pages and assets are bundled. External references still require a connection.\n\n<h2 id="standards">Standards in this snapshot</h2>\n\n| Standard | Version | Pack membership |\n| --- | --- | --- |\n{rows}\n\n## Supporting material\n\n[Pack details](standard-packs/index.html) · [Fitness guidance](fitness/index.html) · [Lifecycle](lifecycle/index.html) · [Examples](examples/index.html) · [JSON catalog](catalog/osera-standards.json) · [YAML catalog](catalog/osera-standards.yaml)\n\nThe complete original documentation source, including schemas and registries, is bundled under `source/docs/`. Pack membership determines which standards are required, advisory, observed or deferred; inclusion in this archive does not ratify every supporting page.\n\n## Provenance\n\n{args.provenance}\n'''
        (source_docs / 'index.md').write_text(landing)
        env = dict(os.environ, BUNDLE_GEMFILE=str(ROOT / 'docs/Gemfile'))
        run('bundle', 'exec', 'jekyll', 'build', '--source', str(source_docs), '--destination', str(dest), '--baseurl', '', cwd=ROOT / 'docs', env=env)
        # Jekyll destination cleanup removes non-site files: restore review metadata.
        shutil.copytree(src / 'docs', dest / 'source/render-input', ignore=shutil.ignore_patterns('.jekyll-cache', '_site'))
        # Original source remains independent from the rendering modifications.
        original = subprocess.check_output(['git', 'archive', source, 'docs'], cwd=ROOT)
        with tarfile.open(fileobj=io.BytesIO(original)) as archive:
            archive.extractall(dest / 'source')
        for name in tool_paths:
            if (ROOT / name).is_file():
                target = dest / 'generator' / name
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(ROOT / name, target)
        write_json(dest / 'manifest.json', manifest)
        write_json(dest / 'resolved.json', data)
        # Rewrite catalog URL fields relative to each catalog file for offline use.
        for path in (dest / 'catalog').rglob('*'):
            if path.suffix not in ('.json', '.yaml'):
                continue
            text = path.read_text()
            text = re.sub(r'/standards/([a-z0-9-]+)/', lambda m: os.path.relpath(dest / 'standards' / m[1] / 'index.html', path.parent), text)
            path.write_text(text)
        portable_html(dest)
        # Relative-link checks reference downloads before sealing.
        (dest / f'{id_}.zip').touch()
        (dest / f'{id_}.zip.sha256').touch()
        (dest / 'SHA256SUMS').touch()
        seal(dest)
        validate(dest)
        output.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(dest, output)
    print(f'Prepared {output}. Payload digest: {digest(output / "SHA256SUMS")}')


def protect(base, root=ROOT):
    # Compare against the trusted PR base, not editable checksums in the PR.
    names = run('git', 'ls-tree', '-r', '--name-only', base, '--', 'releases', 'release-approvals', cwd=root).splitlines()
    for name in names:
        expected = subprocess.check_output(['git', 'show', f'{base}:{name}'], cwd=root)
        path = root / name
        if not path.is_file() or path.read_bytes() != expected:
            raise ValueError(f'Existing release/approval is immutable: {name}')


def promote(args):
    candidate = Path(args.candidate).resolve()
    manifest = validate(candidate)
    id_ = manifest['id']
    approval = json.loads(Path(args.approval).read_text())
    required = {'pack': id_, 'payload_sha256': digest(candidate / 'SHA256SUMS'),
                'source_commit': manifest['source_commit'], 'baseline_confirmed': True}
    if any(approval.get(k) != v for k, v in required.items()) or not approval.get('approval_url') or not approval.get('approved_by'):
        raise ValueError('Approval must confirm the exact payload, source, decision URL and baseline')
    if manifest['source_pack_status'] != 'Ratified':
        raise ValueError('Cannot promote an unratified source pack')
    output = ROOT / 'releases' / id_
    if output.exists():
        validate(output)
        if files_equal(candidate, output):
            print('Already promoted; unchanged')
            return
        raise ValueError('Release identity already exists with different bytes')
    record = ROOT / 'release-approvals' / f'{id_}.json'
    if record.exists():
        raise ValueError('Approval already exists without payload; inspect interrupted promotion')
    shutil.copytree(candidate, output)
    write_json(record, approval)
    print(f'Promoted unchanged payload to {output}; commit, review and publish explicitly.')


def files_equal(first, second):
    a, b = files(first), files(second)
    return a.keys() == b.keys() and all(a[n].read_bytes() == b[n].read_bytes() for n in a)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    p = commands.add_parser('prepare')
    for arg in ('pack', 'source', 'decision', 'date', 'provenance'):
        p.add_argument('--' + arg, required=True)
    p.add_argument('--output')
    p = commands.add_parser('validate')
    p.add_argument('directory', type=Path)
    p = commands.add_parser('protect')
    p.add_argument('--base', required=True)
    p = commands.add_parser('promote')
    p.add_argument('--candidate', required=True)
    p.add_argument('--approval', required=True)
    args = parser.parse_args()
    if args.command == 'prepare': prepare(args)
    elif args.command == 'validate': validate(args.directory); print('Snapshot validated')
    elif args.command == 'protect': protect(args.base); print('Existing releases unchanged')
    elif args.command == 'promote': promote(args)


if __name__ == '__main__':
    main()
