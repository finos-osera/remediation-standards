---
schema-version: 0.1.0
sequence: 20
standard_id: FORK-002
title: Backpatch Branches
summary: Patch providers use `backpatch/<version>` branches for every supported major
  or minor line.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: FORK
category: Fork Management
applies-to:
- Patch providers
- OSERA maintainers
requirements:
- id: FORK-002.REQ-001
  level: MUST
  text: Patch providers must create version-scoped backpatch branches using backpatch/<version>.
  checkability: automated
  checks:
  - id: FORK-002.CHECK-001
    title: Supported line has a backpatch version branch
    type: repository
    severity: blocking
    implementation: osera-fitness.fork002.backpatch_branch
    evidence:
    - branch_name
---

## Requirement

Patch providers MUST create backpatch branches using the form:

```text
backpatch/<version>
```

The `<version>` segment SHOULD identify the major, minor, or maintenance line being patched.

## Rationale

OSERA may patch multiple major or minor versions of a single upstream project. Version-scoped branches make the supported line explicit and avoid mixing unrelated maintenance histories.

## Examples

```text
backpatch/5.3.x
backpatch/2.7.x
backpatch/1.2.17
```

## Observed OSERA examples

The public `finos-osera/backpatch-spring-framework` repository uses `backpatch/5.3.39`, and `finos-osera/backpatch-logback` uses `backpatch/1.2.9`.

Not every current backpatch repository uses this branch convention yet, so tooling should treat it as a target standard rather than an assumption about all historical repos.
