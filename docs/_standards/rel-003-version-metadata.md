---
sequence: 230
standard_id: REL-003
title: Backpatch Version Metadata
summary: Patched releases use SemVer metadata in the form `+backpatch.NNN`.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: REL
applies-to:
  - Patch providers
  - Enterprise recipients
---

## Requirement

Patch providers SHOULD release patched artifacts using SemVer build metadata in the form:

```text
<UPSTREAM_VERSION>+backpatch.NNN
```

`NNN` MUST be monotonically increasing for the same upstream version line.

OSERA release names SHOULD NOT add a second OSERA-specific token such as `+osera-backpatch.NNN` unless the working group later finds a concrete interoperability need. The current `+backpatch.NNN` form is shorter, already deployed, and keeps OSERA identity in the repository, feed, and provider metadata.

## Rationale

This form preserves the upstream version while making the patched artifact distinguishable. It also works well with build tools whose dynamic resolution behavior uses lexicographic ordering.

## Examples

```text
5.3.39+backpatch.001
5.3.39+backpatch.002
```

## Observed OSERA examples

Public OSERA repositories currently include release tags such as:

* `backpatch-spring-framework`: `v5.3.39+backpatch.001`
* `backpatch-gson`: `v2.8.8+backpatch.001`
* `backpatch-activemq`: `v5.14.5+backpatch.001`
