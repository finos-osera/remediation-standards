---
schema-version: 0.1.0
sequence: 230
standard_id: REL-003
title: Patch Initiative Version Metadata
summary: Java package patched releases use SemVer build metadata that identifies
  the patching initiative and release sequence.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 pending test results
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: REL
category: Release Process
applies-to:
- Java package patch providers
- Enterprise Java recipients
requirements:
- id: REL-003.REQ-001
  level: MUST
  text: Official OSERA patched releases in the OSERA-SP-0.1.0 Java package profile
    must use SemVer build metadata in the form <UPSTREAM_VERSION>+osera-patch.NNN.
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

For OSERA-SP-0.1.0, this standard defines the proposed convention for Java package artifacts. The default OSERA intent is to preserve SemVer 2.0 semantics where practical, but each package ecosystem MAY require a package-specific profile that adapts the release identifier to the conventions, resolver behavior, repository metadata, and update tooling used by that ecosystem.

Official OSERA Java package patched releases MUST use SemVer build metadata in the form:

```text
<UPSTREAM_VERSION>+<PATCH_INITIATIVE>.NNN
```

`<PATCH_INITIATIVE>` SHOULD identify the patching initiative, provider, or organization responsible for the patched release. For OSERA-managed releases, the candidate metadata token is:

```text
osera-patch.NNN
```

`NNN` MUST be monotonically increasing for the same upstream version line and patching initiative.

Release tags, artifact versions, vulnerability feeds, and release evidence MUST carry the same patched-release identifier so recipients can correlate source, binary, scanner, and advisory records.

Existing OSERA backpatch repositories currently use `+backpatch.NNN`. The working group should treat that form as legacy/proof-of-concept evidence. Official signed Java package artifacts claiming OSERA-SP-0.1.0 alignment MUST use `+osera-patch.NNN`.

This standard defines the official patched-release identity. It does not rename source workflow branches or baseline tags. [FORK-002]({{ site.baseurl }}/standards/fork-002-patch-branches/) deliberately uses `patch/<version>` as the source branch convention, and [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/) deliberately uses `v<VERSION>+patch.baseline` for the unpatched source baseline.

## Rationale

This form preserves the upstream version while making the patched artifact distinguishable. It follows the [Semantic Versioning 2.0.0](https://semver.org/) build metadata shape, where metadata is appended after `+` as dot-separated identifiers. That is the default OSERA naming intent, not a claim that every package manager, repository manager, SCA tool, or dependency-update tool will interpret `+` metadata consistently.

Including the patching initiative in the visible component coordinate helps SCA tools, inventories, and approval workflows distinguish OSERA-managed releases from other downstream patch providers when repository or feed metadata is not shown.

The numeric suffix keeps ordering simple for repeated releases on the same upstream version line. Some build tools may compare SemVer build metadata differently or rank `5.3.39+osera-patch.001` lower than the plain upstream `5.3.39`, so consumers SHOULD pin the exact patched version rather than relying on dynamic version resolution.

Package URLs MUST encode `+` as `%2B`, for example `pkg:maven/org.example/example-lib@1.0.0%2Bosera-patch.001`.

## Open questions before ratification

The working group still needs test results before deciding whether the SP-0.1.0 Java package convention should remain pure SemVer build metadata, shift toward a Maven-style qualifier, or allow ecosystem-specific profiles. The decision is expected in the next 24 to 48 hours after the initial September 4, 2026 ratification.

Open questions include:

* whether SemVer build metadata or Maven qualifier ordering is better honored by Maven, Gradle, repository managers, SCA tools, and downstream policy engines;
* whether a naming model should allow the original maintainer or another upstream-compatible actor to supersede external patch releases cleanly;
* whether provider-specific patch names could distort consumer prioritization by making one producer appear to be the latest release for a shared namespace;
* how OSERA should handle large numbers of patches from different producers targeting the same artifact namespace and upstream baseline.

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
