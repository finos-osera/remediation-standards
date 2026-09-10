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
candidate-pack: OSERA-SP-0.1.0 naming TODO
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
  override-explanation: Specializes the generic applicable-profile rule with a Java-specific version convention. The exact syntax is the naming TODO; the parent obligations to identify the latest applicable remediation on the same upstream line and preserve baseline and OSERA identity remain.
  level: MUST
  text: Official OSERA Java patched releases must use the ratified Java patch
    version naming pattern selected from compatibility evidence, so supported
    Java resolver, dependency update, repository manager, SCA, feed, and policy
    tooling treats the patched artifact as the latest applicable remediation on
    the same upstream version line.
  checkability: partially-automated
  checks:
  - id: REL-003-JAVA.CHECK-001
    override-explanation: Replaces generic profile-selection evidence with Java profile-decision, resolver, and dependency-update compatibility evidence. The parent consumer outcome remains the acceptance criterion; the exact naming pattern is the naming TODO.
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
  override-explanation: Specializes the parent identifier-consistency obligation for Java artifacts by explicitly including Maven package URLs. The same patched-release identity must still connect source tags, artifacts, feeds, and evidence.
  level: MUST
  text: Java release tags, artifact versions, Maven package URLs, vulnerability
    feeds, and release evidence must carry the same Java patch version
    identifier.
  checkability: automated
  checks:
  - id: REL-003-JAVA.CHECK-002
    override-explanation: Uses Maven package URL evidence for the parent consistency check while retaining release-tag, artifact-version, and feed identity matching.
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

<!-- TODO(REL-003-JAVA): MERGE BLOCKER. Replace this placeholder with the exact
Java naming convention selected from jkschneider's evidence repository/post
(issue #33). Update Java version examples, set this profile's ratification
metadata to OSERA-SP-0.1.0 / 2026-09-10, and regenerate catalogs before merging.
No candidate pattern or dual-format fallback is approved by this placeholder. -->

## Java naming convention

**TODO — merge blocker:** insert the Java version naming convention selected from jkschneider's evidence repository/post. The decision is tracked in [issue #33](https://github.com/finos-osera/remediation-standards/issues/33). This placeholder must be resolved before publishing the ratification branch.

## Requirement

REL-003-JAVA extends [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) for Java package artifacts.

Java releases MUST use the profile's selected version pattern. Release tags, artifact versions, Maven package URLs, vulnerability feeds, and release evidence MUST identify the same patched release.

`REL-003-JAVA.REQ-001` and `REL-003-JAVA.CHECK-001` specialize the base naming rule for Java. `REL-003-JAVA.REQ-002` and `REL-003-JAVA.CHECK-002` specialize the consistency rule with Maven package URL evidence. Same-number profile checks override base checks; additional Java checks start at `REL-003-JAVA.CHECK-003`.

Source branch naming follows [FORK-002]({{ site.baseurl }}/standards/fork-002-patch-branches/), and baseline tags follow [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/).

## Compatibility evidence

The Java profile gate SHOULD record evidence that the selected pattern:

* resolves as a distinct patched artifact;
* sorts or is recommended after the vulnerable upstream version where Java tooling supports that behavior;
* remains visibly tied to the upstream baseline version;
* is preserved in Maven package URLs and feed records;
* can be discovered by supported dependency-update workflows;
* does not consume the upstream maintainer's next ordinary release version.
