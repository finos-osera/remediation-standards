"""Contract tests for the proposed report-binding extension, not gate verification.

Run with: python -m unittest discover -s tools/test -p '*_schema_test.py'
Requires jsonschema >=4,<5.
"""
import copy
import json
from pathlib import Path
import unittest

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[2]
SCHEMA = json.loads((ROOT / "docs/schemas/osera-test-report-binding-0.2.0.schema.json").read_text())


class ReportBindingSchemaTest(unittest.TestCase):
    def setUp(self):
        self.validator = Draft202012Validator(SCHEMA)
        self.evidence = {
            "evidence-version": "0.2.0",
            "tests": {"report": "sample-tests.zip", "report_sha256": "ab" * 32},
        }

    def test_schema_is_valid(self):
        Draft202012Validator.check_schema(SCHEMA)

    def test_local_report_and_unrelated_evidence_are_allowed(self):
        self.evidence["patch"] = {"provider": "example"}
        self.evidence["tests"].update(commit="1" * 40, command="mvn test", result="pass")
        self.validator.validate(self.evidence)

    def test_inherited_report_requires_repository_and_release_together(self):
        self.evidence["tests"].update(repository="example/patch-sample", release="v1.2.3")
        self.validator.validate(self.evidence)
        for key in ("repository", "release"):
            with self.subTest(missing=key):
                invalid = copy.deepcopy(self.evidence)
                del invalid["tests"][key]
                self.assertFalse(self.validator.is_valid(invalid))

    def test_name_only_legacy_evidence_cannot_pass_new_contract(self):
        for key in ("report", "report_sha256"):
            with self.subTest(missing=key):
                invalid = copy.deepcopy(self.evidence)
                del invalid["tests"][key]
                self.assertFalse(self.validator.is_valid(invalid))
        for key in ("evidence-version", "tests"):
            with self.subTest(missing=key):
                invalid = copy.deepcopy(self.evidence)
                del invalid[key]
                self.assertFalse(self.validator.is_valid(invalid))

    def test_digest_is_exact_lowercase_hex_without_prefix_or_whitespace(self):
        for digest in ("", "a" * 63, "a" * 65, "A" * 64, "g" * 64,
                       "sha256:" + "a" * 64, "a" * 64 + "\n", " " + "a" * 64,
                       123, None):
            with self.subTest(digest=digest):
                self.evidence["tests"]["report_sha256"] = digest
                self.assertFalse(self.validator.is_valid(self.evidence))

    def test_unknown_versions_are_not_downgraded(self):
        for version in ("0.1.0", "0.3.0", 0.2, None):
            with self.subTest(version=version):
                self.evidence["evidence-version"] = version
                self.assertFalse(self.validator.is_valid(self.evidence))

    def test_names_and_inherited_identity_cannot_be_blank(self):
        self.evidence["tests"].update(repository="example/patch-sample", release="v1.2.3")
        for key in ("report", "repository", "release"):
            for value in ("", " \n\t", None, 42):
                with self.subTest(key=key, value=value):
                    invalid = copy.deepcopy(self.evidence)
                    invalid["tests"][key] = value
                    self.assertFalse(self.validator.is_valid(invalid))


if __name__ == "__main__":
    unittest.main()
