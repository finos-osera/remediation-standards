---
id: app-001-estate-application
title: APP-001 · Estate-Wide Patch Application
sidebar_label: APP-001 · Estate-Wide Patch Application
sidebar_position: 510
description: Patch feeds should support automated discovery and application
  across dependency estates.
---

:::info[Pre-Draft · Observe only in pack 0.1.0]

**Standard 0.0.1** · Patch Application. Included for observation, not ratified.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Patch feeds should support automated discovery and application across dependency estates.


## Requirement

OSERA feeds and metadata SHOULD support estate-wide discovery of available patches, including transitive dependency use cases.

## Rationale

The July 7 update described applying every available patch across an estate using broad matching options:

```text
groupId = *
artifactId = *
transitive = true
```

This model depends on reliable feed metadata, predictable versions, and recipient evidence that lets enterprises route validation.

## Evidence

Tooling SHOULD be able to show which applications, dependency paths, and artifact coordinates would change before applying patches.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 510
standard_id: APP-001
title: Estate-Wide Patch Application
summary: Patch feeds should support automated discovery and application across
  dependency estates.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: OSERA-SP-0.2.0 observe
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Observe-only check
type: APP
category: Patch Application
applies-to:
  - Enterprise recipients
  - Tooling providers
  - Patch providers
requirements:
  - id: APP-001.REQ-001
    level: SHOULD
    text: Patch feeds and metadata should support estate-wide discovery and
      application across dependency estates.
    checkability: partially-automated
    checks:
      - id: APP-001.CHECK-001
        title: Estate-wide discovery metadata is present
        type: feed-metadata
        severity: observe
        implementation: osera-fitness.app001.estate_discovery_metadata
        evidence:
          - feed_entries
          - dependency_coordinates
```

## Source provenance

**Historical copy:** Reconstructed from [PR #51](https://github.com/finos-osera/remediation-standards/pull/51); snapshot verification pending.

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/app-001-estate-application.md) · Source SHA-256: `b3329df023fbdf611683e9fa41c90d91b49403646cd96f153b7242d6714241bd`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
