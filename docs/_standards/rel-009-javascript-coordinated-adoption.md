---
schema-version: 0.1.0
sequence: 292
standard_id: REL-009-JAVASCRIPT
title: JavaScript Coordinated Remediation Adoption
summary: Providers supply versioned npm remediation sets and supported manifest, catalog and lockfile updates with evidence of the actual resolved dependency graph.
extends: REL-009
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: Not assigned; Wave 3 exploration
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Experimental JavaScript profile; not an approved gate
type: REL
category: Release Process
applies-to:
- npm ecosystem package patch providers
- JavaScript and TypeScript library recipients
- Remediation and dependency update tooling
requirements:
- id: REL-009-JAVASCRIPT.REQ-001
  override-explanation: Specializes declared scope with npm package identities, workspace membership, runtime and manager versions and registry routing while preserving supported baselines and consumer entry points.
  level: MUST
  text: Providers must declare package names, baselines, source repositories, coordinated release units, consumer entry points and the supported Node, package-manager, platform and registry configurations for each remediation set.
  checkability: partially-automated
  checks:
  - id: REL-009-JAVASCRIPT.CHECK-001
    override-explanation: Checks the parent scope declaration using npm package and consumer configuration evidence; no Java BOM assumption is introduced.
    title: npm remediation scope and supported consumer configurations are explicit
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009_javascript.supported_scope
    evidence:
    - supported_dependency_scope
    - upstream_baselines
    - package_repository_mapping
    - coordinated_release_units
    - consumer_entry_points
    - supported_tooling_configurations
- id: REL-009-JAVASCRIPT.REQ-002
  override-explanation: Specializes the immutable remediation set with exact npm identities, registry origin and tarball digests while preserving remediation evidence and inherited change disclosure.
  level: MUST
  text: Each immutable versioned remediation set must list exact package names, versions, npm purls, registry origins and tarball digests with their baseline and remediation evidence, and identify changed and unchanged members.
  checkability: partially-automated
  checks:
  - id: REL-009-JAVASCRIPT.CHECK-002
    override-explanation: Verifies exact npm artifacts and evidence in the versioned set rather than requiring Java line counters or BOMs.
    title: Versioned set binds intended npm artifacts to baseline and remediation evidence
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009_javascript.remediation_set
    evidence:
    - remediation_set_identity
    - package_versions_and_purls
    - registry_origins
    - tarball_digests
    - remediation_evidence
- id: REL-009-JAVASCRIPT.REQ-003
  override-explanation: Specializes the supported adoption procedure through provider-maintained coordinated edits; consumers need not author or maintain transitive override lists themselves. Inherited CHECK-006 verifies actual resolution.
  level: MUST
  text: Providers must supply a supported procedure or tool applying coordinated manifest, workspace or catalog and lockfile changes, including required root overrides or resolutions, and verify clean and frozen installation for each declared supported configuration.
  checkability: partially-automated
  checks:
  - id: REL-009-JAVASCRIPT.CHECK-003
    override-explanation: Verifies documented or automated npm ecosystem edits and rollback inputs, preserving the parent requirement to avoid recipient-authored artifact-by-artifact transitive override maintenance.
    title: Supported adoption procedure updates the controlling declarations and lockfile together
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009_javascript.adoption_procedure
    evidence:
    - adoption_procedure
    - consumer_entry_points
    - manifest_catalog_lockfile_diff
    - provider_maintained_override_rules
    - rollback_inputs
---

## Scope and status

