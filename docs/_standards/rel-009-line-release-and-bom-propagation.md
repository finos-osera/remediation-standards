---
schema-version: 0.1.0
sequence: 290
standard_id: REL-009
title: Coordinated Remediation Adoption
summary: Providers publish versioned remediation sets and supported adoption procedures
  so consumers can resolve the intended patched dependencies without reconstructing
  transitive dependency overrides themselves.
extended-by:
- REL-009-JAVA
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.2.0 required
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: REL
category: Release Process
applies-to:
- Package patch providers
- Repository operators
- Enterprise recipients
- Package ecosystem profile authors
requirements:
- id: REL-009.REQ-001
  level: MUST
  text: Providers must declare the supported dependency scope, upstream baselines,
    applicable ecosystem profile, and consumer entry points and tooling configurations
    for adopting a remediation set.
  checkability: partially-automated
  checks:
  - id: REL-009.CHECK-001
    title: Supported scope and adoption entry points are declared
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009.supported_scope
    evidence:
    - supported_dependency_scope
    - upstream_baselines
    - applicable_profile
    - consumer_entry_points
    - supported_tooling_configurations
- id: REL-009.REQ-002
  level: MUST
  text: Providers must publish an immutable, versioned remediation set identifying
    exact artifact versions and associated remediation evidence, and disclose the
    dependency changes, validation performed, and known limitations for adoption.
  checkability: partially-automated
  checks:
  - id: REL-009.CHECK-002
    title: Versioned remediation set identifies exact artifacts and evidence
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009.remediation_set
    evidence:
    - remediation_set_identity
    - artifact_versions
    - remediation_evidence
  - id: REL-009.CHECK-007
    title: Dependency changes and validation scope are disclosed
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009.change_disclosure
    evidence:
    - dependency_version_changes
    - validation_evidence
    - inherited_evidence_references
    - known_limitations
- id: REL-009.REQ-003
  level: MUST
  text: Providers must publish a supported adoption procedure that avoids consumers
    having to author and maintain artifact-by-artifact transitive dependency overrides,
    verify that it resolves the intended remediations for the declared configurations,
    and report when those remediations cannot be resolved.
  checkability: partially-automated
  checks:
  - id: REL-009.CHECK-003
    title: Supported adoption procedure is published
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009.adoption_procedure
    evidence:
    - adoption_procedure
    - consumer_entry_points
  - id: REL-009.CHECK-006
    title: Adoption resolves the intended remediations in supported configurations
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009.consumer_resolution
    evidence:
    - adoption_procedure
    - supported_tooling_configurations
    - consumer_change
    - resolved_versions_before
    - resolved_versions_after
    - resolution_result
    - resolution_failures
---

## Requirement

REL-009 defines the consumer outcome for coordinated remediation adoption. Providers MUST declare the supported dependency scope, upstream baselines, applicable ecosystem profile, and consumer entry points and tooling configurations.

Providers MUST publish an immutable, versioned remediation set identifying the exact artifacts and versions that deliver the intended fixes, with references to their remediation evidence. A set may be represented by the ecosystem's existing release metadata and associated evidence; this standard does not require a new package format or a separate aggregator artifact.

Providers MUST publish a supported adoption procedure that avoids consumers having to author and maintain artifact-by-artifact transitive dependency overrides. A provider-supported tool MAY apply coordinated changes to a consuming application where the ecosystem requires them. Consumers retain an explicit adoption decision.

Providers MUST verify that the documented procedure selects the intended remediations in each declared supported configuration. Evidence MUST record the tooling and configuration, the consumer change, resolved versions before and after adoption, and the result. A failed resolution or a result that retains an artifact the set intends to remediate MUST be reported as a failure, not successful adoption. Successful cases in other configurations do not make that configuration pass.

Providers MUST disclose the dependency version changes, validation performed, references to inherited test evidence, and known limitations. Evidence MUST distinguish component testing, dependency-resolution verification, and any integration testing performed; absence of integration testing must be explicit. These disclosure requirements do not introduce a mandatory full-stack test suite or change [REL-001]({{ site.baseurl }}/standards/rel-001-test-provenance/)'s test requirements.

## Profile model

Concrete ecosystem profiles define how to meet this outcome using their package managers and publication models. [REL-009-JAVA]({{ site.baseurl }}/standards/rel-009-java-line-release-and-bom-propagation/) specifies the Java line-release and BOM-propagation mechanism proposed in PR #67. Python and JavaScript profiles are future work; this draft does not prescribe their mechanisms or claim support for them.

Profiles define the supported release unit, artifact identity, publication and propagation rules, consumer adoption procedure, and evidence formats. Whole-line republication, shared release counters, Maven BOMs, and JAR checksum rules belong to the Java profile rather than the generic standard.

Profiles inherit parent requirements and checks unless a same-number item overrides them, with an explicit explanation of how the parent obligation is preserved. The Java profile overrides requirements and checks 001–003 and adds checks 004–005. Checks 006–007 remain inherited obligations for consumer-resolution verification and change disclosure. Numbering reserves the existing five proposed Java checks so their suffixes survive the split.

## Rationale

A patched component is useful only if a consumer can adopt it reliably. Providers should solve the coordinated dependency update once, publish its scope and evidence, and give consumers a supported procedure for applying it. A versioned input alone is insufficient if the consuming build still selects an unintended dependency version.

The unit of adoption and the mechanism for selecting dependencies differ across ecosystems. This standard fixes the desired outcome while allowing concrete profiles to define mechanisms that work with their tooling. Its scope is the declared remediation set and supported configurations, not a claim that every dependency in an arbitrary application is vulnerability-free.

## Evidence and draft status

Checks 001–003 examine the scope declaration, immutable release identities, evidence references, and adoption procedure. Check 006 evaluates recorded resolution results for all declared supported configurations. Check 007 checks that the version changes, validation scope, inherited evidence, and limitations are disclosed; it does not treat component test results as integration results.

The implementation identifiers in this draft are proposed bindings, not a claim that new gate implementations already exist. Evidence schemas and ecosystem implementations require review before ratification. Both this standard and its Java profile are proposed for OSERA-SP-0.2.0; neither changes the ratified OSERA-SP-0.1.0 pack.
