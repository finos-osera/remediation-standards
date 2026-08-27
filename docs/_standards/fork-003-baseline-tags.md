---
schema-version: 0.1.0
sequence: 30
standard_id: FORK-003
title: Baseline Tags
summary: Every backpatch line identifies its starting source SHA with a `v<VERSION>+backpatch.baseline`
  tag.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: FORK
category: Fork Management
applies-to:
- Patch providers
- Enterprise recipients
requirements:
- id: FORK-003.REQ-001
  level: MUST
  text: Patch providers must tag the baseline source commit using v<VERSION>+backpatch.baseline.
  checkability: automated
  checks:
  - id: FORK-003.CHECK-001
    title: Baseline tag exists and resolves to a commit
    type: repository
    severity: blocking
    implementation: osera-fitness.fork003.baseline_tag
    evidence:
    - baseline_tag
    - baseline_commit
---

## Requirement

Patch providers MUST tag the commit that represents the baseline source state for a backpatched version.

The tag MUST use the form:

```text
v<VERSION>+backpatch.baseline
```

This tag scheme applies regardless of the upstream project tag convention.

## Rationale

Recipients need an unambiguous starting point for source comparison, provenance review, and audit evidence.

## Evidence

Patch evidence SHOULD include the baseline tag, the commit SHA it resolves to, and the corresponding upstream version or artifact.

## Observed OSERA examples

Public OSERA repositories currently include baseline tags such as:

* `backpatch-spring-framework`: `v5.3.39+backpatch.baseline`
* `backpatch-gson`: `v2.8.8+backpatch.baseline`
* `backpatch-activemq`: `v5.14.5+backpatch.baseline`
* `backpatch-logback`: `v1.2.9+backpatch.baseline`
