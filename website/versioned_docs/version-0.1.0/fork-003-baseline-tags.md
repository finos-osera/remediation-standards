---
id: fork-003-baseline-tags
title: FORK-003 · Baseline Tags
sidebar_label: FORK-003 · Baseline Tags
sidebar_position: 30
description: Every patch line identifies its unpatched starting source SHA with
  a `v<VERSION>+patch.baseline` tag.
---

:::info[Recorded ratified · archive candidate]

**Standard 0.1.0** · Fork Management. OSERA-SP-0.1.0 was ratified on September 10, 2026; this reconstruction awaits baseline confirmation.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Every patch line identifies its unpatched starting source SHA with a `v<VERSION>+patch.baseline` tag.


## Requirement

Patch providers MUST tag the commit that represents the unpatched baseline source state for a patched version.

The tag MUST use the form:

```text
v<VERSION>+patch.baseline
```

This tag scheme applies regardless of the upstream project tag convention.

## Rationale

Recipients need an unambiguous starting point for source comparison, provenance review, and audit evidence.

The `+patch.baseline` suffix is deliberately a source baseline marker. It does not identify an official patched release or artifact. Official OSERA patched releases are defined by [REL-003](/standards/0.1.0/rel-003-version-metadata/) through the applicable ecosystem profile. Java release naming is defined in [REL-003-JAVA](/standards/0.1.0/rel-003-java-patch-version-naming/).

The `<VERSION>` segment in `v<VERSION>+patch.baseline` SHOULD correspond to the source branch version in [FORK-002](/standards/0.1.0/fork-002-patch-branches/) and the upstream version segment in the official patched-release identifier defined by [REL-003](/standards/0.1.0/rel-003-version-metadata/).

## Evidence

Patch evidence SHOULD include the baseline tag, the commit SHA it resolves to, and the corresponding upstream version or artifact.

## Illustrative examples

| Repository | Baseline tag |
| --- | --- |
| `patch-spring-framework` | `v5.3.39+patch.baseline` |
| `patch-gson` | `v2.8.8+patch.baseline` |
| `patch-activemq` | `v5.14.5+patch.baseline` |

These examples show the ratified naming convention, not an inventory of published patches.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 30
standard_id: FORK-003
title: Baseline Tags
summary: Every patch line identifies its unpatched starting source SHA with a
  `v<VERSION>+patch.baseline` tag.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: 2026-09-10
fitness-role: Required check
type: FORK
category: Fork Management
applies-to:
  - Patch providers
  - Enterprise recipients
requirements:
  - id: FORK-003.REQ-001
    level: MUST
    text: Patch providers must tag the unpatched baseline source commit using
      v<VERSION>+patch.baseline.
    checkability: automated
    checks:
      - id: FORK-003.CHECK-001
        title: Baseline tag exists and resolves to a commit
        type: repository
        severity: blocking
        implementation: osera-fitness.fork003.baseline_tag
        evidence:
          - baseline_tag
          - baseline_commit
```

## Source provenance

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/fork-003-baseline-tags.md) · Source SHA-256: `1826bce1155f761364b3dc8ef7d246d0094bdc20f99e519b3d0083501ea13509`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
