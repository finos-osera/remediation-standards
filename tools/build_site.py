#!/usr/bin/env python3
"""Build mutable navigation, then copy verified frozen artifacts byte for byte."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
sys.path.insert(0, str(Path(__file__).parent / 'releases'))
from release import ROOT, REPO, digest, files, validate, write_json


def release_history(root=ROOT):
    history = {'releases': [], 'candidates': [], 'standards': {}, 'packs': {}, 'latest': None}
    seen = set()
    for folder, kind in (('releases', 'releases'), ('release-candidates', 'candidates')):
        for manifest_path in sorted((root / folder).glob('*/manifest.json')):
            manifest = validate(manifest_path.parent)
            id_ = manifest['id']
            if id_ in seen:
                continue
            seen.add(id_)
            if kind == 'releases':
                approval = json.loads((root / 'release-approvals' / f'{id_}.json').read_text())
                if approval.get('payload_sha256') != digest(manifest_path.parent / 'SHA256SUMS') or approval.get('baseline_confirmed') is not True:
                    raise ValueError(f'{id_}: missing matching approval')
            entry = {k: manifest[k] for k in ('id', 'ratified_date', 'prepared_date', 'source_commit', 'decision', 'provenance')}
            entry.update(url=f'/{folder}/{id_}/', published=kind == 'releases',
                         tag_url=f'{REPO}/tree/{id_}', github_release=f'{REPO}/releases/tag/{id_}',
                         payload_sha256=digest(manifest_path.parent / 'SHA256SUMS'),
                         standard_urls={sid: f'/{folder}/{id_}/' + item['url'] for sid, item in manifest['standards'].items()})
            history[kind].append(entry)
            history['packs'][id_] = entry
            for standard_id, standard in manifest['standards'].items():
                if not standard['ratified']:
                    continue
                item = dict(entry, version=standard['version'], url=entry['url'] + standard['url'],
                            source_sha256=standard['source_sha256'], source_path=standard['source_path'])
                history['standards'].setdefault(standard_id, {'versions': []})['versions'].append(item)
    version_key = lambda item: tuple(int(n) for n in item['id'].removeprefix('OSERA-SP-').split('.'))
    for kind in ('releases', 'candidates'):
        history[kind].sort(key=version_key, reverse=True)
    if history['releases']:
        history['latest'] = history['releases'][0]
    for record in history['standards'].values():
        record['versions'].sort(key=version_key, reverse=True)
        published = [v for v in record['versions'] if v['published']]
        record['official'] = published[0] if published else None
        record['recorded'] = record['versions'][0]
        baseline = record['official'] or record['recorded']
        working = root / baseline['source_path']
        record['changed'] = not working.exists() or digest(working) != baseline['source_sha256']
    return history


def build(destination):
    history = release_history()
    write_json(ROOT / 'docs/_data/release_history.json', history)
    env = dict(os.environ, BUNDLE_GEMFILE=str(ROOT / 'docs/Gemfile'))
    subprocess.run(['bundle', 'exec', 'jekyll', 'build', '--source', str(ROOT / 'docs'),
                    '--destination', str(destination), '--baseurl', ''], cwd=ROOT / 'docs', env=env, check=True)
    for folder in ('releases', 'release-candidates'):
        for source in (ROOT / folder).glob('*/manifest.json'):
            target = destination / folder / source.parent.name
            if target.exists():
                raise ValueError(f'Jekyll unexpectedly produced frozen release path: {target}')
            shutil.copytree(source.parent, target)
            for name, path in files(source.parent).items():
                if digest(path) != digest(target / name):
                    raise ValueError(f'Frozen output differs: {name}')
    print('Live site built; frozen snapshots copied and byte-verified.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path, default=ROOT / 'docs/_site')
    args = parser.parse_args()
    build(args.destination.resolve())
