---
schema-version: 0.1.0
sequence: 250
standard_id: REL-005
title: Artifact Publication Hygiene
summary: Published OSERA artifacts include consistent package metadata, checksums,
  and repository evidence required by the publication gate.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: '2026-09-04'
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
  text: Published package metadata must identify the selected patched version consistently
    across package files and release evidence.
  checkability: automated
  checks:
  - id: REL-005.CHECK-002
    title: Package metadata uses the selected patched version
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005.package_metadata_version
    evidence:
    - pom
    - artifact_version
    - release_tag
---
## Requirement

Official OSERA artifacts MUST publish the expected package files and checksums for the target ecosystem.

For Maven-style releases, the gate SHOULD verify the expected POM, JAR, and checksum files and SHOULD confirm that package metadata uses the patched version selected for the release. REL-003 remains pending and will define the ratified release-coordinate naming requirement once package resolver and dependency update-tool compatibility evidence is reviewed.

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
