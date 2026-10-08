---
id: fork-004-open-source-patch-publication
title: FORK-004 · Open Source Patch Publication
sidebar_label: FORK-004 · Open Source Patch Publication
sidebar_position: 40
description: Patched-source repositories should be fully public, hosted in the
  appropriate official fork, and released under the same open-source license
  terms as the original code.
---

:::info[Pre-Draft · Observe only in pack 0.1.0]

**Standard 0.0.1** · Fork Management. Included for observation, not ratified.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Patched-source repositories should be fully public, hosted in the appropriate official fork, and released under the same open-source license terms as the original code.


## Requirement

Patched-source repositories MUST be fully public and publicly accessible without requiring private organization membership, customer portal access, bilateral permission, or authentication beyond ordinary public platform controls.

Patched-source repositories MUST be hosted in the appropriate official OSERA fork for the upstream project or artifact line.

Patched-source repositories MUST contain the same upstream open-source license files and notices that apply to the patched source line, including any additional notices required by the upstream project.

Patch providers MUST release all patched source code under the same applicable open-source license terms as the original source line.

Patch providers SHOULD NOT remove, narrow, or obscure upstream license evidence when publishing a patched-source repository.

## Rationale

OSERA patch consumers need to inspect source, provenance, and license evidence before deciding whether a patch can be consumed in regulated environments.

This should be a separate `FORK` standard rather than part of `FORK-003`. `FORK-003` answers whether the baseline source state is tagged. `FORK-004` answers whether the repository and its license evidence are publicly reviewable in the first place.

The working group should discuss this before making it a required gate because "publicly accessible", "same license", and "appropriate official fork" may need precise exceptions for platform outages, rate limits, embargo handling, generated code, bundled third-party material, and projects with complex multi-license structures.

## Evidence

Review evidence SHOULD include:

* repository visibility and public URL;
* whether the repository can be fetched without private credentials;
* official OSERA fork URL;
* license file paths present in the patched-source repository;
* comparison to the upstream license and notice files for the patched source line;
* evidence that patched source files remain under the applicable upstream license terms;
* any approved exception or embargo record.

## Scope of observe-mode evidence

Observe-mode results collect evidence about embargo workflows, the timing of public access, multi-license projects and generated notices, private-repository eligibility, and source-license continuity. These areas are outside the required OSERA-SP-0.1.0 checks.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 40
standard_id: FORK-004
title: Open Source Patch Publication
summary: Patched-source repositories should be fully public, hosted in the
  appropriate official fork, and released under the same open-source license
  terms as the original code.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: OSERA-SP-0.2.0 observe
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Observe-only check
type: FORK
category: Fork Management
applies-to:
  - Patch providers
  - OSERA maintainers
  - Enterprise recipients
requirements:
  - id: FORK-004.REQ-001
    level: MUST
    text: Patched-source repositories must be fully public and publicly fetchable
      without private credentials.
    checkability: automated
    checks:
      - id: FORK-004.CHECK-001
        title: Repository is publicly fetchable
        type: repository
        severity: observe
        implementation: osera-fitness.fork004.public_fetch
        evidence:
          - repository_url
          - fetch_result
  - id: FORK-004.REQ-002
    level: MUST
    text: Patched-source repositories must preserve applicable upstream open-source
      license files and notices and release patched source under the same
      applicable license terms as the original source line.
    checkability: partially-automated
    checks:
      - id: FORK-004.CHECK-002
        title: Upstream license terms, files, and notices are preserved
        type: repository
        severity: observe
        implementation: osera-fitness.fork004.license_files
        evidence:
          - license_files
          - upstream_license_files
  - id: FORK-004.REQ-003
    level: MUST
    text: Patched-source repositories must be hosted in the appropriate official
      OSERA fork for the upstream project or artifact line.
    checkability: partially-automated
    checks:
      - id: FORK-004.CHECK-003
        title: Repository is the appropriate official OSERA fork
        type: repository
        severity: observe
        implementation: osera-fitness.fork004.official_fork
        evidence:
          - repository_url
          - upstream_repository_url
          - fork_relationship
```

## Source provenance

**Historical copy:** Reconstructed from [PR #51](https://github.com/finos-osera/remediation-standards/pull/51); snapshot verification pending.

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/fork-004-open-source-patch-publication.md) · Source SHA-256: `db147572ce572230ca25fea295aec64c9bf56b32f9e626b2b07c2c481a640c18`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
