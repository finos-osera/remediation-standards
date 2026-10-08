#!/usr/bin/env python3
"""Publish an approved snapshot; never regenerate or replace existing release bytes."""
import argparse
import json
import subprocess
from release import ROOT, SITE, digest, pack_id, run, validate, validate_approval


def api(path, method='GET', body=None, missing=False):
    command = ['gh', 'api', path, '--method', method]
    if body is not None:
        command += ['--input', '-']
    result = subprocess.run(command, input=json.dumps(body) if body is not None else None,
                            text=True, capture_output=True, cwd=ROOT)
    if result.returncode:
        if missing and 'HTTP 404' in result.stderr:
            return None
        raise RuntimeError(result.stderr.strip())
    return json.loads(result.stdout) if result.stdout.strip() else None


def controls(repo):
    # A 404 can mean disabled OR insufficient access; neither permits publication.
    value = api(f'repos/{repo}/immutable-releases', missing=True)
    if not value or value.get('enabled') is not True:
        raise ValueError('Cannot verify immutable releases. An administrator must enable them and supply a token with Administration:read and Contents:write.')
    rules = api(f'repos/{repo}/rulesets?includes_parents=true&per_page=100')
    protected = False
    for rule in rules:
        detail = api(f'repos/{repo}/rulesets/{rule["id"]}')
        refs = detail.get('conditions', {}).get('ref_name', {})
        kinds = {r['type'] for r in detail.get('rules', [])}
        if (detail.get('target') == 'tag' and detail.get('enforcement') == 'active'
                and 'refs/tags/OSERA-SP-*' in refs.get('include', []) and not refs.get('exclude')
                and {'update', 'deletion'} <= kinds and not detail.get('bypass_actors')):
            protected = True
    if not protected:
        raise ValueError('Active OSERA-SP-* tag ruleset must block update/deletion with no bypass actors. See tools/releases/tag-ruleset.json.')


def verify_assets(repo, release, paths, allow_missing=False):
    expected = {p.name: p for p in paths}
    assets = {a['name']: a for a in release.get('assets', [])}
    if set(assets) - set(expected):
        raise ValueError('Unexpected release assets; refusing to alter release')
    if not allow_missing and set(assets) != set(expected):
        raise ValueError('Published asset inventory mismatch')
    for name, asset in assets.items():
        data = subprocess.check_output(['gh', 'api', f'repos/{repo}/releases/assets/{asset["id"]}',
                                        '-H', 'Accept: application/octet-stream'], cwd=ROOT)
        if data != expected[name].read_bytes():
            raise ValueError(f'Existing asset differs: {name}; never overwrite it')
    return set(expected) - set(assets)



def find_release(repo, id_):
    # The tag endpoint returns published releases only. List releases with the
    # write-capable credential to recover an interrupted draft publication.
    published = api(f'repos/{repo}/releases/tags/{id_}', missing=True)
    if published:
        return published
    page = 1
    while True:
        releases = api(f'repos/{repo}/releases?per_page=100&page={page}')
        matches = [item for item in releases if item['tag_name'] == id_]
        if len(matches) > 1:
            raise ValueError('Multiple draft releases for the same tag; inspect before publishing')
        if matches:
            return matches[0]
        if len(releases) < 100:
            return None
        page += 1


def publish(args):
    id_ = pack_id(args.pack)
    repo = args.repo
    import re
    if not re.fullmatch(r'[a-f0-9]{40}', args.commit):
        raise ValueError('Publication requires the full reviewed commit SHA, not a moving ref')
    commit = run('git', 'rev-parse', '--verify', args.commit + '^{commit}')
    if commit != run('git', 'rev-parse', 'HEAD'):
        raise ValueError('Check out the exact publication commit before publishing')
    if run('git', 'status', '--porcelain'):
        raise ValueError('Publication requires a clean checkout')
    # Only approved, merged publication commits may be tagged.
    run('git', 'fetch', 'origin', 'main')
    run('git', 'merge-base', '--is-ancestor', commit, 'origin/main')
    root = ROOT / 'releases' / id_
    manifest = validate(root)
    approval = json.loads((ROOT / 'release-approvals' / f'{id_}.json').read_text())
    validate_approval(root, manifest, approval)
    controls(repo)
    if not args.publish:
        print('Publication preflight passed; no remote changes. Add --publish to stamp the reviewed release.')
        return
    prefix = f'repos/{repo}'
    reference = api(f'{prefix}/git/ref/tags/{id_}', missing=True)
    if reference:
        if reference['object']['type'] != 'tag':
            raise ValueError('Existing tag is not annotated')
        tag = api(f'{prefix}/git/tags/{reference["object"]["sha"]}')
        if tag['object']['type'] != 'commit' or tag['object']['sha'] != commit:
            raise ValueError('Existing release tag points elsewhere; never move it')
    else:
        tag = api(f'{prefix}/git/tags', 'POST', {'tag': id_, 'message': f'{id_}\nApproved payload: {approval["payload_sha256"]}\nDecision: {approval["approval_url"]}', 'object': commit, 'type': 'commit'})
        api(f'{prefix}/git/refs', 'POST', {'ref': f'refs/tags/{id_}', 'sha': tag['sha']})
    release = find_release(repo, id_)
    paths = [root / f'{id_}.zip', root / f'{id_}.zip.sha256', root / 'SHA256SUMS', root / 'manifest.json']
    notes = (f'Ratified standards pack {id_}.\n\n'
             f'Permanent archive: {SITE}/releases/{id_}/\n\n'
             f'Ratification: {manifest["decision"]}\nApproval of archived content: {approval["approval_url"]}\n\n'
             f'Source: {manifest["source_commit"]}\nPayload SHA-256: {approval["payload_sha256"]}\n\n'
             'Extract the ZIP and open index.html for an offline copy. SHA256SUMS covers every payload file except the ZIP and integrity files; the ZIP has its own checksum.')
    if release and not release['draft']:
        verify_assets(repo, release, paths)
        if release.get('immutable') is not True:
            raise ValueError('Existing release is not immutable; administrator review required')
        print('Already published; tag and every asset verified, no changes.')
        return
    if not release:
        release = api(f'{prefix}/releases', 'POST', {'tag_name': id_, 'name': id_, 'body': notes, 'draft': True, 'prerelease': False})
    missing = verify_assets(repo, release, paths, allow_missing=True)
    for path in paths:
        if path.name in missing:
            run('gh', 'release', 'upload', id_, str(path), '--repo', repo)
    release = api(f'{prefix}/releases/{release["id"]}')
    verify_assets(repo, release, paths)
    published = api(f'{prefix}/releases/{release["id"]}', 'PATCH', {'draft': False, 'make_latest': 'legacy'})
    if published.get('immutable') is not True:
        raise ValueError('Publication returned without immutable confirmation; inspect GitHub, do not replace assets')
    print(f'Published {published["html_url"]}. Deploy the same publication commit using Deploy GitHub Pages.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pack', required=True)
    parser.add_argument('--commit', required=True)
    parser.add_argument('--repo', default='finos-osera/remediation-standards')
    parser.add_argument('--publish', action='store_true')
    publish(parser.parse_args())
