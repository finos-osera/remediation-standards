---
schema-version: 0.1.0
sequence: 260
standard_id: REL-006
title: Patch Request Authorization
summary: Patch releases should trace to an approved backlog item, request, sponsor
  record, or equivalent authorization record.
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
  text: Patch releases should identify the backlog item, public request, sponsor record,
    or equivalent authorization record for the patched coordinate and line.
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
---

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
