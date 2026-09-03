---
schema-version: 0.1.0
sequence: 130
standard_id: SRC-003
title: License Headers for New Files
summary: New source or test files match the prevailing license format of the surrounding
  project.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: '2026-09-04'
fitness-role: Required check
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
    - nearest_same_type_file
    - license_header_check
    - not_applicable_rationale
---
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
