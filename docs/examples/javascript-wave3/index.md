---
title: Wave 3 JavaScript Profile Review and Gate Experiments
permalink: /examples/javascript-wave3/
---

This working review brief supports the October 22, 2026 [agenda #91](https://github.com/finos-osera/remediation-standards/issues/91) and [completion issue #98](https://github.com/finos-osera/remediation-standards/issues/98). Wave 3 may include non-Java libraries. The immediate objective is usable input for Francesco and team's first JS library gates, not ratification. New profiles are Pre-Drafts; existing naming work remains Draft. No pack membership changes here.

## Coverage and existing work

| Existing Java profile | JavaScript counterpart | Starting point |
| --- | --- | --- |
| REL-003-JAVA | [REL-003-JAVASCRIPT]({{ site.baseurl }}/standards/rel-003-javascript-patch-version-naming/) | Merged PR #76, retained naming/check semantics with review context in 0.1.1. |
| REL-005-JAVA | [REL-005-JAVASCRIPT]({{ site.baseurl }}/standards/rel-005-javascript-artifact-publication/) | New 0.0.1 Pre-Draft for tarballs, inventory, source mapping and registry binding. |
| REL-009-JAVA | [REL-009-JAVASCRIPT]({{ site.baseurl }}/standards/rel-009-javascript-coordinated-adoption/) | New 0.0.1 Pre-Draft for remediation sets and verified consumer adoption. |

These are all three current `-JAVA` profiles. Use the existing `-JAVASCRIPT` identifier, not a parallel `-JS` namespace. Other ecosystems require their own profiles; Java BOMs, shared counters and bytecode checks are not automatically requirements for npm packages.

[PR #76](https://github.com/finos-osera/remediation-standards/pull/76) records Jonathan Schneider's proposal based on Kris West's naming suggestion. [Kris's September 24 review](https://github.com/finos-osera/remediation-standards/pull/76#pullrequestreview-5307039593) supports explicit prerelease adoption, subsequent updates and the exact-pin option. This is relevant practitioner input, not evidence that all managers, registries and security tools have been validated. The standard reports npm 11.4, pnpm 9.15, Yarn Berry 4.18 and Classic 1.22 experiments; retain the original study revision, fixtures and logs through #98 before treating those results as reproducible gate coverage.

## Naming options and consequences

Examples use a baseline of `1.4.1`; they are not published artifacts.

| Option | Established behavior or proposed benefit | Consequence / evidence needed |
| --- | --- | --- |
| `1.4.1+osera-patch.001` | SemVer ignores build metadata in precedence. | No upgrade ordering over baseline. Registry normalization and exact install behavior require real registry tests; equal precedence alone does not prove byte identity. |
| `1.4.1-osera-00001` | Prerelease sorts below its baseline. | Broad ranges can prefer the unpatched stable version; explicit selection and registry tests needed. |
| `1.4.1.1-osera-00001` | Four core components are invalid SemVer. | Java syntax is not directly portable to npm versioning. |
| `1.4.2-osera-00001` | Existing draft: sorts between baseline and next upstream patch. | Requires explicit prerelease adoption, registry/name authority, and upstream headroom; does not prove a future upstream release fixes the vulnerability. |
| Producer-scoped package / alias | Separate publication identity may avoid upstream-name ownership constraints. | Diverges from current naming draft; test transitive and peer identity, import behavior, purls, feeds and tooling. No claim of drop-in compatibility. |
| Ordinary next-patch stable version | Would participate in ordinary stable ranges. | Risks collision or confusion with upstream identity; compare registry ownership and upstream-return behavior before considering it. |

[SemVer 2.0.0](https://semver.org/) defines precedence and syntax. [node-semver](https://github.com/npm/node-semver#prerelease-tags) documents range matching and prerelease exclusions. Neither guarantees that an installed release contains a security fix.

| Adoption selector | Benefit | Cost shown by local SemVer experiment |
| --- | --- | --- |
| Exact `1.4.2-osera-00001` | Selects a specific version; useful for a controlled pilot. | Does not advance to later backpatches or upstream fixes without an explicit update. |
| Tilde `~1.4.2-osera-00001` | Allows subsequent backpatches and stable upstream patches. | Also admits higher-sorting prereleases of 1.4.2, including upstream RCs and other producer tokens. Registry trust and lockfiles still matter. |
| Caret `^1.4.2-osera-00001` | Allows wider compatible-version selection. | Can select 1.5.0 in this example, leaving the supported minor line. Zero-major behavior needs separate fixtures. |

## Reproducible limited experiment

Run from the repository root, after installing website dependencies using its lockfile:

```sh
npm --prefix website ci
node tools/check_javascript_naming.cjs
```

The script imports the website's installed `semver` and prints its exact version and Node version, assertions, expected values and observations. On October 21, 2026, **14/14 assertions passed with Node v24.0.1 and semver 7.8.5**. Results cover precedence, validity, prerelease exclusion, exact/tilde/caret selection, competing prereleases, and padded counters. This is a parser/range experiment, not a reproduction of the #76 registry study or an npm/pnpm/Yarn install test. It does not validate publication, lockfiles, compatibility, signatures or vulnerability fixes.

## Evidence to obtain before deciding

| Experiment | Required observations | Status in this first PR |
| --- | --- | --- |
| Same-name overlay vs scoped/alias publication | Publish permission, registry routing, actual installed identity/digest, purl/feed matching, upstream collision handling. | Not run. |
| npm, pnpm, Yarn generations | Exact versions; fresh install, update and frozen install; manifests and locks before/after; exit codes and resolved graph. | Original study reported in #76; reproducible raw evidence still needed. |
| Direct/transitive/peer/optional and workspace/catalog adoption | Every in-scope occurrence remediated; supported peers/platforms; correct controlling entry changed; no stale vulnerable lock. | Not run. |
| Upstream return and competing prereleases/producers | Version and bytes selected, remediation evidence, producer trust, and lockfile refresh effects. | SemVer portion only; end-to-end not run. |
| Release age controls and update/SCA tooling | Exact policy/tool versions; delayed or rejected installs; prerelease filtering; findings and feed interpretation. | Not run; do not generalize reported defaults to other versions. |
| Edge baselines/counters | Zero-major and prerelease baselines, already-published next patch, exhausted five-digit counter, cumulative fixes and upstream-release races. | Open policy decisions and fixtures. |
| Tarball/evidence validation | Missing entry point, changed source, generated bundle, mismatched digest/signature, missing report, native download and alternate registry failures. | Proposed review cases only. |

For each run retain fixture/source revision, exact commands, runtime/tool versions, registry configuration and metadata snapshots, dates, consumer diffs, artifact digests, logs and limitations. Redact credentials. Report unsupported cases and failures explicitly. An unperformed test is `not-tested`, not a pass. Numerical ordering or a successful install is not vulnerability-remediation evidence.

## First gate handoff

Begin with an explicitly selected configuration and fixtures; agree the supported Node/npm/pnpm/Yarn/platform matrix with Francesco and team. Expand only as evidence arrives. Record the exact standards source commit, parent/profile versions and effective check IDs in an **experimental** run record; leave pack approval unclaimed. Do not invent a ratified pack identifier to satisfy a prototype schema.

| Area | Effective checks | Proposed responsibilities |
| --- | --- | --- |
| Naming | REL-003-JAVASCRIPT.CHECK-001–004 | Producer supplies baseline/version/feed evidence; fitness checks syntax and identity; exchange verifies registry headroom/dist-tags and actual release binding. Resolution experiments must supplement parser tests. |
| Publication | REL-005-JAVASCRIPT.CHECK-001, inherited REL-005.CHECK-002–004, added JS CHECK-005–006 | Producer records package/source inventory; fitness checks source/evidence relationships; exchange verifies actual bytes, uploader/signature, metadata, staged files and retained acceptance record. |
| Adoption | REL-009-JAVASCRIPT.CHECK-001–003, inherited REL-009.CHECK-006–007 | Producer maintains set and coordinated edits; consumer fixture runs record actual before/after graphs, clean/frozen install and validation limitations. |

These proposed blocking semantics must be reported separately from any ratified-pack verdict. Missing artifacts or unresolved checks cannot be presented as successful experimental acceptance. Operational enforcement requires a separate explicit decision; merging this text or passing the website build supplies no approval.

Existing test provenance, approved-producer, signature, license, fork and feed obligations need an applicability review for JS. In particular, REL-002's JVM bytecode check is not a JS runtime compatibility test; do not claim the whole 0.1.0 pack aligns merely because these profiles pass. No new test-report or recipient-guidance schema is introduced here. Set and experimental-result serialization remain open deliverables in #98 and the signed-result work in #57.

## Requested October 22 outcomes

Review the three-profile coverage, compare naming tradeoffs with the existing #76 feedback, identify the original study/evidence owners, and agree the first gate fixture/configuration and evidence fields with Francesco and team. Record owners and target dates for missing experiments, schema work and policy choices in #98. No ratification vote is requested; the tracking issue remains open after the initial drafting PR.
