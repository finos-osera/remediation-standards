---
id: rel-002-bytecode-compatibility
title: REL-002 · Bytecode Compatibility
sidebar_label: REL-002 · Bytecode Compatibility
sidebar_position: 220
description: Patched artifacts preserve the bytecode level of the last released
  artifact unless an explicit exception is approved.
---

:::info[Recorded ratified · archive candidate]

**Standard 0.1.0** · Release Process. OSERA-SP-0.1.0 was ratified on September 10, 2026; this reconstruction awaits baseline confirmation.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Patched artifacts preserve the bytecode level of the last released artifact unless an explicit exception is approved.


## Requirement

Patch providers MUST guarantee that patched Java artifacts are released at the correct bytecode version.

The bytecode level SHOULD be determined from the last released artifact, not solely from the fork's build configuration.

## Rationale

Old source trees do not always encode the runtime compatibility level that enterprise consumers rely on. Publishing a patch at the wrong bytecode level can break consumers even when source tests pass.

## Acceptance check

The working group SHOULD define an automated publish-time check that compares bytecode level against the last released artifact for the same line.

## Evidence

Release evidence SHOULD include the bytecode level, how it was determined, and whether the published artifact was checked before release.

## Illustrative evidence

See [OSERA Commit Evidence](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/examples/osera-commit-evidence.md) for legacy proof-of-concept illustrations. These historical examples do not establish conformance with the ratified pack. [Current release examples](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/examples/index.md) use the OSERA-SP-0.1.0 naming conventions.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 220
standard_id: REL-002
title: Bytecode Compatibility
summary: Patched artifacts preserve the bytecode level of the last released
  artifact unless an explicit exception is approved.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: 2026-09-10
fitness-role: Required evidence
type: REL
category: Release Process
applies-to:
  - Patch providers
  - Enterprise recipients
requirements:
  - id: REL-002.REQ-001
    level: MUST
    text: Patched Java artifacts must preserve the bytecode level of the last
      released artifact unless an exception is approved.
    checkability: automated
    checks:
      - id: REL-002.CHECK-001
        title: Bytecode level matches the prior released artifact
        type: artifact
        severity: blocking
        implementation: osera-fitness.rel002.bytecode_level
        evidence:
          - artifact_digest
          - bytecode_level
          - reference_artifact
```

## Source provenance

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/rel-002-bytecode-compatibility.md) · Source SHA-256: `77a2195ef359325df0f3819714977463442eab1a1981389e741b0121d7b2fe78`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
