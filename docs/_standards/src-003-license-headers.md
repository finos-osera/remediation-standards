---
schema-version: 0.1.0
sequence: 130
standard_id: SRC-003
title: License Headers for New Files
summary: New source or test files match the prevailing license format of the surrounding
  project.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required evidence
type: SRC
category: Source Changes
applies-to:
- Patch providers
requirements:
- id: SRC-003.REQ-001
  level: MUST
  text: New source or test files added by a patch must follow the prevailing license-header
    convention of the surrounding project.
  checkability: partially-automated
  checks:
  - id: SRC-003.CHECK-001
    title: New files use the local license-header convention
    type: source
    severity: blocking
    implementation: osera-fitness.src003.license_headers
    evidence:
    - new_files
    - license_header_check
---

## Requirement

Patch providers MUST apply the repository's prevailing license header format to net new files added by a patch.

When the surrounding project uses different headers for source and test files, providers SHOULD follow the local file-family convention.

## Rationale

Most fixes modify pre-existing source files that already carry license headers. Test files are often the new files added by a backpatch, so license consistency must be explicit.

## Evidence

Review evidence SHOULD include a license-header check for new files added in the patch commit set.
