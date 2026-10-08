---
title: Publishing a ratified standards pack
permalink: /release-playbook/
---

Prepare once, review the resulting files, and publish those same files. The working site continues to evolve; a published archive does not.

## Release structure

`release-candidates/OSERA-SP-x.y.z/` holds a prepared snapshot for review. It is generated from an exact committed source revision, not maintained as another draft source tree. Working standards remain in `docs/_standards/`.

After approval, the identical payload is copied to `releases/OSERA-SP-x.y.z/`. The site build copies these already-rendered files into `/releases/OSERA-SP-x.y.z/` without passing them through Jekyll again. Historical templates, styles, standards, and supporting material therefore cannot drift with the live site.

Every snapshot contains:

- `index.html`, standards pages, supporting pages, styles and assets, with portable internal links.
- `manifest.json`: source revision, original ratification date, preparation date, provenance, standard versions, effective profile checks, source hashes and toolchain identity.
- `resolved.json`: complete parsed source definitions and profile resolution for validation.
- `catalog/`: release-local JSON/YAML definitions; `source/docs/`: original source, registries and schemas; `source/render-input/`: the documentation actually rendered; `generator/`: generator source and dependency lockfile.
- `SHA256SUMS`: SHA-256 for every payload file except itself, the ZIP and its checksum file.
- `OSERA-SP-x.y.z.zip`: those payload files plus `SHA256SUMS`, with deterministic entry order, timestamps and permissions.
- `OSERA-SP-x.y.z.zip.sha256`: the ZIP's separate SHA-256.

Membership roles remain explicit. Archiving an observe-mode standard does not ratify it. Archiving a supporting example does not make it a blocking check. Each profile's parent must be explicitly pinned in the pack.

## One-time repository setup

A repository administrator must complete this before official publication:

1. Enable **immutable releases** in repository settings. The publisher verifies the setting through the API and stops if it cannot verify it. A 404 can mean insufficient access or that the setting is disabled; it is not treated as success.
2. Import `tools/releases/tag-ruleset.json` as an active tag ruleset. It prevents updates and deletions of `OSERA-SP-*` tags with no bypass actors. Tag creation remains possible.
3. Protect `main`, require review of release changes and the **Release archive validation / validate** check, and require review for changes to the validator/workflows themselves. Do not grant ordinary contributors bypass rights.
4. Configure the `standards-release` environment with required maintainer reviewers and restrict it to `main`.
5. Store `STANDARDS_RELEASE_TOKEN` in that environment. Use a narrowly scoped GitHub App or token with **Contents: write** and **Administration: read**, so it can verify immutability and create releases. The ordinary Actions token cannot necessarily read the repository's immutability setting.

An administrator can enable the setting with `gh api --method PUT repos/finos-osera/remediation-standards/immutable-releases` and create the tag ruleset with `gh api --method POST repos/finos-osera/remediation-standards/rulesets --input tools/releases/tag-ruleset.json`. Inspect existing rulesets before creating one; do not duplicate a matching rule.

For this implementation, the available account has maintain/push access but no administrator access; the ruleset listing was empty and immutable-release status could not be confirmed. These are deployment prerequisites, not protections this PR claims to have installed. Repository administrators remain a trust boundary: no in-repository script can prevent an administrator from disabling controls or deleting the repository.

