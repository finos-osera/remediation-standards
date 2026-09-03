---
schema-version: 0.1.0
sequence: 30
standard_id: FORK-003
title: Baseline Tags
summary: Every patch line identifies its unpatched starting source SHA with a `v<VERSION>+patch.baseline`
  tag.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: '2026-09-04'
fitness-role: Required check
type: FORK
category: Fork Management
applies-to:
- Patch providers
- Enterprise recipients
requirements:
- id: FORK-003.REQ-001
  level: MUST
  text: Patch providers must tag the unpatched baseline source commit using v<VERSION>+patch.baseline.
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

Patch providers MUST tag the commit that represents the unpatched baseline source state for a patched version.

The tag MUST use the form:

```text
v<VERSION>+patch.baseline
```

This tag scheme applies regardless of the upstream project tag convention.

## Rationale

Recipients need an unambiguous starting point for source comparison, provenance review, and audit evidence.

The `+patch.baseline` suffix is deliberately a source baseline marker. It does not identify an official patched release or artifact. Official OSERA patched release-coordinate naming remains pending in [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) until package resolver and dependency update-tool compatibility evidence is reviewed.

The `<VERSION>` segment in `v<VERSION>+patch.baseline` SHOULD correspond to the source branch version in [FORK-002]({{ site.baseurl }}/standards/fork-002-patch-branches/) and the upstream version segment in the selected patched-release identifier once [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) is ratified.

## Evidence

Patch evidence SHOULD include the baseline tag, the commit SHA it resolves to, and the corresponding upstream version or artifact.

## Observed OSERA examples

Public OSERA repositories currently include baseline tags such as:

* `backpatch-spring-framework`: `v5.3.39+backpatch.baseline`
* `backpatch-gson`: `v2.8.8+backpatch.baseline`
* `backpatch-activemq`: `v5.14.5+backpatch.baseline`
* `backpatch-logback`: `v1.2.9+backpatch.baseline`

These observed tags are legacy/proof-of-concept evidence that predates the proposed `+patch.baseline` convention.
