---
schema-version: 0.1.0
sequence: 510
standard_id: APP-001
title: Estate-Wide Patch Application
summary: Patch feeds should support automated discovery and application across dependency
  estates.
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
  text: Patch feeds and metadata should support estate-wide discovery and application
    across dependency estates.
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
---

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
