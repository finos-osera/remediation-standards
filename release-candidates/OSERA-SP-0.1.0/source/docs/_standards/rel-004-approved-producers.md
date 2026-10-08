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
    result and release evidence, as an exact-string match of the registry entry's id.
    The fitness result and the verdict must also record the registry entry's
    staging_account and github_users as copied from the registry, and separately the
    observed release-tag actor. The observed upload account may be null in the CI
    fitness result because the gate observes it at upload time; this null value does
    not fail the CI check. The gate must record the observed upload account in the
    verdict. In 0.1.0 a difference between the copied account metadata and the
    observed actors is recorded and does not block.
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
    - registry_account_metadata
    - observed_tag_actor
    - observed_upload_account
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

### Tactical architecture for Wave 1 / MVP 1

- The registry consists of one file in this repository, `docs/_data/approved_producers.yml`, bound to the standards pack through `applies_to_pack` and read at the pack version in force.
- It is used by the fitness checks in the producer's CI workflow and by the Exchange gate, for:
  - the REL-004 checks: the producer named in the release evidence and in the fitness result is an approved producer for the pack
  - tracing any artifact, evidence file, fitness result or verdict back to the producer that published it, through `id`
  - attributing an upload in the staging repository to a producer, through `staging_account`
  - reporting who pushed the release tag and whether that account is listed for the producer, through `github_users`
  - naming the producer in the ledger and in the published feeds for every promoted release
  - provisioning: one upload account per producer on the staging repository, named as in `staging_account`, and the GitHub accounts granted on the producer's patch repositories
  - escalation to the producer when a check fails or a release is withdrawn, through `contact`
- `id` is matched as an exact string. The `producer` value in the release evidence and in the fitness result MUST equal the registry entry's `id`.
- `staging_account` and `github_users` are recorded with the fitness result and the verdict in 0.1.0. Binding rules on those accounts are the 0.2.0 follow up (#56).
- A failed REL-004 check refuses the release. The producer may resubmit the same version with corrected evidence.

#### Registry version selection

`applies_to_pack` names the pack, it does not pin the file contents. Producer CI and the Exchange gate resolve the same registry revision through one immutable reference: the release tag of the pack in this repository (`OSERA-SP-0.1.0` for the ratified pack, `OSERA-SP-0.1.1` and following for patch-level registry updates). Both read `docs/_data/approved_producers.yml` at that tag and record the tag as `registry_ref` in the fitness result and in the verdict, next to `pack_checksum`, the SHA-256 of `docs/catalog/packs/<pack>.json` at the same tag. A pack release without a tag is not implementable by either side. Create the pack release tag only after the consolidated pack changes have merged. Published pack tags MUST NOT be moved or reused; registry updates use a new pack release tag.

#### Account reporting

The fitness result carries two things that must not be confused: `producer_accounts.registry`, the `staging_account` and `github_users` copied from the matched registry entry, and `producer_accounts.observed`, what actually happened, the account that pushed the release tag (from the CI run context) and, filled in by the gate, the account that uploaded the artifact. The CI result may record `producer_accounts.observed.upload_account` as `null` without failing REL-004; the gate records the observed upload account in the verdict, alongside the registry metadata and tag actor. A difference is recorded as an observation and is not a failure in 0.1.0. Making it one is the account-binding work on #56. The [fitness function](../../fitness/) page shows the representation.

## Rationale

The publication gate needs a practical trust boundary. FINOS/OSERA should approve who is allowed to produce official artifacts; the producer signs and supplies evidence for what it built.

This supports "aligned, not certified" language for v0.1.0. A passing gate means an approved producer published evidence that satisfied the selected standards pack. It does not mean FINOS guarantees the patched code.

## Pack lifecycle

Approved-producer changes MAY be handled as patch-level standards-pack updates when the standards text and checks do not change.

For example, `OSERA-SP-0.1.1` MAY update the approved-producer registry while still using the same standard versions as `OSERA-SP-0.1.0`.

Requirement changes, new blocking checks, or changed check semantics SHOULD move to a later minor or major standards-pack version.