[GitHub immutable-release documentation](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/prevent-release-changes) · [Tag rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

## 1. Prepare the exact candidate

Install Python 3.12+ and Ruby 3.3, then run `bundle install` in `docs/`. Use a complete checkout containing the selected source commit. From the repository root:

```sh
python3 tools/releases/release.py prepare \
  --pack OSERA-SP-0.1.0 \
  --source 51e0afebeb789c266efe3a6802fa59fbb3d8e999 \
  --decision https://github.com/finos-osera/remediation-standards/issues/58 \
  --date 2026-10-04 \
  --provenance "Proposed historical baseline from PR #51; confirmation pending."
```

This is the historical candidate example, not confirmation that the source is approved. For a new pack, use its own identity, exact committed membership and standard text, date, and decision record. Preparation validates exact versions and checks. It refuses to reuse an output directory. To revise an unpublished candidate, prepare into a new directory with `--output`, review the diff and replace the candidate through a PR. Never use this procedure to replace a published release.

The complete source documentation tree is retained to keep local references self-contained. The pack manifest selects the normative membership. If preparation finds a dangling local reference or missing version, fix the source and prepare from a new commit rather than making a silent archive-only correction. Explicit historical reconstruction, if needed, must be committed and explained in provenance before preparation.

## 2. Preview and review

```sh
python3 tools/releases/release.py validate release-candidates/OSERA-SP-0.1.0
python3 tools/build_site.py
```

Open a PR; Netlify runs the same build. Netlify may inject its collaboration toolbar into preview HTML; the downloadable ZIP and manifest are the byte-verifiable review artifacts. The canonical GitHub Pages deployment serves the stored snapshot output. Review `/releases/`, the working standard's version history, the candidate under `/release-candidates/OSERA-SP-0.1.0/`, the ZIP, manifest and checksums. Extract the ZIP and open `index.html` locally.

Reviewers must confirm the exact source, pack roles and effective checks, supporting schemas/registry, original ratification decision, and the SHA-256 of `SHA256SUMS` printed by preparation. Original ratification and approval of a reconstructed archive are separate facts. If any payload changes, its digest changes and approval must be renewed. Do not rebuild after approval.

## 3. Record approval and promote without rebuilding

After the appropriate working-group/maintainer decision, create an approval JSON file outside the candidate payload:

```json
{
  "pack": "OSERA-SP-0.1.0",
  "source_commit": "FULL_APPROVED_SOURCE_COMMIT",
  "payload_sha256": "SHA256_OF_SHA256SUMS",
  "baseline_confirmed": true,
  "approved_by": ["ACTUAL_APPROVING_MAINTAINER"],
  "approval_url": "URL_OF_RECORDED_APPROVAL"
}
```

These placeholders are not an approval. The workflow environment's reviewers enforce human authorization; the script checks that the record identifies the exact approved content.

```sh
python3 tools/releases/release.py promote \
  --candidate release-candidates/OSERA-SP-0.1.0 \
  --approval /path/to/actual-approval.json
```

Commit the resulting `releases/OSERA-SP-0.1.0/` and `release-approvals/OSERA-SP-0.1.0.json` through a reviewed PR. The candidate may remain available at its old preview URL; the index prefers the promoted release. Promotion copies the payload unchanged. This step establishes the confirmed site archive; GitHub Release publication is the next deliberate step. Until it completes, its tag/download links on GitHub may not yet resolve.

## 4. Stamp the repository and publish

After merging the promotion PR, run **Publish standards release** from `main`, supplying the pack ID and full merged publication commit. The workflow checks that the publication commit is on `main`, verifies the approval and repository controls, then:

1. Creates an annotated `OSERA-SP-x.y.z` tag pointing to that publication commit.
2. Creates a draft GitHub Release, uploads the ZIP, ZIP checksum, file checksums and manifest, and compares uploaded bytes with the approved files.
3. Publishes the GitHub Release and verifies GitHub reports it as immutable.

The publication commit differs from the source commit recorded inside the archive. This avoids a circular dependency between a commit hash and the files contained in that commit.

For a local preflight in a clean checkout of the publication commit:

```sh
python3 tools/releases/publish.py --pack OSERA-SP-0.1.0 --commit FULL_PUBLICATION_COMMIT
```

The command is read-only unless `--publish` is supplied. Publication never runs a renderer or catalog generator. The tagged commit also retains the historical source in `source/docs/`; consumers must use that release-local registry, not today's root `docs/_data/approved_producers.yml`.

## 5. Verify deployment and recover interruptions

The promotion merge triggers the normal Pages deployment. If needed, rerun **Deploy GitHub Pages** for the publication commit; it copies the same archive bytes. Confirm the canonical landing page, a standard, manifest and ZIP are reachable. Download the ZIP and compare its SHA-256 with the published checksum. Confirm working-page links point to the latest official version and the timeline retains earlier versions.

- **Tag exists, no GitHub Release:** rerun publication for the same commit. The publisher verifies the annotated tag target before proceeding.
- **Draft release partially uploaded:** rerun; matching assets are retained, missing ones are uploaded, conflicting assets cause failure. It never uses `--clobber`.
- **Release already published:** rerun verifies the tag, immutability and every asset, then exits without mutations.
- **Website deployment failed:** rerun the site deployment; do not regenerate the archive or retag.
- **Tag or published asset differs:** stop and investigate. Do not force-push, replace or delete it. A corrected official payload needs a new pack identity.

CI compares every existing `releases/` and `release-approvals/` file with the trusted base commit, so editing both a payload and its colocated checksum cannot bypass the immutability check. Protected branches and required review of the workflow itself are essential to enforcing this policy.

## Subsequent versions and errata

Keep preparing working drafts from `docs/_standards/`; no manually edited per-version drafts tree is needed. A candidate snapshot previews the exact publication shape. Once a later pack is approved and promoted, the index selects the highest published pack version and each standard's timeline retains every ratified inclusion, with its decision date and link.

Never edit an earlier archive to add a “newer version” link. Its static banner points to the central release register, which remains current. Record errata separately in the working site and link to the affected release. Administrative updates may use a patch pack version only when allowed by the lifecycle; changed standard text or semantics require the appropriate new standard and pack versions.
