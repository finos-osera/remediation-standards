---
id: feed-001-openvex-cyclonedx
title: FEED-001 · OpenVEX and CycloneDX Feeds
sidebar_label: FEED-001 · OpenVEX and CycloneDX Feeds
sidebar_position: 310
description: OSERA-compatible providers contribute patch data to both OpenVEX
  and CycloneDX feed formats.
---

:::info[✓ Ratified in pack 0.1.0]

**Standard 0.1.0** · Feeds and Advisories. Ratified September 10, 2026.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

OSERA-compatible providers contribute patch data to both OpenVEX and CycloneDX feed formats.


Version strings in the examples are illustrative. Java release identifiers follow [REL-003-JAVA](/standards/0.1.0/rel-003-java-patch-version-naming/).

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

This illustrative OpenVEX fragment uses the ratified Java naming convention; it is not a claim that the example artifact has been published:

```json
{
  "vulnerability": {
    "name": "CVE-2023-46604",
    "aliases": ["GHSA-crg9-44h2-xw35"]
  },
  "products": [
    {
      "@id": "pkg:maven/org.apache.activemq/activemq-client@5.14.5.1-osera-00001",
      "identifiers": {
        "purl": "pkg:maven/org.apache.activemq/activemq-client@5.14.5.1-osera-00001"
      }
    }
  ],
  "status": "fixed",
  "action_statement": "CVE fixed by backporting the upstream fix onto the baseline."
}
```

A CycloneDX bundle uses vulnerability analysis such as `resolved_with_pedigree` and links affected entries to exact package URLs.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 310
standard_id: FEED-001
title: OpenVEX and CycloneDX Feeds
summary: OSERA-compatible providers contribute patch data to both OpenVEX and
  CycloneDX feed formats.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: 2026-09-10
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
    text: OSERA-compatible releases must be represented in OpenVEX and CycloneDX
      feed data.
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
    text: Feed entries must preserve the exact patched package URL, including
      encoded release metadata.
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
```

## Source provenance

**Historical copy:** Reconstructed from [PR #51](https://github.com/finos-osera/remediation-standards/pull/51); snapshot verification pending.

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/feed-001-openvex-cyclonedx.md) · Source SHA-256: `862e7c563347a7059111a1c735bc4e25a0fce2d2abaed1d994907d5a033b0dce`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
