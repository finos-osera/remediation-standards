---
schema-version: 0.1.0
sequence: 110
standard_id: SRC-001
title: Patch Basis Classification
summary: Providers distinguish upstream backports from provider-developed fixes where
  no upstream fix exists.
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
- Enterprise recipients
- Feed maintainers
requirements:
- id: SRC-001.REQ-001
  level: SHOULD
  text: Patch providers should backpatch an upstream fix when one exists and identify
    provider-developed fixes when no upstream fix exists.
  checkability: manual
  checks:
  - id: SRC-001.CHECK-001
    title: Patch basis classification is present
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.src001.patch_basis
    evidence:
    - patch_basis
    - upstream_fix_reference
---

## Requirement

Patch providers SHOULD make commercially reasonable efforts to backpatch an upstream fix when one exists.

When no upstream fix exists, providers MAY develop a fix using provider judgement. In that case, the patch evidence MUST identify that the change is not a direct upstream backport.

## Rationale

OSERA experience shows that backpatching is often possible even for older projects and build systems. Some cases still require judgement about what constitutes a safe fix.

Consumers need to know whether they are reviewing a backport of an upstream decision or an independently developed fix.

## Feed consideration

The patch basis SHOULD be surfaced in vulnerability and advisory feeds so scanning products and enterprise policy engines can distinguish backport provenance.
