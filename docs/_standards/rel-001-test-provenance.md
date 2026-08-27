---
schema-version: 0.1.0
sequence: 210
standard_id: REL-001
title: Provider Test Provenance
summary: Test execution methods are provider-dependent, but the provider publishes
  enough test evidence for recipients to understand release validation.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
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
    the test command or suite, runtime when relevant, and test result.
  checkability: manual
  checks:
  - id: REL-001.CHECK-001
    title: Test provenance is recorded
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel001.test_provenance
    evidence:
    - runtime
    - test_command
    - test_result
    - test_report
---

## Requirement

Patch providers MUST publish test provenance for the patched artifact.

The evidence SHOULD identify the test command, test suite, runtime when relevant, test result, and any published test report or log summary.

OSERA does not require every patch fork to run public GitHub Actions CI. Providers MAY use their own validation systems, but recipients need enough published test evidence to understand what was checked.

## Rationale

Older projects can require specialized tooling such as Apache Ant, Gradle 2-5, Java 6-7, or OSGi. A single public CI model is unlikely to fit every patch repository.

This standard is intentionally scoped to test provenance for OSERA-SP-0.1.0. Build provenance, including evidence that a specific binary was built from a specific source tag, is deferred to [REL-007]({{ site.baseurl }}/standards/rel-007-build-provenance-and-signed-attestation/) for OSERA-SP-0.2.0 observe-mode work.

## Example

The July 7 update noted that Moderne uses `mod` CLI for repeatable project validation:

```text
mod exec /path/to/project MODERNE_TEST_CHECK
```

## Evidence

Release evidence SHOULD identify the runtime, relevant test command, test result, and any published test report or log summary used for the patched release.
