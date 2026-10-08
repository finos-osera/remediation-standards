---
id: rel-005-artifact-publication-hygiene
title: REL-005 · Artifact Publication Hygiene
sidebar_label: REL-005 · Artifact Publication Hygiene
sidebar_position: 250
description: Published OSERA artifacts include consistent package metadata,
  checksums, and repository evidence required by the publication gate.
---

:::info[Recorded ratified · archive candidate]

**Standard 0.1.0** · Release Process. OSERA-SP-0.1.0 was ratified on September 10, 2026; this reconstruction awaits baseline confirmation.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Published OSERA artifacts include consistent package metadata, checksums, and repository evidence required by the publication gate.


## Requirement

Official OSERA artifacts MUST publish the expected package files and checksums for the target ecosystem.

For Maven-style releases, the gate SHOULD verify the expected POM, JAR, and checksum files and SHOULD confirm that package metadata uses the patched version required by REL-003.

## Rationale

Basic package hygiene is practical for the September 20 gate and directly affects whether repository managers, scanners, and recipients can consume the artifact reliably.

This standard intentionally avoids defining full build provenance. It checks whether the published package is internally consistent and carries the expected metadata.

## Evidence

Release evidence SHOULD include:

* artifact file names;
* checksums;
* artifact version;
* release tag;
* package metadata files inspected.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 250
standard_id: REL-005
title: Artifact Publication Hygiene
summary: Published OSERA artifacts include consistent package metadata,
  checksums, and repository evidence required by the publication gate.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: 2026-09-10
fitness-role: Required check
type: REL
category: Release Process
applies-to:
  - Patch providers
  - Repository operators
  - Enterprise recipients
requirements:
  - id: REL-005.REQ-001
    level: MUST
    text: Official OSERA artifacts must publish expected package files and checksums
      for the ecosystem being released.
    checkability: automated
    checks:
      - id: REL-005.CHECK-001
        title: Package files and checksums are present
        type: artifact
        severity: blocking
        implementation: osera-fitness.rel005.package_checksum_hygiene
        evidence:
          - artifact_files
          - checksums
  - id: REL-005.REQ-002
    level: MUST
    text: Published package metadata must identify the patched version consistently
      with REL-003.
    checkability: automated
    checks:
      - id: REL-005.CHECK-002
        title: Package metadata uses the approved patched version
        type: artifact
        severity: blocking
        implementation: osera-fitness.rel005.package_metadata_version
        evidence:
          - pom
          - artifact_version
          - release_tag
```

## Source provenance

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/rel-005-artifact-publication-hygiene.md) · Source SHA-256: `52fa191daa6b88d967a9e6e37419c45700b1e2c06691307da918c65175c9aefe`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
