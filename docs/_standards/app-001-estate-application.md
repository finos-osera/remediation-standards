---
sequence: 510
standard_id: APP-001
title: Estate-Wide Patch Application
summary: Patch feeds should support automated discovery and application across dependency estates.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: Deferred from OSERA-SP-0.1
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Discussion item
type: APP
applies-to:
  - Enterprise recipients
  - Tooling providers
  - Patch providers
---

## Requirement

OSERA feeds and metadata SHOULD support estate-wide discovery of available backpatches, including transitive dependency use cases.

## Rationale

The July 7 update described applying every available backpatch across an estate using broad matching options:

```text
groupId = *
artifactId = *
transitive = true
```

This model depends on reliable feed metadata, predictable versions, and recipient evidence that lets enterprises route validation.

## Evidence

Tooling SHOULD be able to show which applications, dependency paths, and artifact coordinates would change before applying patches.
