---
schema-version: 0.1.0
sequence: 231
standard_id: REL-003-JAVA
title: Java Patch Version Naming
summary: Java patched releases use a version naming profile that optimizes Maven,
  Gradle, repository-manager, dependency-update, SCA, feed, and policy-tool
  behavior for the affected upstream version line.
extends: REL-003
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: '2026-09-10'
fitness-role: Required Java profile check
type: REL
category: Release Process
applies-to:
- Java package patch providers
- Enterprise Java recipients
- Java repository and dependency tooling
requirements:
- id: REL-003-JAVA.REQ-001
  override-explanation: Specializes the generic applicable-profile rule with a Java-specific version convention. The CARE-style convention uses the OSERA identifier; the parent obligations to identify the latest applicable remediation on the same upstream line and preserve baseline and OSERA identity remain.
  level: MUST
  text: Official OSERA Java patched releases must use the ratified Java patch
    CARE-style version naming convention with the OSERA identifier, so supported
    Java resolver, dependency update, repository manager, SCA, feed, and policy
    tooling treats the patched artifact as the latest applicable remediation on
    the same upstream version line.
  checkability: partially-automated
  checks:
  - id: REL-003-JAVA.CHECK-001
    override-explanation: Replaces generic profile-selection evidence with Java profile-decision, resolver, and dependency-update compatibility evidence. The parent consumer outcome remains the acceptance criterion; the naming convention is the CARE-style OSERA form described below.
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

## Java naming convention

OSERA-SP-0.1.0 adopts Maven Central's [CARE versioning approach](https://central.sonatype.org/policies/care-policy/#10-care-versioning), using `osera` in place of `care`. The decision was agreed at the [September 10, 2026 meeting](https://github.com/finos-osera/remediation-standards/issues/58) and recorded in [issue #33](https://github.com/finos-osera/remediation-standards/issues/33). Initial compatibility findings informed the decision; detailed findings will be published separately.

The recorded non-OSGi example is **`5.3.39.1-osera-00001`**. It retains the upstream `5.3.39` baseline, adds a numeric remediation branch, and identifies the OSERA release with a sequence suffix. This is the OSERA example agreed in #33; it is not a verbatim CARE example.

The full [CARE policy](https://central.sonatype.org/policies/care-policy/) describes numeric-base versioning, an [alternate suffix for qualified bases](https://central.sonatype.org/policies/care-policy/#alternate-format-for-qualified-base-versions), and tooling-driven deviations. OSERA adopts that approach for Java in 0.1.0, rather than imposing one concatenation rule on every historical version shape. Keep the baseline recognizable, identify OSERA, avoid taking the upstream maintainer's next ordinary version, and validate ordering and resolution in the relevant tooling. Producer identity belongs in release metadata. The `care` suffix itself remains reserved for Central-approved CARE releases; OSERA naming does not confer Central publication approval.

### Examples by packaging scenario

These examples illustrate the adopted approach, not a claim that these artifacts have been published. The non-OSGi example is recorded in #33; the qualified and OSGi examples show how the approach can be applied and require packaging-specific compatibility validation before publication.

| Scenario | Upstream baseline | Illustrative OSERA version | Interpretation |
| --- | --- | --- | --- |
| Non-OSGi Maven artifact, numeric base | `5.3.39` | `5.3.39.1-osera-00001` | The example agreed in #33. |
| Qualified Maven artifact | `5.6.15.Final` | `5.6.15.Final-osera-00001` | Retains `Final` and applies the CARE alternate suffix with `osera`. |
| Qualified service release | `2.0.0.RELEASE` | `2.0.0.RELEASE-osera-00001` | Keeps the upstream qualifier visible. |
| OSGi bundle, numeric base | `1.2.3` | `1.2.3.1-osera-00001` | The fourth component, `1-osera-00001`, is the OSGi qualifier. |
| OSGi bundle, existing qualifier | `1.2.3.Final` | `1.2.3.Final-osera-00001` | Extends the existing fourth-component qualifier. |

OSGi versions have three numeric components and an optional fourth qualifier containing letters, digits, underscores, or hyphens; a dot cannot appear inside that qualifier. See the [OSGi version grammar](https://docs.osgi.org/javadoc/osgi.core/8.0.0/org/osgi/framework/Version.html). Thus `Bundle-Version: 1.2.3.1-osera-00001` is syntactically valid, but appending another dotted segment to an already qualified OSGi version is not. OSGi compares the qualifier lexically; syntactic validity alone does not establish update ordering. Check the actual bundle manifest, Maven coordinate, and resolver behavior together, especially when a packaging tool normalizes versions.

### Consistent release identity

For the recorded non-OSGi example:

```text
Upstream version: 5.3.39
Source branch:    patch/5.3.x
Baseline tag:     v5.3.39+patch.baseline
Release tag:      v5.3.39.1-osera-00001
Artifact version: 5.3.39.1-osera-00001
Maven purl:       pkg:maven/org.springframework/spring-core@5.3.39.1-osera-00001
```

The `v` prefix identifies the source tag; the artifact version and purl use the same release identifier without that prefix. Feed entries must use the exact published coordinate. Consumers adopt the explicit patched version through their dependency declaration, BOM, version catalog, or update workflow; repository priority alone does not change a dependency pinned to the upstream version.

Java uses this profile instead of the generic `+osera-patch.NNN` default. The meeting adopted CARE-style naming for 0.1.0; it did not adopt a dual-format experiment.

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
