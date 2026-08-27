---
schema-version: 0.1.0
sequence: 110
standard_id: SRC-001
title: Patch Basis Classification
summary: Providers distinguish upstream backports from provider-developed fixes where
  no upstream fix exists.
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
- Enterprise recipients
- Feed maintainers
requirements:
- id: SRC-001.REQ-001
  level: SHOULD
  text: Patch providers should classify whether a patch is based on an upstream fix,
    an adapted upstream fix, or a provider-developed fix, using a vocabulary still
    to be defined by the working group.
  checkability: manual
  checks:
  - id: SRC-001.CHECK-001
    title: Patch basis classification is present
    type: release-evidence
    severity: observe
    implementation: osera-fitness.src001.patch_basis
    evidence:
    - patch_basis
    - upstream_fix_reference
---

## Requirement

Patch providers SHOULD classify whether a patch is based on an upstream fix, an adapted upstream fix, or a provider-developed fix.

The working group still needs to define the classification vocabulary and the minimum wording a provider uses when deciding whether the change is a direct backport, an adapted backport, or a locally developed fix.

## Rationale

OSERA experience shows that carrying fixes onto older project lines is often possible even for older projects and build systems. Some cases still require judgement about what constitutes a safe fix.

Consumers need to know whether they are reviewing a backport of an upstream decision or an independently developed fix.

This remains too vague to enforce as a blocking v0.1.0 requirement without a controlled vocabulary, example wording, and clearer evidence rules. It should run in observe mode for the v0.1.0 gate and be refined for OSERA-SP-0.2.0 consideration.

## Feed consideration

The patch basis SHOULD be surfaced in vulnerability and advisory feeds so scanning products and enterprise policy engines can distinguish backport provenance.

## Unresolved issue

The working group needs to decide:

* what values are allowed for patch basis;
* when an adapted upstream fix stops being a backport and becomes provider-developed;
* what minimum provider explanation is required;
* whether the classification belongs in release evidence, feed entries, or both.
