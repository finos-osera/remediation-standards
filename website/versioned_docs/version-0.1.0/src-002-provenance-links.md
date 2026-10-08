---
id: src-002-provenance-links
title: SRC-002 · Upstream Provenance Links
sidebar_label: SRC-002 · Upstream Provenance Links
sidebar_position: 120
description: Backports link to the upstream commit or advisory that introduced
  the fix being carried back.
---

:::info[Recorded ratified · archive candidate]

**Standard 0.1.0** · Source Changes. OSERA-SP-0.1.0 was ratified on September 10, 2026; this reconstruction awaits baseline confirmation.

[Version history](#version-history) · [All versions & release notes](/versions/)

:::

Backports link to the upstream commit or advisory that introduced the fix being carried back.


## Requirement

When a patch backports an upstream fix, the patch record MUST link to the upstream commit being backported.

If the upstream fix spans multiple commits, the patch record MUST link to the relevant commit range, pull request, advisory, or release note that defines the fix.

When a backported commit carries upstream-authored code, the commit SHOULD name the upstream commit and include a `Co-authored-by` trailer for the upstream author where applicable.

## Rationale

This creates a full provenance chain when the fix was applied to a later supported line but not carried back by the original maintainer.

## Evidence

Patch evidence SHOULD include:

* upstream commit URL or equivalent source;
* OSERA patch commit URL;
* upstream author identity and `Co-authored-by` trailer where applicable;
* vulnerability identifier;
* affected and patched artifact coordinates;
* notes on deviations from the upstream fix, if any.

## Illustrative evidence

See [OSERA Commit Evidence](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/examples/osera-commit-evidence.md) for legacy proof-of-concept illustrations. These historical examples do not establish conformance with the ratified pack. [Current release examples](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/examples/index.md) use the OSERA-SP-0.1.0 naming conventions.


## Version history

This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status.

## Structured requirements and checks

These definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.

```yaml
schema-version: 0.1.0
sequence: 120
standard_id: SRC-002
title: Upstream Provenance Links
summary: Backports link to the upstream commit or advisory that introduced the
  fix being carried back.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: 2026-09-10
fitness-role: Required evidence
type: SRC
category: Source Changes
applies-to:
  - Patch providers
  - Enterprise recipients
requirements:
  - id: SRC-002.REQ-001
    level: MUST
    text: Backport evidence must link to the upstream commit, commit range, pull
      request, advisory, or release note defining the fix.
    checkability: partially-automated
    checks:
      - id: SRC-002.CHECK-001
        title: Upstream provenance link is present
        type: release-evidence
        severity: blocking
        implementation: osera-fitness.src002.upstream_provenance_link
        evidence:
          - upstream_fix_url
          - patch_commit_url
  - id: SRC-002.REQ-002
    level: SHOULD
    text: Backported commits carrying upstream-authored code should name the
      upstream commit and include a Co-authored-by trailer for the upstream
      author where applicable.
    checkability: manual
    checks:
      - id: SRC-002.CHECK-002
        title: Upstream authorship trailer is present where applicable
        type: source
        severity: advisory
        implementation: osera-fitness.src002.co_authored_by_trailer
        evidence:
          - upstream_commit_author
          - co_authored_by_trailer
          - not_applicable_rationale
```

## Source provenance

[Historical source at 51e0afe](https://github.com/finos-osera/remediation-standards/blob/51e0afebeb789c266efe3a6802fa59fbb3d8e999/docs/_standards/src-002-provenance-links.md) · Source SHA-256: `ac2e9cda9bc75e505efca47d390f507c921014cfac3235b542c4aa71cbbc8f7a`.

Supporting guidance links point to the same historical Git revision; this prototype is not a self-contained release archive.
