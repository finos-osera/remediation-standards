---
schema-version: 0.1.0
sequence: 210
standard_id: REL-001
title: Provider Test Provenance
summary: Test execution methods are provider-dependent, but the provider publishes
  a unit-test report artifact for recipients to understand release validation.
doc-status: Draft
standard-version: 0.2.0
candidate-pack: OSERA-SP-0.2.0 required
ratified-in: OSERA-SP-0.1.0
ratified-date: '2026-09-10'
fitness-role: Required evidence
type: REL
category: Release Process
applies-to:
- Patch providers
- Enterprise recipients
requirements:
- id: REL-001.REQ-001
  level: MUST
  text: Patch providers must publish test provenance for the patched artifact, including
    the tested commit, a test command or suite that runs at least the tests the fix's
    commits added or changed, runtime when relevant, test report, and passing test
    result.
  checkability: automated
  checks:
  - id: REL-001.CHECK-001
    title: Test provenance is recorded
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel001.test_provenance
    evidence:
    - tested_commit
    - runtime
    - test_command
    - fix_test_files
    - test_result
    - test_report_artifact
    - no_failed_tests
- id: REL-001.REQ-002
  level: MUST
  text: A release that changes no source in its repository, only the versions its
    build pins and the OSERA plumbing files, must record as its test provenance the
    release it pins that carried the fix, whose own test provenance passed.
  checkability: automated
  checks:
  - id: REL-001.CHECK-002
    title: A release that changes no source names the tested release it carries
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel001.carried_test_provenance
    evidence:
    - changed_files
    - tested_repository
    - tested_release
    - tested_commit
    - carried_test_result
- id: REL-001.REQ-003
  level: MUST
  text: Release evidence must identify the exact test report bytes by SHA-256,
    covered by the verified signed fitness result, and the gate must verify the
    digest against the published report, including any inherited report.
  checkability: automated
  checks:
  - id: REL-001.CHECK-003
    title: Test report digest matches the report and is covered by signed evidence
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel001.test_report_binding
    evidence:
    - evidence_version
    - test_report_artifact
    - test_report_sha256
    - observed_report_sha256
    - signed_fitness_result
    - evidence_digest
    - signature_verification
---

## Requirement

Patch providers MUST publish test provenance for the patched artifact.

The evidence MUST identify the tested commit or source tag, test command or suite, runtime when relevant, a published unit-test report artifact, and the pass/fail outcome.

For SP-0.1.0 alignment, the published unit-test report MUST identify no failed tests for the release being claimed.

### What the tests cover

The command MUST run at least the tests the fix's commits added or changed: the regression tests that show the vulnerability closed at the tested commit. That is the floor. The command SHOULD run the suite of the module the fix touched, and MAY run the project's suite; broader evidence is accepted and preferred wherever the era's build can run it. A command that runs less than the tests the fix touched is not test provenance for the fix.

The floor is set at the fix's own tests because that is what every patch can run: a backport to a release whose upstream build can no longer run in full can still compile the module and run the tests that were written for the fix. A provider that can run more records more.

OSERA does not require every patch fork to run public GitHub Actions CI. Providers MAY use their own validation systems, but recipients need enough published test evidence to understand what was checked.

### A release that changes no source

Under [REL-009-JAVA]({{ site.baseurl }}/standards/rel-009-java-line-release-and-bom-propagation/), a line releases whole and every BOM that pins it releases again. Most of those releases change no source in their own repository: the commit under the tag moves the version the BOM pins, and nothing else. The fix was tested where it was made, in the lower line's repository at that line's release tag. There is nothing to run in the BOM's repository, and a tests block claiming a run there would be false.

