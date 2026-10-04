import argparse
import json
import shutil
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'releases'))
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import release
import publish
import build_site


def fixture(root, pack='OSERA-SP-0.1.0', version='0.1.0'):
    root.mkdir(parents=True)
    source_path = 'docs/_standards/rel-001-test.md'
    source = root / 'source' / source_path
    source.parent.mkdir(parents=True)
    source.write_text(f'Approved source {version}\n')
    definition = {'standard_id': 'REL-001', 'standard-version': version,
                  'doc-status': 'Ratified', 'title': 'Test', 'source_path': source_path,
                  'url': '/standards/rel-001-test/', 'requirements': []}
    check = {'id': 'REL-001.CHECK-001', 'title': 'Original rule'}
    data = {'pack': {'id': pack, 'status': 'Ratified', 'included_standards': [
                {'id': 'REL-001', 'version': version, 'checks': [check['id']]}]},
            'standards': [definition], 'profiles': {'REL-001': {
                'effective': {'requirements': {}, 'checks': {'001': check}}, 'relationships': {}}}}
    standard = release.selected_metadata(data)
    standard['REL-001']['source_sha256'] = release.digest(source)
    manifest = {'id': pack, 'standards': standard, 'ratified_date': '2026-09-10',
                'prepared_date': '2026-10-04', 'source_commit': 'a' * 40,
                'source_pack_status': 'Ratified', 'decision': 'https://example.test/decision', 'provenance': 'Fixture'}
    release.write_json(root / 'manifest.json', manifest)
    release.write_json(root / 'resolved.json', data)
    (root / 'standards/rel-001-test').mkdir(parents=True)
    (root / 'standards/rel-001-test/index.html').write_text('<h1 id="standard">Approved test</h1><a href="../../index.html">Home</a>')
    (root / 'index.html').write_text('<a href="standards/rel-001-test/index.html#standard">Standard</a>')
    release.seal(root)
    return root


def approval(root):
    manifest = json.loads((root / 'manifest.json').read_text())
    return {'pack': manifest['id'], 'source_commit': manifest['source_commit'],
            'payload_sha256': release.digest(root / 'SHA256SUMS'),
            'baseline_confirmed': True, 'approval_url': 'https://example.test/approval', 'approved_by': ['reviewer']}


class ReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.candidate = fixture(self.root / 'release-candidates/OSERA-SP-0.1.0')

    def data(self):
        return json.loads((self.candidate / 'resolved.json').read_text())

    def test_missing_exact_version_rejected(self):
        data = self.data()
        data['standards'][0]['standard-version'] = '0.2.0'
        with self.assertRaisesRegex(ValueError, 'Missing exact version'):
            release.selected_metadata(data)

    def test_unknown_check_rejected(self):
        data = self.data()
        data['pack']['included_standards'][0]['checks'] = ['REL-001.CHECK-999']
        with self.assertRaisesRegex(ValueError, 'Unknown effective check'):
            release.selected_metadata(data)

    def test_parent_must_be_pinned(self):
        data = self.data()
        data['standards'][0]['extends'] = 'REL-000'
        with self.assertRaisesRegex(ValueError, 'parent REL-000 must be pinned'):
            release.selected_metadata(data)

    def test_payload_and_zip_tamper_rejected(self):
        release.validate(self.candidate)
        (self.candidate / 'index.html').write_text('changed')
        with self.assertRaisesRegex(ValueError, 'Changed snapshot'):
            release.validate(self.candidate)
        release.seal(self.candidate)
        (self.candidate / 'OSERA-SP-0.1.0.zip').write_bytes(b'not approved bytes')
        with self.assertRaisesRegex(ValueError, 'Archive checksum'):
            release.validate(self.candidate)

    def test_archive_bytes_deterministic(self):
        before = (self.candidate / 'OSERA-SP-0.1.0.zip').read_bytes()
        release.seal(self.candidate)
        self.assertEqual(before, (self.candidate / 'OSERA-SP-0.1.0.zip').read_bytes())

    def test_links_fail_on_missing_file_anchor_and_escape(self):
        for link in ('missing.html', 'standards/rel-001-test/index.html#missing', '../outside.html', '/standards/live/'):
            with self.subTest(link=link):
                (self.candidate / 'index.html').write_text(f'<a href="{link}">Bad</a>')
                with self.assertRaises(ValueError):
                    release.check_links(self.candidate)

    def test_promote_requires_exact_approval_and_preserves_bytes(self):
        record = self.root / 'approval.json'
        value = approval(self.candidate)
        value['baseline_confirmed'] = False
        release.write_json(record, value)
        args = argparse.Namespace(candidate=str(self.candidate), approval=str(record))
        with patch.object(release, 'ROOT', self.root):
            with self.assertRaisesRegex(ValueError, 'Approval must confirm'):
                release.promote(args)
            value['baseline_confirmed'] = True
            release.write_json(record, value)
            release.promote(args)
            official = self.root / 'releases/OSERA-SP-0.1.0'
            self.assertTrue(release.files_equal(self.candidate, official))
            release.promote(args)

    def test_history_keeps_two_versions_and_detects_same_version_edits(self):
        first = fixture(self.root / 'releases/OSERA-SP-0.1.0')
        second = fixture(self.root / 'releases/OSERA-SP-0.2.0', 'OSERA-SP-0.2.0', '0.2.0')
        for folder in (first, second):
            release.write_json(self.root / 'release-approvals' / f'{folder.name}.json', approval(folder))
        working = self.root / 'docs/_standards/rel-001-test.md'
        working.parent.mkdir(parents=True)
        working.write_text('Approved source 0.2.0\n')
        history = build_site.release_history(self.root)
        self.assertEqual(history['latest']['id'], 'OSERA-SP-0.2.0')
        record = history['standards']['REL-001']
        self.assertEqual([v['version'] for v in record['versions']], ['0.2.0', '0.1.0'])
        self.assertFalse(record['changed'])
        working.write_text('Later edits without a version bump')
        self.assertTrue(build_site.release_history(self.root)['standards']['REL-001']['changed'])
        working.unlink()
        self.assertIn('REL-001', build_site.release_history(self.root)['packs']['OSERA-SP-0.1.0']['standard_urls'])
        self.assertEqual(history['candidates'], [])

    def test_unconfirmed_candidate_never_becomes_official(self):
        history = build_site.release_history(self.root)
        self.assertIsNone(history['latest'])
        self.assertIsNone(history['standards']['REL-001']['official'])
        self.assertFalse(history['candidates'][0]['published'])

    def test_trusted_base_detects_resealed_payload_and_deleted_files(self):
        release_dir = fixture(self.root / 'releases/OSERA-SP-0.1.0')
        def git(*args):
            subprocess.run(['git', *args], cwd=self.root, check=True, capture_output=True)
        git('init')
        git('add', '.')
        git('-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '-m', 'baseline')
        release.protect('HEAD', root=self.root)
        (release_dir / 'index.html').write_text('changed and resealed')
        release.seal(release_dir)
        with self.assertRaisesRegex(ValueError, 'immutable'):
            release.protect('HEAD', root=self.root)
        git('checkout', 'HEAD', '--', 'releases')
        (release_dir / 'index.html').unlink()
        with self.assertRaisesRegex(ValueError, 'immutable'):
            release.protect('HEAD', root=self.root)

    def test_immutable_controls_fail_closed(self):
        with patch.object(publish, 'api', return_value=None):
            with self.assertRaisesRegex(ValueError, 'Cannot verify immutable'):
                publish.controls('example/repo')

    def test_existing_assets_must_match_not_clobber(self):
        asset = self.candidate / 'manifest.json'
        value = {'assets': [{'name': 'manifest.json', 'id': 1}]}
        with patch.object(publish.subprocess, 'check_output', return_value=b'different'):
            with self.assertRaisesRegex(ValueError, 'never overwrite'):
                publish.verify_assets('example/repo', value, [asset])
        with patch.object(publish.subprocess, 'check_output', return_value=asset.read_bytes()):
            self.assertEqual(publish.verify_assets('example/repo', value, [asset]), set())


    def test_external_assets_rejected(self):
        (self.candidate / 'index.html').write_text('<img src="https://example.test/live.png">')
        with self.assertRaisesRegex(ValueError, 'not self-contained'):
            release.check_links(self.candidate)

    def test_published_release_retry_is_read_only_and_checks_tag(self):
        official = fixture(self.root / 'releases/OSERA-SP-0.1.0')
        release.write_json(self.root / 'release-approvals/OSERA-SP-0.1.0.json', approval(official))
        commit = 'b' * 40
        args = argparse.Namespace(pack='OSERA-SP-0.1.0', commit=commit, repo='example/repo', publish=True)
        def git(*args, **kwargs):
            if args[:2] == ('git', 'rev-parse'): return commit
            return ''
        calls = []
        def remote(path, method='GET', body=None, missing=False):
            calls.append(method)
            if '/git/ref/tags/' in path: return {'object': {'type': 'tag', 'sha': 'c' * 40}}
            if '/git/tags/' in path: return {'object': {'type': 'commit', 'sha': commit}}
            return {'draft': False, 'immutable': True, 'assets': []}
        with patch.object(publish, 'ROOT', self.root), patch.object(publish, 'run', git), patch.object(publish, 'controls'), patch.object(publish, 'api', remote), patch.object(publish, 'verify_assets') as assets:
            publish.publish(args)
            assets.assert_called_once()
            self.assertEqual(set(calls), {'GET'})
        def wrong_tag(path, **kwargs):
            if '/git/ref/tags/' in path: return {'object': {'type': 'tag', 'sha': 'c' * 40}}
            return {'object': {'type': 'commit', 'sha': 'd' * 40}}
        with patch.object(publish, 'ROOT', self.root), patch.object(publish, 'run', git), patch.object(publish, 'controls'), patch.object(publish, 'api', wrong_tag):
            with self.assertRaisesRegex(ValueError, 'never move'):
                publish.publish(args)

    def test_prepare_next_pack_from_live_templates(self):
        # Exercise the real generator against a private fixture commit. This
        # must work even after live pages acquire release-history navigation.
        repo = self.root / 'next-pack-fixture'
        repo.mkdir()
        shutil.copytree(release.ROOT / 'docs', repo / 'docs',
                        ignore=shutil.ignore_patterns('_site', '.jekyll-cache', '.bundle'))
        shutil.copytree(release.ROOT / 'tools', repo / 'tools', ignore=shutil.ignore_patterns('__pycache__'))
        if (release.ROOT / 'docs/.bundle').exists():
            shutil.copytree(release.ROOT / 'docs/.bundle', repo / 'docs/.bundle')
        code = """require 'yaml'; require 'date'; pth='docs/_data/standard_packs.yml'; packs=YAML.safe_load(File.read(pth),permitted_classes:[Date]); p=packs.first; p['id']='OSERA-SP-0.2.0'; all=Dir['docs/_standards/*.md'].map{|f| d=YAML.safe_load(File.read(f).split('---')[1],permitted_classes:[Date]); [d['standard_id'],d['standard-version']]}.to_h; %w[included_standards advisory_standards observe_standards deferred_standards].each{|k| Array(p[k]).each{|e|e['version']=all[e['id']]}}; File.write(pth,YAML.dump([p]));"""
        subprocess.run(['ruby', '-e', code], cwd=repo, check=True)
        for args in (['init'], ['add', 'docs'], ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-m', 'Private fixture']):
            subprocess.run(['git', *args], cwd=repo, check=True, capture_output=True)
        sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip()
        args = argparse.Namespace(pack='OSERA-SP-0.2.0', source=sha, decision='https://example.test/fixture', date='2026-10-04', provenance='Unpublished local test fixture', output=str(repo / 'snapshot'))
        original_run = release.run
        def fixture_run(*args, **kwargs):
            kwargs.setdefault('cwd', repo)
            return original_run(*args, **kwargs)
        with patch.object(release, 'ROOT', repo), patch.object(release, 'run', fixture_run):
            release.prepare(args)
        manifest = release.validate(repo / 'snapshot')
        self.assertEqual(manifest['id'], 'OSERA-SP-0.2.0')
        page = (repo / 'snapshot/standards/rel-001-test-provenance/index.html').read_text()
        self.assertNotIn('version-history', page)
        self.assertIn('Preserved release snapshot', page)
        self.assertIn('0.2.0', page)
        pack_page = (repo / 'snapshot/standard-packs/index.html').read_text()
        self.assertIn('OSERA-SP-0.2.0 pack definition', pack_page)


if __name__ == '__main__':
    unittest.main()
