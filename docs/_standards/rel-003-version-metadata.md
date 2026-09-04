---
schema-version: 0.1.0
sequence: 230
standard_id: REL-003
title: Patch Version Naming
summary: Patched releases use package-ecosystem-appropriate version identifiers
  that make the patch distinguishable, traceable, and latest on the same upstream
  line.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
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
  text: Official OSERA patched releases must use a package-ecosystem-appropriate
    patched-release identifier that causes supported package resolver and
    dependency update tooling to treat the patched artifact as the latest
    applicable release on the same upstream version line, while preserving the
    upstream baseline identity and distinguishing the patched artifact.
  checkability: partially-automated
  checks:
  - id: REL-003.CHECK-001
    title: Patched-release identifier is latest on the upstream version line
    type: release
    severity: blocking
    implementation: osera-fitness.rel003.remediation_identifier
    evidence:
    - release_tag
    - artifact_version
    - ecosystem_profile
    - resolver_test_result
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

For OSERA-SP-0.1.0, this standard defines the outcome expected from patched-release identifiers: a patched release should be the version that supported package resolvers and dependency update tools naturally treat as the latest applicable release on the same upstream version line.

Official OSERA patched releases MUST use a package-ecosystem-appropriate identifier that:

* causes supported package resolver and dependency update tooling to treat the patched artifact as the latest applicable release on the same upstream version line;
* preserves the upstream baseline identity;
* distinguishes the patched artifact from the unpatched upstream release;
* allows release tags, artifact versions, vulnerability feeds, and release evidence to refer to the same patched release.

The default OSERA intent is to preserve [Semantic Versioning 2.0.0](https://semver.org/) semantics where practical, but standard syntax is secondary to recipient tooling behavior. Each package ecosystem MAY require a package-specific profile that adapts the concrete release identifier to the conventions, resolver behavior, repository metadata, and update tooling used by that ecosystem.

Release tags, artifact versions, vulnerability feeds, and release evidence MUST carry the same patched-release identifier so recipients can correlate source, binary, scanner, and advisory records.

For the candidate Java package profile, the working proposal is SemVer build metadata in the form:

```text
<UPSTREAM_VERSION>+<PATCH_INITIATIVE>.NNN
```

`<PATCH_INITIATIVE>` SHOULD identify the patching initiative, provider, or organization responsible for the patched release. For OSERA-managed releases, the candidate metadata token is:

```text
osera-patch.NNN
```

`NNN` MUST be monotonically increasing for the same upstream version line and patching initiative.

This Java profile format remains candidate guidance until the working group has reviewed compatibility evidence for Maven, Gradle, repository managers, dependency-update tools, SCA tools, and downstream policy engines. If the evidence shows that another Java coordinate form is more reliably treated as the latest applicable release on the same upstream version line, the Java profile SHOULD use that better-performing form while preserving the OSERA identity, evidence, and correlation requirements.

Existing OSERA backpatch repositories currently use `+backpatch.NNN`. The working group should treat that form as legacy/proof-of-concept evidence. Official signed Java package artifacts claiming OSERA-SP-0.1.0 alignment SHOULD use the ratified Java package profile identifier once the compatibility evidence has been accepted.

This standard defines the official patched-release identity. It does not rename source workflow branches or baseline tags. [FORK-002]({{ site.baseurl }}/standards/fork-002-patch-branches/) deliberately uses `patch/<version>` as the source branch convention, and [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/) deliberately uses `v<VERSION>+patch.baseline` for the unpatched source baseline.

## Rationale

The identifier is useful only if recipients and their tools gravitate toward the patched release as the right update. The patched artifact needs to be treated by resolver and dependency update tooling as the newest or latest applicable release on the same upstream version line. It also needs to remain visibly distinct from the unpatched upstream release so recipients can understand why that latest release exists.

SemVer 2.0 build metadata is OSERA's preferred starting point where the package ecosystem preserves, displays, resolves, and orders it correctly. That preference should be applied within the constraints of the recipient tooling OSERA expects consumers to use; it is not a claim that every package manager, repository manager, SCA tool, or dependency-update tool will interpret `+` metadata consistently.

Including the patching initiative in the visible component coordinate helps SCA tools, inventories, and approval workflows distinguish OSERA-managed releases from other downstream patch providers when repository or feed metadata is not shown.

The numeric suffix in the candidate Java profile keeps ordering simple for repeated releases on the same upstream version line. Some build tools may compare SemVer build metadata differently or rank `5.3.39+osera-patch.001` lower than the plain upstream `5.3.39`. That behavior is directly relevant to ratification: if a format does not cause supported resolver and dependency update tooling to treat the patch as the latest applicable release on the same upstream version line, the ecosystem profile needs a different concrete identifier.

Package URLs using `+` metadata MUST encode `+` as `%2B`, for example `pkg:maven/org.example/example-lib@1.0.0%2Bosera-patch.001`.

## Open questions before ratification

The working group still needs to review compatibility evidence before deciding whether the SP-0.1.0 Java package convention should remain pure SemVer build metadata, shift toward a Maven-style qualifier, publish multiple test coordinates, or allow ecosystem-specific profiles.

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