Such a release MUST record as its test provenance the release it pins that carried the fix. The tests block names the tested repository (`repository`, the provider's patch repository of the lower line, in the same organisation) and the release tag there (`release`); `commit`, `command`, `runtime`, `report` and `result` then describe the tests of that release, as its own evidence file records them. The named release MUST be one this release pins, and its own test provenance MUST have passed.

A release qualifies only when every file changed since the previous release tag, or since the baseline tag when there is none, is build metadata that declares versions, such as a POM, a Gradle build script, a properties file or a version catalog, or an OSERA plumbing file, the evidence file and the fitness workflow. A release that changes any source, resource or test file records its own tests under REL-001.REQ-001.

This requirement depends on REL-009-JAVA. Without line releases and BOM propagation there is no release that changes no source, and REL-001.REQ-001 applies to every release.

### Test-report digest binding

For packs adopting REL-001 0.2.0 with CHECK-003, the producer MUST add `tests.report_sha256` to `.osera/patch-evidence.yaml`, containing exactly 64 lowercase hexadecimal characters, without a `sha256:` prefix. It is the SHA-256 of the complete report file's bytes, including its archive container if applicable, not a hash of extracted files. `tests.report` continues to identify the report; this requirement does not prescribe ZIP or any ecosystem-specific filename.

The evidence file MUST declare top-level `evidence-version: "0.2.0"` for this proposed contract. This is the release-evidence format version, distinct from a standards pack, an individual standard version, or the `schema-version` of standard front matter. Earlier unversioned/name-only evidence remains valid only under the earlier requirements; a reader MUST NOT silently downgrade or accept an unsupported evidence version for CHECK-003. The [test-report binding schema]({{ site.baseurl }}/schemas/osera-test-report-binding-0.2.0.schema.json) validates this extension, not the entire cross-standard evidence file.

The fitness run MUST bind the report name and digest to the tested repository/release/commit in its signed result. It may embed that evidence or include a SHA-256 reference to the exact retained evidence-file bytes containing those fields. The gate MUST verify the signature and signer authorization under the applicable pack's signed-result contract, verify any evidence-file digest reference, fetch the named report, recompute its SHA-256 and compare it with `tests.report_sha256`. A signature on a filename or an unverified digest assertion alone is insufficient. Signature envelope and trust-policy details remain coordinated with [#57](https://github.com/finos-osera/remediation-standards/issues/57); adopting this check as blocking requires that verification contract and its implementation to be available.

For a release carrying another release's test provenance under REQ-002, the current evidence MUST include the same `report_sha256` as the tested release's evidence, and the gate MUST verify the report bytes at that tested repository/release. The tested release's evidence must itself bind that report digest through verified signed fitness evidence. A previously accepted name-only report cannot be inherited as satisfying CHECK-003 without a new, retained digest-bound evaluation; its original acceptance remains unchanged. The report need not be copied or renamed for the consuming release.

The producer calculates the report digest after completing the tests, commits the evidence file, then tags the release and runs fitness. This avoids a circular dependency: the report does not need to contain the later evidence commit or fitness signature.

## Rationale

Older projects can require specialized tooling such as Apache Ant, Gradle 2-5, Java 6-7, or OSGi. A single public CI model is unlikely to fit every patch repository.

This standard covers test provenance; the 0.2.0 draft adds exact report-byte binding without changing the frozen OSERA-SP-0.1.0 requirements. Build provenance, including evidence that a specific binary was built from a specific source tag, is deferred to [REL-007]({{ site.baseurl }}/standards/rel-007-build-provenance-and-signed-attestation/) for OSERA-SP-0.2.0 observe-mode work.

## Example

The July 7 update noted that Moderne uses `mod` CLI for repeatable project validation:

```text
mod exec /path/to/project MODERNE_TEST_CHECK
```

A Spring Boot release that only re-pins the Logback line, whose `logback-core` was patched and tested in `patch-logback`, records that release's tests. This draft 0.2.0 fragment uses an illustrative digest that must be replaced with the actual report hash:

```yaml
evidence-version: "0.2.0"
tests:
  repository: dev-finos-osera-forks/patch-logback
  release: v1.2.13.1-osera-00002
  commit: dfa0c296b9042eab9e7cc49bf7ed57db234aa952
  command: mvn -B -pl logback-core -am clean test -Dmaven.javadoc.skip=true
  runtime: OpenJDK 1.8.0_372 (Zulu), Apache Maven 3.9.14
  report: logback-core-1.2.13.1-osera-00002-tests.zip
  report_sha256: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  result: pass
  note: no source changed in this repository; the release pins logback-core 1.2.13.1-osera-00002, tested there
```

## Evidence

Release evidence SHOULD identify the runtime, relevant test command, test result, and published unit-test report artifact used for the patched release.

`REL-001.CHECK-001` stays structural. It reads the tests block, resolves the tested commit and the report's name, and now also records the test files the fix's commits added or changed between the baseline tag and the tested commit (`fix_test_files`), so the record shows the floor beside the command that claims to meet it. Whether the command ran those tests, and whether the report shows them passing, is examined at the gate from the report, as before.

A release that changes no source records, in addition, the tested repository and its release tag. `REL-001.CHECK-002` reads the files changed since the previous release tag, or the baseline tag, and fails when any is a source, resource or test file; reads the named release's evidence in the named repository and fails when it is not there, when its `REL-001.CHECK-001` did not pass, or when this release does not pin it; and fails when the tests block names a commit that is not the tested commit of that release.

`REL-001.CHECK-003` fails for missing or malformed version/digest fields, missing reports, mismatched report or evidence-file digests, absent or invalid signatures, unauthorized signers, or a mismatch with inherited report evidence. When verification cannot be completed, it remains unresolved and blocks an alignment claim; it MUST NOT pass or become `not-applicable`. Report-content checks for the claimed test outcome still apply independently.

See [release-file examples]({{ site.baseurl }}/examples/release-sidecars/) for promotion and failure cases. These draft additions address [#78](https://github.com/finos-osera/remediation-standards/issues/78) prospectively; they require neither republishing existing reports nor changing earlier pack verdicts.

## Revisions

* 0.1.0, ratified in OSERA-SP-0.1.0 on 2026-09-10: REL-001.REQ-001 and REL-001.CHECK-001.
* 0.2.0, draft for OSERA-SP-0.2.0: adds REL-001.REQ-002 and REL-001.CHECK-002 for a release that changes no source, depending on REL-009-JAVA; sets the floor of REL-001.REQ-001 at the tests the fix's commits added or changed, a module suite preferred, and has REL-001.CHECK-001 record those test files beside the command. CHECK-001's pass condition is unchanged. Adds REQ-003/CHECK-003 for SHA-256 report binding, the proposed evidence-version 0.2.0 extension, signed coverage and inherited-report verification; these checks are not added to the frozen 0.1.0 pack.
