---
schema-version: 0.1.0
sequence: 310
standard_id: FEED-001
title: OpenVEX and CycloneDX Feeds
summary: OSERA-compatible providers contribute patch data to both OpenVEX and CycloneDX
  feed formats.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required evidence
type: FEED
category: Feeds and Advisories
applies-to:
- Patch providers
- Feed maintainers
- Enterprise recipients
requirements:
- id: FEED-001.REQ-001
  level: MUST
  text: OSERA-compatible releases must be represented in OpenVEX and CycloneDX feed
    data.
  checkability: partially-automated
  checks:
  - id: FEED-001.CHECK-001
    title: OpenVEX and CycloneDX entries exist for the release
    type: feed
    severity: blocking
    implementation: osera-fitness.feed001.feed_entry_presence
    evidence:
    - openvex_entry
    - cyclonedx_entry
- id: FEED-001.REQ-002
  level: MUST
  text: Feed entries must preserve the exact patched package URL, including encoded
    release metadata.
  checkability: automated
  checks:
  - id: FEED-001.CHECK-002
    title: Feed purls match the published patched artifact identifier
    type: feed
    severity: blocking
    implementation: osera-fitness.feed001.exact_purl_match
    evidence:
    - purl
    - release_version
---

## Requirement

OSERA MUST provide OpenVEX and CycloneDX feeds to satisfy common scanning and vulnerability-management products.

Patch providers MUST be able to contribute enough patch data to populate both feed formats.

## Rationale

Enterprise recipients use heterogeneous scanning products. Supporting both OpenVEX and CycloneDX reduces integration friction and lets recipients use existing vulnerability workflows.

A reference provider feed demonstrates the split: OpenVEX is used for scanner workflows such as Grype and Trivy, while CycloneDX supports tools and audit workflows such as JFrog Xray, Sonatype, and OWASP Dependency-Track.

## Evidence

Feed entries SHOULD link to:

* vulnerability identifiers;
* affected and patched artifacts;
* OSERA repository, branch, and release;
* baseline tag;
* patch basis and provenance links;
* provider identity and publication timestamp.

OpenVEX entries SHOULD match the patched artifact by exact package URL and SHOULD include a built-artifact hash when available. The package URL MUST preserve the release metadata chosen under REL-003 so scanner results match the artifact version actually published. The status SHOULD be `fixed` when the upstream fix has been carried onto the patch baseline.

CycloneDX entries SHOULD carry vulnerability analysis and SHOULD use pedigree or equivalent evidence links to connect the patched component to the backported fix.

## Example fields

A candidate OpenVEX entry for an official OSERA patched artifact uses fields such as:

```json
{
  "vulnerability": {
    "name": "CVE-2023-46604",
    "aliases": ["GHSA-crg9-44h2-xw35"]
  },
  "products": [
    {
      "@id": "pkg:maven/org.apache.activemq/activemq-client@5.14.5%2Bosera-patch.001",
      "identifiers": {
        "purl": "pkg:maven/org.apache.activemq/activemq-client@5.14.5%2Bosera-patch.001"
      }
    }
  ],
  "status": "fixed",
  "action_statement": "CVE fixed by backporting the upstream fix onto the baseline."
}
```

The current CycloneDX bundle uses vulnerability analysis such as `resolved_with_pedigree` and links affected entries to exact package URLs.
