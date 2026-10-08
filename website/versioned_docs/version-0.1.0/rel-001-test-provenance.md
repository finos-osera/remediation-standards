---
id: rel-001-test-provenance
title: REL-001 · Provider Test Provenance
sidebar_label: REL-001 · Provider Test Provenance
sidebar_position: 210
description: Test execution methods are provider-dependent, but the provider
  publishes a unit-test report artifact for recipients to understand release
  validation.
---

:::info[Recorded ratified · archive candidate]

**Standard 0.1.0** · Release Process. OSERA-SP-0.1.0 was ratified on September 10, 2026; this reconstruction awaits baseline confirmation.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Test execution methods are provider-dependent, but the provider publishes a unit-test report artifact for recipients to understand release validation.


## Requirement

Patch providers MUST publish test provenance for the patched artifact.

The evidence MUST identify the tested commit or source tag, test command or suite, runtime when relevant, a published unit-test report artifact, and the pass/fail outcome.

For SP-0.1.0 alignment, the published unit-test report MUST identify no failed tests for the release being claimed.

OSERA does not require every patch fork to run public GitHub Actions CI. Providers MAY use their own validation systems, but recipients need enough published test evidence to understand what was checked.

## Rationale

Older projects can require specialized tooling such as Apache Ant, Gradle 2-5, Java 6-7, or OSGi. A single public CI model is unlikely to fit every patch repository.

This standard is intentionally scoped to test provenance for OSERA-SP-0.1.0. Build provenance, including evidence that a specific binary was built from a specific source tag, is deferred to [REL-007](/standards/0.1.0/rel-007-build-provenance-and-signed-attestation/) for OSERA-SP-0.2.0 observe-mode work.

## Example

The July 7 update noted that Moderne uses `mod` CLI for repeatable project validation:

```text
mod exec /path/to/project MODERNE_TEST_CHECK
```

## Evidence

Release evidence SHOULD identify the runtime, relevant test command, test result, and published unit-test report artifact used for the patched release.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 210
standard_id: REL-001
title: Provider Test Provenance
summary: Test execution methods are provider-dependent, but the provider
  publishes a unit-test report artifact for recipients to understand release
  validation.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: 2026-09-10
fitness-role: Required evidence
type: REL
category: Release Process
applies-to:
  - Patch providers
  - Enterprise recipients
requirements:
  - id: REL-001.REQ-001
    level: MUST
    text: Patch providers must publish test provenance for the patched artifact,
      including the tested commit, test command or suite, runtime when relevant,
      test report, and passing test result.
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
          - test_result
          - test_report_artifact
          - no_failed_tests
```

## Source provenance

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/rel-001-test-provenance.md) · Source SHA-256: `52767ff7f5146c932a55c4e9359debbd18ba4b57af7584b88de8fcdad656dda7`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
