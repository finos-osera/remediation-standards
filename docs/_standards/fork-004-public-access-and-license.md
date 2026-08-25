---
sequence: 40
standard_id: FORK-004
title: Public Access and License Availability
summary: Backpatch repositories should be fully public and preserve the applicable upstream open-source license files and notices.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: Deferred from OSERA-SP-0.1
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Discussion item
type: FORK
applies-to:
  - Patch providers
  - OSERA maintainers
  - Enterprise recipients
---

## Requirement

Backpatch repositories SHOULD be fully public and publicly accessible without requiring private organization membership, customer portal access, bilateral permission, or authentication beyond ordinary public platform controls.

Backpatch repositories SHOULD contain the same upstream open-source license files and notices that apply to the patched source line, including any additional notices required by the upstream project.

Patch providers SHOULD NOT remove, narrow, or obscure upstream license evidence when publishing a backpatch repository.

## Rationale

OSERA backpatch consumers need to inspect source, provenance, and license evidence before deciding whether a patch can be consumed in regulated environments.

This should be a separate `FORK` standard rather than part of `FORK-003`. `FORK-003` answers whether the baseline source state is tagged. `FORK-004` answers whether the repository and its license evidence are publicly reviewable in the first place.

The working group should discuss this before making it a required v0.1 gate because "publicly accessible" may need precise exceptions for platform outages, rate limits, embargo handling, and projects with complex multi-license structures.

## Evidence

Review evidence SHOULD include:

* repository visibility and public URL;
* whether the repository can be fetched without private credentials;
* license file paths present in the backpatch repository;
* comparison to the upstream license and notice files for the patched source line;
* any approved exception or embargo record.

## Open questions

* Should any temporary security embargo workflow be allowed, and if so when must the repository become public?
* Should public accessibility be required before release publication, feed publication, or only before claiming standards-pack alignment?
* How should the working group handle upstream projects with multiple licenses, generated notices, or license files outside the repository root?
* Should the fitness function fail private repositories outright or report them as not eligible for alignment?
