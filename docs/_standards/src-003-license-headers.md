---
schema-version: 0.1.0
sequence: 130
standard_id: SRC-003
title: License Headers for New Files
summary: New source or test files match the prevailing license format of the surrounding
  project.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: OSERA-SP-0.2.0 observe
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Observe-only check
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
    severity: observe
    implementation: osera-fitness.src003.license_headers
    evidence:
    - new_files
    - license_header_check
---

## Requirement

Patch providers MUST apply the repository's prevailing license header format to net new files added by a patch.

When the surrounding project uses different headers for source and test files, providers SHOULD follow the local file-family convention.

## Rationale

Most fixes modify pre-existing source files that already carry license headers. Test files are often the new files added by a patch, so license consistency should be explicit.

The working group expects this standard to be enforced where the surrounding project convention is determinable. It is currently scoped for OSERA-SP-0.2.0 because the evaluation rule is not yet deterministic enough for SP-0.1.0 across mixed-license projects, generated files, language-specific conventions, or projects with no per-file header practice.

During the SP-0.1.0 gate, this should run in observe mode so the working group can decide how to distinguish enforceable cases from cases that need manual review or an explicit not-applicable result.

## Evidence

Review evidence SHOULD include a license-header check for new files added in the patch commit set, the local convention used for comparison, and any not-applicable rationale.
