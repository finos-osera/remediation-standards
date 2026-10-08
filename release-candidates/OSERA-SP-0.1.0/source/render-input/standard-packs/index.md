---
title: OSERA-SP-0.1.0 pack definition
permalink: /standard-packs/
---

OSERA-SP-0.1.0 was ratified on Thursday, September 10, 2026. It defines the first set of standards that will gate OSERA patch releases, with seven additional standards in observe mode for OSERA-SP-0.2.0.

[Decision record](https://github.com/finos-osera/remediation-standards/issues/58) · [Complete resolved pack and definitions](/resolved.json)

## Included standards

| Standard | Version | Role | Selected checks | Rationale |
| --- | --- | --- | --- | --- |
| [STD-001](/standards/std-001-standards-as-code/index.html) | 0.1.0 | Required check | STD-001.CHECK-001, STD-001.CHECK-002 | The standards group needs a machine-readable source format before ratifying a pack that acceptance gates can consume. |
| [FORK-001](/standards/fork-001-repository-naming/index.html) | 0.1.0 | Required check | FORK-001.CHECK-001, FORK-001.CHECK-002 | Repository naming and canonical finos-osera location remain the simplest v0.1.0 provenance model; new standardized repositories use patch-*. |
| [FORK-002](/standards/fork-002-patch-branches/index.html) | 0.1.0 | Required check | FORK-002.CHECK-001 | Version-scoped patch branches are simple to create and necessary for multiple supported lines. |
| [FORK-003](/standards/fork-003-baseline-tags/index.html) | 0.1.0 | Required check | FORK-003.CHECK-001 | Baseline tags are essential for source comparison and audit evidence; new standardized baseline tags use +patch.baseline. |
| [SRC-002](/standards/src-002-provenance-links/index.html) | 0.1.0 | Required evidence | SRC-002.CHECK-001 | Provenance links are central to reviewability and auditability. |
| [SRC-003](/standards/src-003-license-headers/index.html) | 0.1.0 | Required check | SRC-003.CHECK-001 | License-header consistency can be enforced where the local convention is determinable, with a not-applicable result when no convention exists. |
| [REL-001](/standards/rel-001-test-provenance/index.html) | 0.1.0 | Required evidence | REL-001.CHECK-001 | Test provenance stays in scope for v0.1.0 as a published unit-test report artifact, while build provenance and signed source-to-binary proof move to REL-007 observe mode. |
| [REL-002](/standards/rel-002-bytecode-compatibility/index.html) | 0.1.0 | Required check | REL-002.CHECK-001 | Runtime compatibility is a high-impact recipient concern and can be measured at publication time. |
| [REL-003](/standards/rel-003-version-metadata/index.html) | 0.1.0 | Required base requirement | REL-003.CHECK-001, REL-003.CHECK-002 | Official signed artifacts should use package-ecosystem patch version naming profiles that optimize recipient tooling outcomes before choosing a concrete syntax. |
| [REL-003-JAVA](/standards/rel-003-java-patch-version-naming/index.html) | 0.1.0 | Required Java profile check | REL-003-JAVA.CHECK-001, REL-003-JAVA.CHECK-002 | Java artifacts use the ratified CARE-style OSERA naming convention, with compatibility evidence for the relevant packaging, resolvers, dependency-update tools, and feeds. |
| [REL-004](/standards/rel-004-approved-producers/index.html) | 0.1.0 | Required check | REL-004.CHECK-001, REL-004.CHECK-002 | The gate needs an approved-producer allow list so official artifacts come from a known participant. |
| [REL-005](/standards/rel-005-artifact-publication-hygiene/index.html) | 0.1.0 | Required check | REL-005.CHECK-001, REL-005.CHECK-002 | Package metadata and checksum hygiene are practical for the September 20 gate and necessary for reliable consumption. |
| [FEED-001](/standards/feed-001-openvex-cyclonedx/index.html) | 0.1.0 | Required evidence | FEED-001.CHECK-001, FEED-001.CHECK-002 | Feeds are necessary for enterprise consumption, and the gate can verify exact purl coverage for official artifacts. |

## Advisory standards

None.

## Observe standards

| Standard | Version | Role | Selected checks | Rationale |
| --- | --- | --- | --- | --- |
| [FORK-004](/standards/fork-004-open-source-patch-publication/index.html) | 0.0.1 | Observe-only check | FORK-004.CHECK-001, FORK-004.CHECK-002, FORK-004.CHECK-003 | Public source, same-license release, and official-fork hosting are important to recipient trust, but exact evidence rules need v0.2.0 work. |
| [SRC-001](/standards/src-001-patch-basis/index.html) | 0.0.1 | Observe-only check | SRC-001.CHECK-001 | Consumers need patch-basis classification, but the working group needs a controlled vocabulary and minimum wording before it can be enforced. |
| [REL-006](/standards/rel-006-patch-request-authorization/index.html) | 0.0.1 | Observe-only check | REL-006.CHECK-001 | Patch request or backlog authorization is useful, but public/private sponsorship policy is not ready to enforce. |
| [REL-007](/standards/rel-007-build-provenance-and-signed-attestation/index.html) | 0.0.1 | Observe-only check | REL-007.CHECK-001, REL-007.CHECK-002 | Build provenance and signed attestation should be the first v0.2.0 track while the v0.1.0 gate focuses on source provenance, test provenance, and publication hygiene. |
| [REL-008](/standards/rel-008-build-security-scanning/index.html) | 0.0.1 | Observe-only check | REL-008.CHECK-001, REL-008.CHECK-002 | Build-security scanning is important, but the working group needs evidence about practical scanner coverage across ecosystems before making it enforceable. |
| [EVD-001](/standards/evd-001-change-and-test-surface/index.html) | 0.0.1 | Observe-only check | EVD-001.CHECK-001 | Recipient guidance is valuable for routing testing, but the expected format needs v0.2.0 refinement before it can become advisory or required. |
| [APP-001](/standards/app-001-estate-application/index.html) | 0.0.1 | Observe-only check | APP-001.CHECK-001 | Estate-wide automated application depends on downstream tooling and recipient operating models that are not proven enough for the first gate. |

## Deferred standards

| Standard | Version | Role | Selected checks | Rationale |
| --- | --- | --- | --- | --- |
| [FORK-004](/standards/fork-004-open-source-patch-publication/index.html) | 0.0.1 | Observe-only check | See role; no selected gate checks | Tracked in observe mode for OSERA-SP-0.1.0 and expected to be reconsidered for OSERA-SP-0.2.0. |
| [SRC-001](/standards/src-001-patch-basis/index.html) | 0.0.1 | Observe-only check | See role; no selected gate checks | Tracked in observe mode until patch-basis vocabulary and provider wording are defined. |
| [REL-006](/standards/rel-006-patch-request-authorization/index.html) | 0.0.1 | Observe-only check | See role; no selected gate checks | Tracked in observe mode until the backlog and private sponsorship model is settled. |
| [REL-007](/standards/rel-007-build-provenance-and-signed-attestation/index.html) | 0.0.1 | Observe-only check | See role; no selected gate checks | Tracked in observe mode until producer signed build provenance is specified and implemented. |
| [REL-008](/standards/rel-008-build-security-scanning/index.html) | 0.0.1 | Observe-only check | See role; no selected gate checks | Tracked in observe mode until package ecosystem scanning expectations and evidence formats are defined. |
| [EVD-001](/standards/evd-001-change-and-test-surface/index.html) | 0.0.1 | Observe-only check | See role; no selected gate checks | Tracked in observe mode until the recipient guidance format is better defined. |
| [APP-001](/standards/app-001-estate-application/index.html) | 0.0.1 | Observe-only check | See role; no selected gate checks | Tracked in observe mode until estate-wide application workflows are proven. |

## Supporting pack metadata

The recorded metadata below is preserved from the selected source. Source paths refer to the bundled original tree under `source/`.

```json
{
  "schema-version": "0.1.0",
  "id": "OSERA-SP-0.1.0",
  "title": "OSERA Remediation Standards Pack 0.1.0",
  "status": "Ratified",
  "proposed_date": "2026-08-27",
  "target_decision_date": "2026-09-10",
  "target_gate_date": "2026-09-20",
  "ratified_date": "2026-09-10",
  "issue": "https://github.com/finos-osera/remediation-standards/issues/12",
  "agenda_issue": "https://github.com/finos-osera/remediation-standards/issues/12",
  "standards_as_code_issue": "https://github.com/finos-osera/remediation-standards/issues/23",
  "branch": "codex/sp-010-ratification",
  "summary": "OSERA-SP-0.1.0 was ratified on Thursday, September 10, 2026. It defines the first set of standards that will gate OSERA patch releases, with seven additional standards in observe mode for OSERA-SP-0.2.0.",
  "release_metadata": {
    "scope": "[REL-003](../standards/rel-003-version-metadata/) defines the generic consumer outcome and default form where no concrete ecosystem profile exists. Java artifacts use [REL-003-JAVA](../standards/rel-003-java-patch-version-naming/). Source branches and baseline tags are defined separately by [FORK-002](../standards/fork-002-patch-branches/) and [FORK-003](../standards/fork-003-baseline-tags/).",
    "default_intent": "Optimize consumer tooling outcomes first, then preserve SemVer 2.0 or other common ecosystem conventions where practical.",
    "official_token": "osera-patch.NNN",
    "official_example": "5.3.39+osera-patch.001",
    "java_convention": "Maven CARE-style versioning with the OSERA identifier, including qualified-base and packaging-specific forms.",
    "java_example": "5.3.39.1-osera-00001",
    "java_reference": "https://central.sonatype.org/policies/care-policy/",
    "java_decision": "https://github.com/finos-osera/remediation-standards/issues/33"
  },
  "approved_producers": {
    "registry": "docs/_data/approved_producers.yml",
    "lifecycle_policy": "Producer registry updates that do not change standard text or check semantics may be handled as patch-level standards-pack updates."
  }
}
```

[Read the preserved approved-producer registry](/source/docs/_data/approved_producers.yml).
