---
schema-version: 0.1.0
sequence: 240
standard_id: REL-004
title: Approved Producers
summary: Official OSERA signed artifacts are produced only by producers approved for
  the targeted standards pack.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: '2026-09-04'
fitness-role: Required check
type: REL
category: Release Process
applies-to:
- OSERA maintainers
- Patch providers
- Repository operators
requirements:
- id: REL-004.REQ-001
  level: MUST
  text: Official OSERA signed artifacts must identify a producer that appears in the
    approved-producer registry for the targeted standards pack.
  checkability: automated
  checks:
  - id: REL-004.CHECK-001
    title: Producer is approved for the targeted standards pack
    type: publication-gate
    severity: blocking
    implementation: osera-fitness.rel004.approved_producer
    evidence:
    - producer_identity
    - approved_producer_registry
- id: REL-004.REQ-002
  level: MUST
  text: The producer identity used at publication time must be recorded in the fitness
    result and release evidence.
  checkability: partially-automated
  checks:
  - id: REL-004.CHECK-002
    title: Producer identity is recorded in release evidence
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel004.producer_identity_evidence
    evidence:
    - producer_identity
    - fitness_result
    - release_evidence
---
## Requirement

Official OSERA signed artifacts MUST be produced by an approved producer for the targeted standards pack.

The publication gate MUST record the producer identity in the fitness result and release evidence.

The approved-producer registry SHOULD be versioned with, or explicitly bound to, the standards pack used by the gate.

## Rationale

The September 20 gate needs a practical trust boundary. FINOS/OSERA should approve who is allowed to produce official artifacts; the producer signs and supplies evidence for what it built.

This supports "aligned, not certified" language for v0.1.0. A passing gate means an approved producer published evidence that satisfied the selected standards pack. It does not mean FINOS guarantees the patched code.

## Pack lifecycle

Approved-producer changes MAY be handled as patch-level standards-pack updates when the standards text and checks do not change.

For example, `OSERA-SP-0.1.1` MAY update the approved-producer registry while still using the same standard versions as `OSERA-SP-0.1.0`.

Requirement changes, new blocking checks, or changed check semantics SHOULD move to a later minor or major standards-pack version.
