---
schema-version: 0.1.0
sequence: 40
standard_id: FORK-004
title: Open Source Patch Publication
summary: Patched-source repositories should be fully public, hosted in the appropriate
  official fork, and released under the same open-source license terms as the original
  code.
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
  text: Patched-source repositories must be fully public and publicly fetchable without
    private credentials.
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
    license files and notices and release patched source under the same applicable
    license terms as the original source line.
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
  text: Patched-source repositories must be hosted in the appropriate official OSERA
    fork for the upstream project or artifact line.
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
---

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

## Open questions

* Should any temporary security embargo workflow be allowed, and if so when must the repository become public?
* Should public accessibility be required before release publication, feed publication, or only before claiming standards-pack alignment?
* How should the working group handle upstream projects with multiple licenses, generated notices, or license files outside the repository root?
* Should the fitness function fail private repositories outright or report them as not eligible for alignment?
* What evidence is sufficient to show that every source file in a patched release remains under the same applicable open-source license terms as the original source line?
