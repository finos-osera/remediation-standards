---
id: fork-002-patch-branches
title: FORK-002 · Patch Branches
sidebar_label: FORK-002 · Patch Branches
sidebar_position: 20
description: Patch providers use `patch/<version>` source workflow branches for
  every supported major or minor line.
---

:::info[✓ Ratified in pack 0.1.0]

**Standard 0.1.0** · Fork Management. Ratified September 10, 2026.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Patch providers use `patch/<version>` source workflow branches for every supported major or minor line.


## Requirement

Patch providers MUST create source workflow branches using the form:

```text
patch/<version>
```

The `<version>` segment SHOULD identify the major, minor, or maintenance line being patched.

## Rationale

OSERA may patch multiple major or minor versions of a single upstream project. Version-scoped branches make the supported line explicit and avoid mixing unrelated maintenance histories.

The `patch/` prefix is deliberately a source workflow convention, not the official patched-release identity. Official OSERA release tags and artifact versions are defined by [REL-003](/standards/0.1.0/rel-003-version-metadata/) through the applicable ecosystem profile. Java release naming is defined in [REL-003-JAVA](/standards/0.1.0/rel-003-java-patch-version-naming/).

The version segment in `patch/<version>` SHOULD correspond to the upstream version or maintained line used by the baseline tag in [FORK-003](/standards/0.1.0/fork-003-baseline-tags/) and the official patched-release identifier in [REL-003](/standards/0.1.0/rel-003-version-metadata/).

## Examples

```text
patch/5.3.x
patch/2.7.x
patch/1.2.17
```


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 20
standard_id: FORK-002
title: Patch Branches
summary: Patch providers use `patch/<version>` source workflow branches for
  every supported major or minor line.
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
  - OSERA maintainers
requirements:
  - id: FORK-002.REQ-001
    level: MUST
    text: Patch providers must create version-scoped source workflow branches using
      patch/<version>.
    checkability: automated
    checks:
      - id: FORK-002.CHECK-001
        title: Supported line has a patch version branch
        type: repository
        severity: blocking
        implementation: osera-fitness.fork002.patch_branch
        evidence:
          - branch_name
```

## Source provenance

**Historical copy:** Reconstructed from [PR #51](https://github.com/finos-osera/remediation-standards/pull/51); snapshot verification pending.

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/fork-002-patch-branches.md) · Source SHA-256: `603d78ecae0c9f711f94c7afdb3ca31abb0e904d170bd2866217be85fb56ae6a`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
