---
sequence: 230
standard_id: REL-003
title: Patch Initiative Version Metadata
summary: Patched releases use SemVer build metadata that identifies the patching initiative and release sequence.
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
<UPSTREAM_VERSION>+<PATCH_INITIATIVE>.NNN
```

`<PATCH_INITIATIVE>` SHOULD identify the patching initiative, provider, or organization responsible for the patched release. For OSERA-managed releases, the candidate metadata token is:

```text
osera-patch.NNN
```

`NNN` MUST be monotonically increasing for the same upstream version line and patching initiative.

Release tags, artifact versions, vulnerability feeds, and release evidence MUST carry the same patched-release identifier so recipients can correlate source, binary, scanner, and advisory records.

Existing OSERA backpatch repositories currently use `+backpatch.NNN`. The working group should treat that form as deployed evidence and define whether v0.1 accepts it as a transition alias, grandfathered historical form, or replacement candidate before ratification.

## Rationale

This form preserves the upstream version while making the patched artifact distinguishable. Including the patching initiative in the visible component coordinate helps SCA tools, inventories, and approval workflows distinguish OSERA-managed releases from other downstream backpatch providers when repository or feed metadata is not shown.

The numeric suffix keeps ordering simple for repeated releases on the same upstream version line and works with build tools whose dynamic resolution behavior uses lexicographic ordering.

## Examples

```text
5.3.39+osera-patch.001
5.3.39+osera-patch.002
```

## Observed OSERA examples

Public OSERA repositories currently include deployed `+backpatch.NNN` release tags such as:

* `backpatch-spring-framework`: `v5.3.39+backpatch.001`
* `backpatch-gson`: `v2.8.8+backpatch.001`
* `backpatch-activemq`: `v5.14.5+backpatch.001`
