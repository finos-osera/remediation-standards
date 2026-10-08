---
id: rel-007-build-provenance-and-signed-attestation
title: REL-007 · Build Provenance and Signed Attestation
sidebar_label: REL-007 · Build Provenance and Signed Attestation
sidebar_position: 270
description: Producers should sign an attestation linking the published artifact
  digest to the source tag, build process, SBOM, VEX, test evidence, and license
  audit.
---

:::info[Pre-Draft · Observe only in pack 0.1.0]

**Standard 0.0.1** · Release Process. Included for observation, not ratified.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Producers should sign an attestation linking the published artifact digest to the source tag, build process, SBOM, VEX, test evidence, and license audit.


## Requirement

Producers SHOULD sign an attestation linking the published artifact digest to the source tag and build provenance.

The attestation SHOULD reference release evidence such as SBOM, VEX, test evidence, and license audit material.

## Rationale

SP-0.1.0 can validate source provenance, release metadata, bytecode compatibility, feed entries, producer approval, and package hygiene. It does not yet prove that a specific binary was built from a specific source tag.

Reproducible builds remain an important OSERA goal. The standards group is deferring the precise proof format, build environment expectations, and source-to-binary attestation requirements because arbitrary legacy repositories use different build systems, runtimes, plugins, and publication flows.

Build provenance and signed release evidence should be the first observe-mode path toward SP-0.2.0.

## Observe-mode evidence

Observe-mode evidence SHOULD include:

* artifact digest;
* source repository and tag;
* producer identity;
* signed attestation;
* build system reference;
* SBOM and VEX references;
* test evidence;
* license audit reference.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 270
standard_id: REL-007
title: Build Provenance and Signed Attestation
summary: Producers should sign an attestation linking the published artifact
  digest to the source tag, build process, SBOM, VEX, test evidence, and license
  audit.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: OSERA-SP-0.2.0 observe
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Observe-only check
type: REL
category: Release Process
applies-to:
  - Patch providers
  - Repository operators
  - Enterprise recipients
requirements:
  - id: REL-007.REQ-001
    level: SHOULD
    text: Producers should sign an attestation linking the artifact digest to the
      source tag and build provenance.
    checkability: partially-automated
    checks:
      - id: REL-007.CHECK-001
        title: Signed build provenance attestation is present
        type: release-evidence
        severity: observe
        implementation: osera-fitness.rel007.signed_build_attestation
        evidence:
          - artifact_digest
          - source_tag
          - attestation_signature
  - id: REL-007.REQ-002
    level: SHOULD
    text: The attestation should reference SBOM, VEX, test evidence, and license
      audit material for the release.
    checkability: manual
    checks:
      - id: REL-007.CHECK-002
        title: Attestation references release evidence bundle
        type: release-evidence
        severity: observe
        implementation: osera-fitness.rel007.evidence_bundle_references
        evidence:
          - sbom
          - vex
          - test_evidence
          - license_audit
```

## Source provenance

**Historical copy:** Reconstructed from [PR #51](https://github.com/finos-osera/remediation-standards/pull/51); snapshot verification pending.

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/rel-007-build-provenance-and-signed-attestation.md) · Source SHA-256: `060c6c275512bae4f65bb90401ff11868728c3ce78177736d27cbab64df23f25`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
