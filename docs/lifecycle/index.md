---
title: Standard Lifecycle
permalink: /lifecycle/
---

This lifecycle defines how OSERA remediation standards and standards packs move from early proposal to ratified material. It is intentionally small so the working group can use it immediately for the first standards-pack decision.

The standards group should approve this lifecycle before, or at the same time as, the first ratified standards pack.

## Identifiers and versions

Standards use the existing OSERA identifier form:

```text
<CATEGORY>-<NNN>
```

Examples include `FORK-001`, `REL-003`, and `FORK-004`.

The identifier is stable for the life of the standard. A standard also carries a separate `standard-version` value. The version changes when the standard text changes; the identifier does not.

Use a new version of the same identifier when the standard is still about the same requirement area:

```text
FORK-004 v0.0.1  Pre-Draft
FORK-004 v0.1.0  Draft
FORK-004 v1.0.0  Ratified
FORK-004 v1.1.0  Revised
```

Do not create identifiers such as `FORK-004.1`. The dotted value belongs in `standard-version`, not in `standard_id`.

## When to create a new standard ID

Create a new standard ID when the proposed material defines a distinct requirement area that implementers could satisfy independently.

Use a new ID when:

* the requirement has a different category or compliance surface;
* the change would be clearer as a separate checklist item in a fitness result;
* the old and new requirements may be included in different standards packs;
* the new requirement can be deferred while the existing standard remains stable.

Do not create a new ID when:

* the change clarifies wording without changing the requirement area;
* the change adds examples, rationale, or evidence fields to the same requirement;
* the change tightens or relaxes the same requirement after implementation feedback;
* the change corrects an error in the current text.

When a new standard replaces an older one, keep the older standard addressable and mark the relationship with `supersedes` and `superseded-by` metadata.

## Standard statuses

| Status | Meaning |
| --- | --- |
| Pre-Draft | Early proposal or discussion item. It may be useful direction but is not ready to become a required alignment check. |
| Draft | Written for working-group review and implementation feedback. Draft standards may be included in a candidate standards pack. |
| Ratification-Candidate | The working group is considering a specific version for approval. Changes should be limited to review feedback and explicit meeting decisions. |
| Ratified | Approved by the standards group for use in an OSERA standards pack or as standalone guidance. |
| Superseded | Replaced by a later version or another standard. The old text remains available for historical pack references. |
| Withdrawn | Removed from the active standards path without replacement. |

## Standards packs

A standards pack records a named set of standard versions. The pack, not an individual standard, is what implementers target for alignment.

Standards packs use the existing OSERA pack naming form:

```text
OSERA-SP-<VERSION>
```

For example, `OSERA-SP-0.1.0` can include `FORK-001 v0.1.0`, `REL-003 v0.1.0`, and other specific standard versions.

Ratifying a pack freezes the list of included standard versions for that pack. If `FORK-001` later changes to `v0.2.0`, `OSERA-SP-0.1.0` still refers to `FORK-001 v0.1.0`. A later pack can include the revised version.

## Pack patch versions and approved producers

Standards-pack versions use SemVer.

Patch-level pack versions MAY update administrative pack metadata, such as an approved-producer registry, when the standard text, standard versions, check IDs, and check semantics do not change.

For example, `OSERA-SP-0.1.1` MAY update the approved-producer registry for the same gate rules as `OSERA-SP-0.1.0`.

Minor or major pack versions SHOULD be used when standards text, blocking check semantics, or included standard versions change.

## When to create a standards pack

Create a standards pack when the working group wants implementers to target a coherent set of requirements together.

Common reasons include:

* establishing an initial acceptance gate;
* publishing a new group of requirements after implementation feedback;
* replacing a prior pack with revised standard versions;
* separating required checks from advisory or deferred material.

A pack should identify:

* pack ID and status;
* proposed date and ratified date, if any;
* target decision date for candidate packs;
* exact included standard IDs and versions;
* deferred standards and rationale;
* issue or meeting record for the decision;
* expected fitness-function checks.
* approved-producer registry or binding, if official signed artifacts depend on producer approval.

## Ratification effect

Ratifying a standards pack does not automatically ratify future edits to its included standards.

Ratification means the standards group has approved a specific pack record and the exact standard versions named in that record. Later revisions need their own review and inclusion in a later pack.

## Fitness function relationship

The fitness function should report the standards pack tested, the exact standard versions tested, and the result for each check.

For v0.1.0, repositories should claim standards-pack alignment only against a named ratified pack. Certification language should wait until the working group approves a certification or accreditation process.
