---
schema-version: 0.1.0
sequence: 231
standard_id: REL-003-JAVA
title: Java Patch Version Naming
summary: Java patched releases use a version naming profile that optimizes Maven,
  Gradle, repository-manager, dependency-update, SCA, feed, and policy-tool
  behavior for the affected upstream version line.
extends: REL-003
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required Java profile check
type: REL
category: Release Process
applies-to:
- Java package patch providers
- Enterprise Java recipients
- Java repository and dependency tooling
requirements:
- id: REL-003-JAVA.REQ-001
  level: MUST
  text: Official OSERA Java patched releases must use the ratified Java patch
    version naming pattern selected from compatibility evidence, so supported
    Java resolver, dependency update, repository manager, SCA, feed, and policy
    tooling treats the patched artifact as the latest applicable remediation on
    the same upstream version line.
  checkability: partially-automated
  checks:
  - id: REL-003-JAVA.CHECK-001
    title: Java patch version pattern passes supported tooling compatibility tests
    type: release
    severity: blocking
    implementation: osera-fitness.rel003_java.version_pattern_compatibility
    evidence:
    - release_tag
    - artifact_version
    - java_profile_decision
    - resolver_test_result
    - dependency_update_test_result
- id: REL-003-JAVA.REQ-002
  level: MUST
  text: Java release tags, artifact versions, Maven package URLs, vulnerability
    feeds, and release evidence must carry the same Java patch version
    identifier.
  checkability: partially-automated
  checks:
  - id: REL-003-JAVA.CHECK-002
    title: Java release identifier is consistent across source, artifact, and feeds
    type: release
    severity: blocking
    implementation: osera-fitness.rel003_java.identifier_consistency
    evidence:
    - release_tag
    - artifact_version
    - maven_purl
    - feed_purl
---

## Requirement

REL-003-JAVA extends [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) for Java package artifacts.

The Java profile is intentionally concrete: once the working group accepts the compatibility evidence, this profile should name the exact Java version pattern and the gate checks that prove the pattern works for supported Java recipient tooling.

`REL-003-JAVA.REQ-001` and `REL-003-JAVA.CHECK-001` override `REL-003.REQ-001` and `REL-003.CHECK-001` for Java package artifacts. `REL-003-JAVA.REQ-002` and `REL-003-JAVA.CHECK-002` override the base consistency requirement and check with Java-specific Maven package URL evidence. Additional Java checks should use new numbers, starting with `REL-003-JAVA.CHECK-003`.

The decision order is:

* optimize the consumer outcome first;
* preserve OSERA and upstream identity in source, artifact, feed, and evidence records;
* follow SemVer 2.0 or other commonly used conventions where they produce the intended Java tooling behavior;
* choose a Java-specific form where common syntax does not produce the intended resolver or update-tool outcome.

## Candidate Patterns Under Review

The current default OSERA form is:

```text
<UPSTREAM_VERSION>+osera-patch.NNN
```

Example:

```text
5.3.39+osera-patch.001
```

This form is clear in exact coordinates, package URLs, vulnerability feeds, and inventories. It should remain available only if Java tooling preserves, resolves, displays, and recommends it in a way that meets the REL-003 consumer outcome.

A Maven-style candidate may be needed if Java tooling more reliably treats it as newer than the vulnerable upstream version. Example forms under discussion include:

```text
<UPSTREAM_VERSION>.<NNN>-osera
<UPSTREAM_VERSION>-osera-<NNN>
```

The working group should select the Java pattern based on compatibility evidence for Maven, Gradle, repository managers, dependency-update tools, SCA tools, vulnerability feeds, and downstream policy engines.

## Gate Expectations

The Java profile gate SHOULD record compatibility evidence showing whether the selected pattern:

* resolves as a distinct patched artifact;
* sorts or is recommended after the vulnerable upstream version where Java tooling supports that behavior;
* remains visibly tied to the upstream baseline version;
* is preserved in Maven package URLs and feed records;
* can be discovered by common dependency-update workflows;
* does not consume the upstream maintainer's next ordinary release version.

## Open Questions Before Ratification

The Java profile remains pending until the working group accepts the compatibility test results.

Open questions include:

* whether SemVer build metadata or Maven qualifier ordering is better honored by Maven, Gradle, repository managers, SCA tools, and downstream policy engines;
* whether the Java profile should optimize for exact patched coordinates, automatic update recommendation, or both;
* whether a naming model should allow the original maintainer or another upstream-compatible actor to supersede external patch releases cleanly;
* whether provider-specific patch names could distort consumer prioritization by making one producer appear to be the latest release for a shared namespace;
* how OSERA should handle large numbers of patches from different producers targeting the same artifact namespace and upstream baseline.
