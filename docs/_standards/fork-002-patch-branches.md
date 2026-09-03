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
ratified-date: '2026-09-04'
fitness-role: Required check
type: FORK
category: Fork Management
applies-to:
- Patch providers
- OSERA maintainers
requirements:
- id: FORK-002.REQ-001
  level: MUST
  text: Patch providers must create version-scoped source workflow branches using
    patch/<version>.
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

The `patch/` prefix is deliberately a source workflow convention, not the official patched-release identity. Official OSERA release tag and artifact version naming remains pending in [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) until package resolver and dependency update-tool compatibility evidence is reviewed.

The version segment in `patch/<version>` SHOULD correspond to the upstream version or maintained line used by the baseline tag in [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/) and the selected patched-release identifier once [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) is ratified.

## Examples

```text
patch/5.3.x
patch/2.7.x
patch/1.2.17
```

## Observed OSERA examples

The public `finos-osera/backpatch-spring-framework` repository uses `backpatch/5.3.39`, and `finos-osera/backpatch-logback` uses `backpatch/1.2.9`. Those examples are legacy/proof-of-concept branches that predate this proposed standard.

Not every current OSERA repository uses this branch convention yet, so tooling should treat it as a target standard rather than an assumption about all historical repos.
