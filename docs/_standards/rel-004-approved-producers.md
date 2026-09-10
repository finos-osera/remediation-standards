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
ratified-date: '2026-09-10'
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
    approved-producer registry for the targeted standards pack. Each producer record
    must contain id, contact, github_users, and staging_account, with a unique id
    matching the producer identity in release evidence and fitness results.
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

## Initial producer registry format

The initial registry is a YAML document bound to a standards pack through `applies_to_pack`. Each entry in `producers` MUST contain the following fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | Non-empty string | Stable producer identifier used consistently in release evidence and the fitness result. It is unique within the registry. |
| `contact` | Email address string | Contact for producer coordination and escalation. |
| `github_users` | Non-empty list of GitHub usernames | Accounts authorized by the producer to push release tags on its patch repositories. Store usernames without the `@` prefix. |
| `staging_account` | Non-empty string | Producer's upload-account identifier in the staging repository for the initial implementation. |

The `producer` value in release evidence and fitness results MUST match the registry entry's `id`. These fields identify the producer and its initial operational accounts; they do not assert that any particular source line is exclusively assigned to that producer.

The example is illustrative and does not approve a real producer:

```yaml
schema-version: 0.1.0
applies_to_pack: OSERA-SP-0.1.0
producers:
  - id: example-producer
    contact: patches@example.org
    github_users:
      - example-maintainer
    staging_account: example-producer-upload
```

The authoritative registry is [`docs/_data/approved_producers.yml`](https://github.com/finos-osera/remediation-standards/blob/main/docs/_data/approved_producers.yml). An empty `producers` list means that no producers are registered; the example above is not a registry entry.

### Gate scope

For 0.1.0, REL-004 requires registry membership and consistent producer identity in the fitness result and release evidence. The initial fields supply the account metadata needed by implementation teams. Detailed rules for binding authenticated upload accounts, release-tag or commit actors, and signed-result identities are tracked for [0.2.0](https://github.com/finos-osera/remediation-standards/issues/56); listing an account here does not introduce those additional blocking checks into 0.1.0.

Line custody, lead-maintainer responsibilities, optional exclusivity, and line-specific escalation contacts are also included in that 0.2.0 follow-up. The global producer allow list does not imply ownership of every line a producer may patch.

## Rationale

The publication gate needs a practical trust boundary. FINOS/OSERA should approve who is allowed to produce official artifacts; the producer signs and supplies evidence for what it built.

This supports "aligned, not certified" language for v0.1.0. A passing gate means an approved producer published evidence that satisfied the selected standards pack. It does not mean FINOS guarantees the patched code.

## Pack lifecycle

Approved-producer changes MAY be handled as patch-level standards-pack updates when the standards text and checks do not change.

For example, `OSERA-SP-0.1.1` MAY update the approved-producer registry while still using the same standard versions as `OSERA-SP-0.1.0`.

Requirement changes, new blocking checks, or changed check semantics SHOULD move to a later minor or major standards-pack version.
