---
id: rel-006-patch-request-authorization
title: REL-006 · Patch Request Authorization
sidebar_label: REL-006 · Patch Request Authorization
sidebar_position: 260
description: Patch releases should trace to an approved backlog item, request,
  sponsor record, or equivalent authorization record.
---

:::info[Observe only · not ratified]

**Standard 0.0.1** · Release Process. OSERA-SP-0.1.0 was ratified on September 10, 2026; this reconstruction awaits baseline confirmation.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Patch releases should trace to an approved backlog item, request, sponsor record, or equivalent authorization record.


## Requirement

Patch releases SHOULD identify the backlog item, public request, sponsor record, or equivalent authorization record for the patched coordinate and line.

## Rationale

The publication gate may need to know that a producer was authorized to release a patch for a specific coordinate and maintenance line.

This is deferred to observe mode because the working group has not yet decided whether the backlog is always public, whether privately sponsored requests are allowed, or what evidence should be visible to recipients.

## Observe-mode evidence

Observe-mode evidence SHOULD identify:

* patched coordinate;
* upstream version line;
* public backlog item, if available;
* sponsor or request record, if the backlog item is not public;
* approval or exception record.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 260
standard_id: REL-006
title: Patch Request Authorization
summary: Patch releases should trace to an approved backlog item, request,
  sponsor record, or equivalent authorization record.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: OSERA-SP-0.2.0 observe
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Observe-only check
type: REL
category: Release Process
applies-to:
  - OSERA maintainers
  - Patch providers
  - Repository operators
requirements:
  - id: REL-006.REQ-001
    level: SHOULD
    text: Patch releases should identify the backlog item, public request, sponsor
      record, or equivalent authorization record for the patched coordinate and
      line.
    checkability: manual
    checks:
      - id: REL-006.CHECK-001
        title: Patch request authorization evidence is present
        type: release-evidence
        severity: observe
        implementation: osera-fitness.rel006.patch_request_authorization
        evidence:
          - backlog_item
          - sponsor_record
          - coordinate_line
```

## Source provenance

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/rel-006-patch-request-authorization.md) · Source SHA-256: `780526c64f4d535121c71ccbf42bd275f8021515bb360d23d5d57bcfc3c5f177`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
