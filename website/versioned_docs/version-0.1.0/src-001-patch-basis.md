---
id: src-001-patch-basis
title: SRC-001 · Patch Basis Classification
sidebar_label: SRC-001 · Patch Basis Classification
sidebar_position: 110
description: Providers distinguish upstream backports from provider-developed
  fixes for each CVE or fix item carried by a patch release.
---

:::info[Pre-Draft · Observe only in pack 0.1.0]

**Standard 0.0.1** · Source Changes. Included for observation, not ratified.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Providers distinguish upstream backports from provider-developed fixes for each CVE or fix item carried by a patch release.


## Requirement

Patch providers SHOULD classify whether each CVE or fix item in a patch release is based on an upstream fix, an adapted upstream fix, or a provider-developed fix.

The working group still needs to define the classification vocabulary and the minimum wording a provider uses when deciding whether each fix item is a direct backport, an adapted backport, or a locally developed fix.

## Rationale

OSERA experience shows that carrying fixes onto older project lines is often possible even for older projects and build systems. Some cases still require judgement about what constitutes a safe fix.

Consumers need to know whether each CVE or fix item in a release is a backport of an upstream decision or an independently developed fix. One release can carry multiple CVEs with different origins.

This remains too vague to enforce as a blocking v0.1.0 requirement without a controlled vocabulary, example wording, and clearer evidence rules. It should run in observe mode for the v0.1.0 gate and be refined for OSERA-SP-0.2.0 consideration.

## Feed consideration

The patch basis SHOULD be surfaced in vulnerability and advisory feeds so scanning products and enterprise policy engines can distinguish backport provenance.

## Unresolved issue

The working group needs to decide:

* what values are allowed for patch basis;
* how patch basis is recorded per CVE or fix item;
* when an adapted upstream fix stops being a backport and becomes provider-developed;
* what minimum provider explanation is required;
* whether the classification belongs in release evidence, feed entries, or both.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 110
standard_id: SRC-001
title: Patch Basis Classification
summary: Providers distinguish upstream backports from provider-developed fixes
  for each CVE or fix item carried by a patch release.
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
    text: Patch providers should classify whether each CVE or fix item in a patch
      release is based on an upstream fix, an adapted upstream fix, or a
      provider-developed fix, using a vocabulary still to be defined by the
      working group.
    checkability: manual
    checks:
      - id: SRC-001.CHECK-001
        title: Patch basis classification is present
        type: release-evidence
        severity: observe
        implementation: osera-fitness.src001.patch_basis
        evidence:
          - fix_item
          - cve_id
          - patch_basis_by_fix
          - upstream_fix_reference
```

## Source provenance

**Historical copy:** Reconstructed from [PR #51](https://github.com/finos-osera/remediation-standards/pull/51); snapshot verification pending.

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/src-001-patch-basis.md) · Source SHA-256: `6586e4e4927b00734b15282c7e93d1b802fa80a4de04c5126d64e876def48ca5`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
