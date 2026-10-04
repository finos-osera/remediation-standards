import argparse
import copy
import json
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


if __name__ == '__main__':
    unittest.main()
