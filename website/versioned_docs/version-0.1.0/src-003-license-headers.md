---
id: src-003-license-headers
title: SRC-003 · License Headers for New Files
sidebar_label: SRC-003 · License Headers for New Files
sidebar_position: 130
description: New source or test files match the prevailing license format of the
  surrounding project.
---

:::info[Recorded ratified · archive candidate]

**Standard 0.1.0** · Source Changes. OSERA-SP-0.1.0 was ratified on September 10, 2026; this reconstruction awaits baseline confirmation.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

New source or test files match the prevailing license format of the surrounding project.


## Requirement

Patch providers MUST apply the repository's prevailing license header format to net new files added by a patch when the local convention is determinable.

When the surrounding project uses different headers for source and test files, providers SHOULD follow the local file-family convention.

For the SP-0.1.0 gate, the check SHOULD compare a new file against the nearest existing file of the same type in the same module. The comparison SHOULD ignore copyright years and whitespace-only differences.

The result SHOULD be `not-applicable` when the module has no determinable license-header convention.

## Rationale

Most fixes modify pre-existing source files that already carry license headers. Test files are often the new files added by a patch, so license consistency should be explicit.

The working group expects this standard to be enforced where the surrounding project convention is determinable. The fail-open rule keeps the SP-0.1.0 gate focused on clear cases while allowing `not-applicable` where no local convention exists.

## Evidence

Review evidence SHOULD include a license-header check for new files added in the patch commit set, the nearest same-type file used for comparison, the local convention used for comparison, and any not-applicable rationale.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 130
standard_id: SRC-003
title: License Headers for New Files
summary: New source or test files match the prevailing license format of the
  surrounding project.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: 2026-09-10
fitness-role: Required check
type: SRC
category: Source Changes
applies-to:
  - Patch providers
requirements:
  - id: SRC-003.REQ-001
    level: MUST
    text: New source or test files added by a patch must follow the prevailing
      license-header convention of the surrounding project.
    checkability: partially-automated
    checks:
      - id: SRC-003.CHECK-001
        title: New files use the local license-header convention
        type: source
        severity: blocking
        implementation: osera-fitness.src003.license_headers
        evidence:
          - new_files
          - nearest_same_type_file
          - license_header_check
          - not_applicable_rationale
```

## Source provenance

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/src-003-license-headers.md) · Source SHA-256: `ab9e760e0eb31628032f59ecf3f9c9f6681a9ff0ca7348cd584203da868b0093`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
