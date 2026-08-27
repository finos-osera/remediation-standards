---
schema-version: 0.1.0
sequence: 230
standard_id: REL-003
title: Patch Initiative Version Metadata
summary: Patched releases use SemVer build metadata that identifies the patching initiative
  and release sequence.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: REL
category: Release Process
applies-to:
- Patch providers
- Enterprise recipients
requirements:
- id: REL-003.REQ-001
  level: SHOULD
  text: Official OSERA patched releases should use SemVer build metadata in the form
    <UPSTREAM_VERSION>+osera-patch.NNN.
  checkability: automated
  checks:
  - id: REL-003.CHECK-001
    title: Official release metadata uses the OSERA patch token
    type: release
    severity: blocking
    implementation: osera-fitness.rel003.osera_patch_metadata
    evidence:
    - release_tag
    - artifact_version
- id: REL-003.REQ-002
  level: MUST
  text: Release tags, artifact versions, vulnerability feeds, and release evidence
    must carry the same patched-release identifier.
  checkability: partially-automated
  checks:
  - id: REL-003.CHECK-002
    title: Release identifier is consistent across source, artifact, and feeds
    type: release
    severity: blocking
    implementation: osera-fitness.rel003.identifier_consistency
    evidence:
    - release_tag
    - artifact_version
    - feed_purl
---

## Requirement

Patch providers SHOULD release patched artifacts using SemVer build metadata in the form:

```text
<UPSTREAM_VERSION>+<PATCH_INITIATIVE>.NNN
```

`<PATCH_INITIATIVE>` SHOULD identify the patching initiative, provider, or organization responsible for the patched release. For OSERA-managed releases, the candidate metadata token is:

```text
osera-patch.NNN
```

`NNN` MUST be monotonically increasing for the same upstream version line and patching initiative.

Release tags, artifact versions, vulnerability feeds, and release evidence MUST carry the same patched-release identifier so recipients can correlate source, binary, scanner, and advisory records.

Existing OSERA backpatch repositories currently use `+backpatch.NNN`. The working group should treat that form as legacy/proof-of-concept evidence. Official signed artifacts claiming OSERA-SP-0.1.0 alignment SHOULD use `+osera-patch.NNN`.

This standard defines the official patched-release identity. It does not rename source workflow branches or baseline tags. [FORK-002]({{ site.baseurl }}/standards/fork-002-backpatch-branches/) deliberately keeps `backpatch/<version>` as the source branch convention, and [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/) deliberately keeps `v<VERSION>+backpatch.baseline` for the unpatched source baseline.

## Rationale

This form preserves the upstream version while making the patched artifact distinguishable. It follows the [Semantic Versioning 2.0.0](https://semver.org/) build metadata shape, where metadata is appended after `+` as dot-separated identifiers.

Including the patching initiative in the visible component coordinate helps SCA tools, inventories, and approval workflows distinguish OSERA-managed releases from other downstream backpatch providers when repository or feed metadata is not shown.

The numeric suffix keeps ordering simple for repeated releases on the same upstream version line. Some build tools may compare SemVer build metadata differently or rank `5.3.39+osera-patch.001` lower than the plain upstream `5.3.39`, so consumers SHOULD pin the exact patched version rather than relying on dynamic version resolution.

Package URLs MUST encode `+` as `%2B`, for example `pkg:maven/org.example/example-lib@1.0.0%2Bosera-patch.001`.

## Examples

```text
5.3.39+osera-patch.001
5.3.39+osera-patch.002
```

## Observed OSERA examples

Public OSERA repositories currently include legacy/proof-of-concept `+backpatch.NNN` release tags such as:

* `backpatch-spring-framework`: `v5.3.39+backpatch.001`
* `backpatch-gson`: `v2.8.8+backpatch.001`
* `backpatch-activemq`: `v5.14.5+backpatch.001`
