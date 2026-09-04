---
schema-version: 0.1.0
sequence: 230
standard_id: REL-003
title: Patch Version Naming
summary: Patched releases use package-ecosystem-appropriate version naming profiles
  that optimize recipient tooling outcomes before choosing a concrete syntax.
extended-by:
- REL-003-JAVA
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: REL
category: Release Process
applies-to:
- Package patch providers
- Enterprise recipients
- Package ecosystem profile authors
requirements:
- id: REL-003.REQ-001
  level: MUST
  text: Official OSERA patched releases must use the applicable package-ecosystem
    patch version naming profile, or the default SemVer 2.0-compatible OSERA
    form where no concrete profile exists, so supported package resolver,
    dependency update, repository manager, SCA, feed, and policy tooling can
    identify the patched artifact as the latest applicable remediation on the
    same upstream version line.
  checkability: partially-automated
  checks:
  - id: REL-003.CHECK-001
    title: Applicable patch version naming profile is selected
    type: release
    severity: blocking
    implementation: osera-fitness.rel003.remediation_identifier
    evidence:
    - release_tag
    - artifact_version
    - applicable_profile
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

REL-003 is the abstract patch version naming requirement. It defines the consumer outcome that every concrete package-ecosystem profile must optimize for before choosing a version syntax.

Official OSERA patched releases MUST use the applicable package-ecosystem patch version naming profile. Where no concrete profile exists, producers MUST use the default OSERA SemVer 2.0-compatible form described below.

Every REL-003 profile MUST choose a patch version identifier that:

* causes supported package resolver and dependency update tooling to treat the patched artifact as the latest applicable release on the same upstream version line;
* preserves the upstream baseline identity;
* distinguishes the patched artifact from the unpatched upstream release;
* allows release tags, artifact versions, vulnerability feeds, and release evidence to refer to the same patched release;
* avoids treating standard syntax as more important than the recipient tooling behavior needed to adopt the patch.

The default OSERA intent is to preserve [Semantic Versioning 2.0.0](https://semver.org/) semantics where practical, but standard syntax is secondary to recipient tooling behavior. Each package ecosystem or package manager MAY define a concrete profile that adapts the version identifier to the conventions, resolver behavior, repository metadata, and update tooling used by that ecosystem.

Release tags, artifact versions, vulnerability feeds, and release evidence MUST carry the same patched-release identifier so recipients can correlate source, binary, scanner, and advisory records.

## Profile model

Concrete profiles extend REL-003 by adding an uppercase profile suffix to the standard ID, for example:

* [REL-003-JAVA]({{ site.baseurl }}/standards/rel-003-java-patch-version-naming/) for Java package tooling;
* `REL-003-PYTHON` for a future Python package profile;
* `REL-003-JS` for a future JavaScript package profile.

The suffix uses `-PROFILE` rather than `.PROFILE` because requirement and check IDs already use dots, such as `REL-003.CHECK-001`.

Profiles SHOULD become more opinionated than the abstract standard. A profile can define the exact version pattern, resolver behavior tests, package URL encoding, repository-manager expectations, dependency-update-tool expectations, and any allowed exceptions for that package ecosystem.

## Default SemVer Profile

Where no concrete package-ecosystem profile exists, the default OSERA profile uses SemVer 2.0-compatible build metadata in the form:

```text
<UPSTREAM_VERSION>+<PATCH_INITIATIVE>.NNN
```

`<PATCH_INITIATIVE>` SHOULD identify the patching initiative, provider, or organization responsible for the patched release. For OSERA-managed releases, the default metadata token is:

```text
osera-patch.NNN
```

`NNN` MUST be monotonically increasing for the same upstream version line and patching initiative.

Existing OSERA backpatch repositories currently use `+backpatch.NNN`. The working group should treat that form as legacy/proof-of-concept evidence. Official signed artifacts claiming OSERA-SP-0.1.0 alignment SHOULD use the applicable ratified package profile identifier once that profile has been accepted.

This standard defines the official patched-release identity. It does not rename source workflow branches or baseline tags. [FORK-002]({{ site.baseurl }}/standards/fork-002-patch-branches/) deliberately uses `patch/<version>` as the source branch convention, and [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/) deliberately uses `v<VERSION>+patch.baseline` for the unpatched source baseline.

## Rationale

The version name is useful only if recipients and their tools gravitate toward the patched release as the right update. The patched artifact needs to be treated by resolver and dependency update tooling as the newest or latest applicable release on the same upstream version line. It also needs to remain visibly distinct from the unpatched upstream release so recipients can understand why that latest release exists.

SemVer 2.0 build metadata is OSERA's default and preferred starting point where the package ecosystem preserves, displays, resolves, and orders it correctly. That preference should be applied within the constraints of the recipient tooling OSERA expects consumers to use; it is not a claim that every package manager, repository manager, SCA tool, or dependency-update tool will interpret `+` metadata consistently.

Including the patching initiative in the visible component coordinate helps SCA tools, inventories, and approval workflows distinguish OSERA-managed releases from other downstream patch providers when repository or feed metadata is not shown.

The numeric suffix in the default SemVer profile keeps ordering simple for repeated releases on the same upstream version line. Some build tools may compare SemVer build metadata differently or rank `5.3.39+osera-patch.001` lower than the plain upstream `5.3.39`. That behavior is directly relevant to profile ratification: if a format does not cause supported resolver and dependency update tooling to treat the patch as the latest applicable release on the same upstream version line, the ecosystem profile needs a different concrete identifier.

Package URLs using `+` metadata MUST encode `+` as `%2B`, for example `pkg:maven/org.example/example-lib@1.0.0%2Bosera-patch.001`.

## Open Questions Before Ratification

The working group still needs to decide how much of the profile relationship model belongs in the first schema version and which package ecosystems need concrete profiles before they can claim SP-0.1.0 alignment.

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
