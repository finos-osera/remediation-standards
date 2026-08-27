---
schema-version: 0.1.0
sequence: 210
standard_id: REL-001
title: Provider Build Process
summary: Build and test methods are provider-dependent, but the provider records enough
  detail for repeatable release evidence.
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
  text: Patch providers must define the build and test process used to produce a patched
    artifact.
  checkability: manual
  checks:
  - id: REL-001.CHECK-001
    title: Build and test evidence is recorded
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel001.build_test_evidence
    evidence:
    - build_tool
    - runtime
    - test_command
    - validation_result
---

## Requirement

Patch providers MUST define the build and test process used to produce a patched artifact.

OSERA does not require every backpatch fork to run public GitHub Actions CI. Providers MAY use their own build execution and validation systems.

## Rationale

Older projects can require specialized build tooling such as Apache Ant, Gradle 2-5, Java 6-7, or OSGi. A single public CI model is unlikely to fit every backpatch repository.

## Example

The July 7 update noted that Moderne uses `mod` CLI to build and test repositories it does not own frequently:

```text
mod exec /path/to/project MODERNE_BUILD_TOOL_CHECK
```

## Evidence

Release evidence SHOULD identify the build tool, runtime, relevant test command, and validation result used for the published artifact.

## Observed OSERA example

The `backpatch-activemq` repository includes fork-maintenance work disabling GitHub Actions on the fork, which supports keeping public CI optional while requiring providers to record their own release evidence:

<https://github.com/finos-osera/backpatch-activemq/commit/ff29ab870ba35275f7363fda8a6653a7615722eb>
