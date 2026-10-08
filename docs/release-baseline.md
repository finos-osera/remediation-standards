---
title: OSERA-SP-0.1.0 historical baseline review
permalink: /release-baseline/
---

**This is an audit candidate, not confirmation of an official archive.** OSERA-SP-0.1.0 is recorded as ratified on September 10, 2026. The absence of an original release tag means the exact archival baseline needs explicit confirmation before publication.

## Proposed source

The candidate uses commit [`51e0afebeb789c266efe3a6802fa59fbb3d8e999`](https://github.com/finos-osera/remediation-standards/commit/51e0afebeb789c266efe3a6802fa59fbb3d8e999), the merge of [ratification PR #51](https://github.com/finos-osera/remediation-standards/pull/51). It includes the adopted Java CARE-style naming text and the initial producer-registry guidance. It contains 13 included ratified standards and seven observe-mode standards.

The [September 10 agenda #58](https://github.com/finos-osera/remediation-standards/issues/58) links to the meeting minutes, while its inline decision section still contains a placeholder. PR #51 describes the ratified publication and says the initial tag should be created after merge. The repository has no original pack tag to resolve that instruction. These records support proposing this commit, but do not substitute for explicit baseline confirmation.

[Browse the candidate snapshot]({{ site.baseurl }}/release-candidates/OSERA-SP-0.1.0/) · [Inspect its exact manifest]({{ site.baseurl }}/release-candidates/OSERA-SP-0.1.0/manifest.json).

## What the proposed baseline preserves

| Standards | Selected version | Treatment |
| --- | --- | --- |
| STD-001, FORK-001, FORK-002, FORK-003 | 0.1.0 | Included ratified definitions from PR #51 |
| SRC-002, SRC-003 | 0.1.0 | Included ratified definitions from PR #51 |
| REL-001, REL-002, REL-003, REL-003-JAVA | 0.1.0 | Included ratified definitions, including resolved Java naming |
| REL-004, REL-005, FEED-001 | 0.1.0 | Included ratified definitions from PR #51 |
| FORK-004, SRC-001, REL-006, REL-007, REL-008, EVD-001, APP-001 | 0.0.1 | Observe/deferred roles only; not ratified by archiving |
| Approved-producer registry | As committed in PR #51 | Empty initial registry; later producer additions excluded |
| Schemas, examples, lifecycle and fitness guidance | Same commit | Preserved with their original normative/informative context |

The snapshot validates all selected standard versions, their named checks and profile parents. Its manifest records each original standard file's SHA-256, and the bundle includes the complete source tree for review.

## Later changes deliberately excluded

- REL-001 moved to draft 0.2.0, adding provenance for releases without source changes and clarifying the test coverage floor.
- REL-004 acquired producer signing-key metadata after PR #51, without changing its displayed standard version. This is why working-page comparisons inspect source bytes as well as version numbers.
- The registry gained Moderne as an approved producer. The source lifecycle permits appropriate administrative pack updates; it does not authorize silently inserting those entries into an old snapshot.
- REL-009 and its Java profile, FEED-002, and the JavaScript naming profile were added for subsequent-pack review.

## Confirmation needed before stamping a release

Maintainers should confirm that the post-meeting PR #51 merge is the intended complete 0.1.0 publication, including the original registry and supporting definitions. If an additional change was explicitly approved for the original release, identify its decision and commit; prepare an explained reconstruction commit and a fresh candidate. Do not combine today's files with historical version labels.

Record the baseline approval against the exact payload digest, then follow the [publishing playbook]({{ site.baseurl }}/release-playbook/). Archive preparation/publication dates must remain separate from the original ratification date. This PR creates no official tag or GitHub Release.
