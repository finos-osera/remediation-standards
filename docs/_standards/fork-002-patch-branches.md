---
schema-version: 0.1.0
sequence: 20
standard_id: FORK-002
title: Patch Branches
summary: Patch providers use `patch/<version>` source workflow branches for every
  supported major or minor line.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: '2026-09-10'
fitness-role: Required check
type: FORK
category: Fork Management
applies-to:
- Patch providers
- OSERA maintainers
requirements:
- id: FORK-002.REQ-001
  level: MUST
  text: Patch providers must create version-scoped source workflow branches using patch/<version>.
  checkability: automated
  checks:
  - id: FORK-002.CHECK-001
    title: Supported line has a patch version branch
    type: repository
    severity: blocking
    implementation: osera-fitness.fork002.patch_branch
    evidence:
    - branch_name
---

## Requirement

Patch providers MUST create source workflow branches using the form:

```text
patch/<version>
```

The `<version>` segment SHOULD identify the major, minor, or maintenance line being patched.

## Rationale

OSERA may patch multiple major or minor versions of a single upstream project. Version-scoped branches make the supported line explicit and avoid mixing unrelated maintenance histories.

The `patch/` prefix is deliberately a source workflow convention, not the official patched-release identity. Official OSERA release tags and artifact versions are defined by [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) through the applicable ecosystem profile. Java release naming is defined in [REL-003-JAVA]({{ site.baseurl }}/standards/rel-003-java-patch-version-naming/).

The version segment in `patch/<version>` SHOULD correspond to the upstream version or maintained line used by the baseline tag in [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/) and the official patched-release identifier in [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/).

## Examples

```text
patch/5.3.x
patch/2.7.x
patch/1.2.17
```
