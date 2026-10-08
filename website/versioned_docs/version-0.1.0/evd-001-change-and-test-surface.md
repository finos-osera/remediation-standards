---
id: evd-001-change-and-test-surface
title: EVD-001 · Change and Test Surface Guidance
sidebar_label: EVD-001 · Change and Test Surface Guidance
sidebar_position: 410
description: Providers publish concise recipient guidance describing what
  changed and what surface area should be tested.
---

:::info[Observe only · not ratified]

**Standard 0.0.1** · Recipient Evidence. OSERA-SP-0.1.0 was ratified on September 10, 2026; this reconstruction awaits baseline confirmation.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Providers publish concise recipient guidance describing what changed and what surface area should be tested.


## Requirement

Patch providers SHOULD publish a recipient-facing summary alongside each patch that describes:

* what changed;
* why the change was made;
* whether the patch is an upstream backport or provider-developed fix;
* what application surface area recipients should consider testing;
* references to OpenRewrite recipes, markdown, LLM-friendly context, or other machine-readable guidance when available.

## Rationale

Financial services consumers need more than a coordinate. They need enough context to evaluate the patch, route testing, and explain adoption decisions internally.

## Suggested schema

```yaml
recipient_guidance:
  schema_version: 0.1.0
  what_changed:
    - Short, concrete change summary.
  suggested_test_surface:
    - APIs, frameworks, configuration paths, or runtime behaviors to test.
  automation:
    openrewrite_recipes:
      - org.example.security.ExampleRecipe
    llm_context: docs/patch-context.md
```

The draft schema is published at [`/schemas/osera-recipient-guidance-0.1.0.schema.json`](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/schemas/osera-recipient-guidance-0.1.0.schema.json).

## Maturity note

This is an intentionally early standard. The working group should refine the minimum fields and decide which parts belong in feeds, release notes, repository files, or separate evidence bundles.

This is deferred from OSERA-SP-0.1.0 because the working group has not yet defined the expected format tightly enough to make it advisory or required for the first ratification decision. It should run in observe mode and be reconsidered for OSERA-SP-0.2.0.

## Illustrative evidence

See [OSERA Commit Evidence](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/examples/osera-commit-evidence.md) for legacy proof-of-concept illustrations. These historical examples do not establish conformance with the ratified pack. [Current release examples](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/examples/index.md) use the OSERA-SP-0.1.0 naming conventions.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 410
standard_id: EVD-001
title: Change and Test Surface Guidance
summary: Providers publish concise recipient guidance describing what changed
  and what surface area should be tested.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: OSERA-SP-0.2.0 observe
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Observe-only check
type: EVD
category: Recipient Evidence
applies-to:
  - Patch providers
  - Enterprise recipients
  - Tooling providers
requirements:
  - id: EVD-001.REQ-001
    level: SHOULD
    text: Patch providers should publish versioned recipient guidance describing
      what changed and what surface area should be tested.
    checkability: manual
    checks:
      - id: EVD-001.CHECK-001
        title: Recipient guidance uses the current guidance schema
        type: release-evidence
        severity: observe
        implementation: osera-fitness.evd001.recipient_guidance_schema
        evidence:
          - recipient_guidance
          - schema_version
```

## Source provenance

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/evd-001-change-and-test-surface.md) · Source SHA-256: `143308dcee75f1d5d612022fa61db2ad5c12e450ceed7650b2a985c6a6c1ba39`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
