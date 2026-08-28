---
schema-version: 0.1.0
sequence: 10
standard_id: FORK-001
title: Repository Naming
summary: Patched-source repositories use a consistent `patch-<reponame>` name in
  the finos-osera GitHub organization.
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
- id: FORK-001.REQ-001
  level: MUST
  text: Patched-source repositories must live in github.com/finos-osera unless the working
    group approves an exception.
  checkability: automated
  checks:
  - id: FORK-001.CHECK-001
    title: Repository is in the finos-osera organization
    type: repository
    severity: blocking
    implementation: osera-fitness.fork001.repository_owner
    evidence:
    - repository_url
- id: FORK-001.REQ-002
  level: MUST
  text: Patched-source repositories must use the prefix patch- followed by the
    upstream repository or artifact name.
  checkability: automated
  checks:
  - id: FORK-001.CHECK-002
    title: Repository name uses the patch prefix
    type: repository
    severity: blocking
    implementation: osera-fitness.fork001.repository_name
    evidence:
    - repository_name
---

## Requirement

Patched-source repositories MUST live in the `github.com/finos-osera` organization unless the working group approves an exception.

Patched-source repositories MUST use the prefix `patch-` followed by the upstream repository or artifact name.

The repository name SHOULD NOT include `osera` when the repository already lives in the `finos-osera` organization. OSERA identity SHOULD be carried by organization ownership, feed metadata, and release evidence instead of duplicating it in every fork name.

## Rationale

The prefix distinguishes forked upstream projects from OSERA governance, tooling, and operations repositories.

Because the repositories are public, the GitHub fork relationship with the upstream project SHOULD be preserved where possible.

Avoiding `osera` inside each repository name keeps fork names short and leaves the upstream project name prominent. The `patch-` prefix is intended to be broad enough for backports, downstream-only security fixes, and future remediation workflows without implying that every OSERA patch is strictly a backpatch.

Existing `finos-osera/backpatch-*` repositories are treated as legacy/proof-of-concept evidence that predates this standard.

## Evidence

Consumers SHOULD be able to identify:

* the OSERA fork URL;
* the upstream project URL;
* whether GitHub retains the fork relationship;
* the artifact coordinates covered by the repository.
