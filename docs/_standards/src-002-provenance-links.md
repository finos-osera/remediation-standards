---
schema-version: 0.1.0
sequence: 120
standard_id: SRC-002
title: Upstream Provenance Links
summary: Backports link to the upstream commit or advisory that introduced the fix
  being carried back.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required evidence
type: SRC
category: Source Changes
applies-to:
- Patch providers
- Enterprise recipients
requirements:
- id: SRC-002.REQ-001
  level: MUST
  text: Backport evidence must link to the upstream commit, commit range, pull request,
    advisory, or release note defining the fix.
  checkability: partially-automated
  checks:
  - id: SRC-002.CHECK-001
    title: Upstream provenance link is present
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.src002.upstream_provenance_link
    evidence:
    - upstream_fix_url
    - backpatch_commit_url
---

## Requirement

When a patch backports an upstream fix, the patch record MUST link to the upstream commit being backported.

If the upstream fix spans multiple commits, the patch record MUST link to the relevant commit range, pull request, advisory, or release note that defines the fix.

## Rationale

This creates a full provenance chain when the fix was applied to a later supported line but not carried back by the original maintainer.

## Evidence

Patch evidence SHOULD include:

* upstream commit URL or equivalent source;
* OSERA backpatch commit URL;
* vulnerability identifier;
* affected and patched artifact coordinates;
* notes on deviations from the upstream fix, if any.

## Observed OSERA example

The `backpatch-spring-framework` commit for CVE-2024-38816 links to the upstream Spring Framework commit it backports and describes Java 8 source-level adaptations made while carrying the fix back to the 5.3.x line:

<https://github.com/finos-osera/backpatch-spring-framework/commit/dfaa2e9a99173fc9cbb22a76c99f9acfe616ede6>