This **Pre-Draft** is the npm ecosystem counterpart of REL-009-JAVA, extending [REL-009]({{ site.baseurl }}/standards/rel-009-line-release-and-bom-propagation/) for experimental Wave 3 preparation in [#98](https://github.com/finos-osera/remediation-standards/issues/98). It does not ratify a pack or claim a complete JS gate exists. The parent working version is 0.1.1; a future pack must pin exact parent/profile versions.

Requirements/checks 001–003 specialize the same-number parent items. Parent CHECK-006 (actual consumer resolution) and CHECK-007 (change and validation disclosure) remain inherited. Java's additional checks 004–005 are not inherited by a sibling profile. Proposed blocking severity remains experimental until separately approved.

## Release unit and adoption

Declare whether upstream releases packages independently or as a coordinated set. A shared repository does not by itself require every workspace package to be republished. Identify which members must change to preserve dependency and peer compatibility, justify unchanged members, and bind them to exact existing versions and digests. When upstream requires a coordinated unit, publish all required members before claiming the set is adoptable. Missing members or incompatible peers make that supported configuration fail resolution verification.

A remediation set is an immutable input to adoption, not necessarily a new aggregator npm package. An npm dependency package does not supply a Maven BOM equivalent. Providers maintain the transformation that updates a consumer's actual controlling manifest, workspace/catalog entry and lockfile together, including manager-specific root overrides or resolutions when needed. Consumers approve the coordinated change; they should not have to reconstruct the transitive graph or maintain a separate handwritten override inventory.

Declare manager versions and configuration paths rather than assuming npm, pnpm and Yarn accept interchangeable override or catalog syntax. Library-local override declarations must not be assumed to govern downstream applications. Preserve an existing catalog reference when updating its controlling entry. If a consumer configuration is unsupported, say so without returning a successful adoption verdict.

## Resolution evidence

For every declared supported configuration, inherited CHECK-006 records:

- exact Node and package-manager versions, OS/architecture, registry routing, install settings and any publish-age policy;
- before/after consumer files and resolved graph, including all in-scope transitive occurrences, peers and platform-specific optional dependencies;
- installed package identities and tarball digests matched to the chosen set;
- clean resolution/update and subsequent frozen-lockfile installation commands, exit codes and logs;
- runtime/import smoke-test scope and results, with missing integration coverage disclosed under CHECK-007.

A zero exit code alone is insufficient: a successful install retaining the targeted vulnerable occurrence fails adoption. Distinguish a deliberately absent optional package on an unsupported platform from a silently skipped required remediation. Frozen installation must reproduce the recorded result. Peer conflicts and stale locks must be reported rather than silently bypassed by disabling checks. Record rollback files and the previous set identity; rollback restores a previous state and does not assert that state is vulnerability-free.

## Proposed naming interaction

Use the existing [REL-003-JAVASCRIPT proposal]({{ site.baseurl }}/standards/rel-003-javascript-patch-version-naming/) as the first experiment: explicit adoption of a next-patch prerelease under the upstream package name. Compare exact pins and tilde ranges in the [review matrix]({{ site.baseurl }}/examples/javascript-wave3/). A range can resolve beyond the intended set after registry changes; retain exact resolved bytes for each run and require reevaluation of changed results. A higher upstream version is not evidence that the vulnerability is fixed.

The initial set may choose exact pins for a controlled experiment, using the naming draft's existing recipient pin-policy exception. This does not settle the broader tilde recommendation. Any alternate naming/alias experiment must label its divergence from REL-003-JAVASCRIPT instead of claiming a pass against that draft.

## Review cases and open questions

| Case | Proposed result |
| --- | --- |
| Manifest updated but lockfile remains at vulnerable package | Fail inherited CHECK-006. |
| Direct dependency fixed but another in-scope transitive copy remains vulnerable | Fail inherited CHECK-006. |
| Workspace catalog updated and frozen install resolves all intended members | Resolution can pass for the tested configuration only. |
| Tarball version matches but registry delivers different bytes | Fail artifact binding and resolution. |
| Package tests pass but no consumer integration test ran | Disclose the limitation; do not claim integration compatibility. |

Decide supported manager generations, peer-conflict policy, coordinated-release boundaries, set schema and transport, update-tool integration, and evidence retention before production use. Test actual registry overlays and installations, not only SemVer comparisons. Existing REL-001, REL-005 and feed obligations remain applicable; this profile neither replaces their evidence nor imports JVM bytecode checks into JS.
