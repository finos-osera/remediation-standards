# Docusaurus exploration for issue #83

This is an independent alternative UI prototype to PR #84, based on main. It explores whether FDC3-style collection versioning can retain OSERA's branded catalog and named specifications. It is not a complete implementation of #83 or a production migration.

## Try it

Use Node 22 or later:

```sh
cd website
npm ci
npm test
npm run start
# Or: npm run build && npm run serve
```

The PR's Netlify deploy-preview context builds this site. Production Netlify configuration and GitHub Pages continue to build Jekyll. Before merging a prototype as permanent tooling, decide whether to retain the preview override: it affects all subsequent PR previews if merged.

Review these paths:

- `/`: OSERA branding, searchable/filterable working catalog and collection cards.
- `/standards/rel-001-test-provenance/`: draft standard 0.2.0; history links to historical 0.1.0.
- `/standards/0.1.0/rel-001-test-provenance/`: original proposed baseline text and complete source metadata/checks.
- On either standard, use the navbar version selector to change collection without losing the document.
- `/standards/rel-004-approved-producers/#version-history`: content changes detected independently of the displayed standard version.
- `/standards/0.1.0/overview/`: exact included vs observe-only roles.
- `/versions/`: recorded decisions, source comparison, archive confirmation and release-note publication status.

## Model and authoring

Docusaurus versions the **whole standards collection**, not each specification separately. `0.2.0 · Draft` is the proposed next collection; it includes standards whose individual versions are still 0.1.0 or 0.0.1. Stable IDs such as REL-003-JAVA remain unchanged. There is no need to rename standards to FDC3's document taxonomy or introduce a SPEC-CCC-YYYY naming convention.

Continue editing `docs/_standards/*.md`. `npm run prepare:docs` converts those authoritative files into ignored Docusaurus Markdown, retaining full body text and structured source metadata. Standard links stay in the selected collection. Current supporting links resolve to the migrated guidance and downloads. Historical links retain the pinned repository revision. Shared pages are generated from their original `docs/` Markdown, with explicit rendering for the data-driven pack page. Unhandled Liquid or missing supporting targets fail generation.

The initial historical snapshot is committed under `versioned_docs/version-0.1.0/`, with a matching sidebar. `baseline.json` records original source bytes, hashes, metadata and pack membership from exact commit `51e0afebeb789c266efe3a6802fa59fbb3d8e999` (ratification PR #51). Routine builds only generate current pages. The initial `--snapshot` bootstrap refuses to overwrite an existing baseline and is not a production release preparation command.

Docusaurus document IDs match between versions, enabling same-document switching. Existing `/standards/<slug>/` working URLs are preserved; historical reading URLs use `/standards/0.1.0/<slug>/`. These are deliberately not the authoritative `/releases/OSERA-SP-0.1.0/` namespace required by #83.

## Provenance and release notes

The September 10, 2026 ratification is recorded, but the historical baseline is unconfirmed, as in PR #84. The selector's `Ratified*` label refers to the recorded pack decision, not confirmation of these archived bytes. Observe-mode documents remain unratified. Current pages do not inherit approval from a predecessor date or a stale source status label.

No GitHub Releases were returned by `gh release list` during this exploration (October 8, 2026). This PR creates no release or tag. It proposes the issue's pack tag `OSERA-SP-0.1.0`, rather than FDC3's `v2.2` naming. A future GitHub Release should contain highlights, exact pack membership, ratification decision, canonical archive permalink, approved-source provenance and verified bundle/checksum assets. For 0.1.0 this requires baseline confirmation first; link the version register to the actual Release once it exists.

## Feasibility and alternatives

| Approach | Fit for OSERA | Tradeoff |
| --- | --- | --- |
| FDC3 / Docusaurus | Built-in collection selector, matching document navigation, sidebars, custom React landing pages and CSS. Existing Markdown can remain the source. | Adds Node/React dependencies and a conversion layer for Jekyll metadata/Liquid. Versioned Markdown is editable and old HTML is rebuilt. |
| Current Jekyll plus PR #84 | Retains current site authoring and implements OSERA-specific preservation/publication and history. | Collection navigation and reader UI must be maintained by the project. |
| Antora | Component and page version selectors, with distinct machine and display versions. Potentially attractive if independently released specification families become the primary unit. | Adopting its component/AsciiDoc structure would be a larger authoring migration for this Markdown repository; pack-wide membership still needs OSERA logic. |
| Kubernetes / Hugo | Another established Markdown static-site approach with release-oriented content branches. | Would still require OSERA-specific collection/pack/history integration; this experiment provides no compelling reason to migrate to Hugo instead. |

Recommendation: Docusaurus is feasible as the reading and discovery layer, paired with the archive/publication machinery from #84. It does not replace those guarantees. Keep a single immutable release manifest as the eventual source of history and status rather than maintaining separate registries in the UI.

Sources reviewed:

- [FDC3 standard](https://fdc3.finos.org/docs/fdc3-standard) and [2.2 introduction](https://fdc3.finos.org/docs/2.2/fdc3-intro).
- [FDC3 site configuration](https://github.com/finos/FDC3/blob/main/website/docusaurus.config.js), [version list](https://github.com/finos/FDC3/blob/main/website/versions.json), and [2.2 GitHub Release](https://github.com/finos/FDC3/releases/tag/v2.2). The prototype follows its classic preset, versioned directories, navbar docsVersionDropdown, all-versions page and custom-theme pattern; it does not copy FDC3 specification content.
- [Docusaurus versioning](https://docusaurus.io/docs/versioning).
- [Antora component versions](https://docs.antora.org/antora/latest/component-name-and-version/) and [version ordering](https://docs.antora.org/antora/latest/how-component-versions-are-sorted/).
- [Kubernetes documentation contribution model](https://kubernetes.io/docs/contribute/new-content/).

## What remains before adoption

1. Integrate #84's approved manifests and archive records. Replace this prototype's single-baseline history and two-collection release register with manifest-derived multi-release history, including removed/renamed standards and multiple pack inclusions.
2. Serve frozen HTML/bundles/catalogs byte-for-byte outside the Docusaurus renderer. Versioned Markdown alone is not immutable publication, and normal builds can change historical HTML when themes or dependencies change.
3. Complete the production URL/content parity audit, including old heading anchors and profile presentation. Shared guides and raw catalog/schema downloads are now migrated, and current profiles display their generated parent relationships. Resolve historical profile inheritance and supporting dependencies from each approved snapshot before claiming release completeness.
4. Define deliberate release preparation, review and tagging with baseline confirmation, repository protections and recoverable publication. Do not use Docusaurus's snapshot command as ratification.
5. Complete accessibility testing, full-text search accessibility, and visual review across the remaining page types before switching production hosting.

## Validation

`npm test` covers exact historical member versions/check IDs, source hashes, same-version content changes, historical link scope, overwrite refusal and preservation of historical Markdown during current generation. The production build fails on broken internal links, anchors and Markdown links. Historical supporting links use the pinned Git revision; no snapshot claims to be offline/self-contained. The Node version and dependency lockfile make the preview reproducible.

## Catalog filtering

The category, collection and status menus use native disclosures with one labeled radio choice per row. Search and all three filters intersect; reset returns to the working collection. Cards show their standard version, collection and effective status.

Selecting the historical 0.1.0 collection uses historical titles, versions and links, including standards no longer present in the working tree. Its status filter distinguishes recorded-ratified members from observe-only material. Working copies with source status `Ratified` but changed source bytes are labeled `Changed since ratification`; they cannot appear as recorded-ratified current definitions. A draft remains a draft even when it has a ratified predecessor. New standards are discovered from the source directory automatically.

## Proposed contribution-to-release process

This is an adoption proposal for review under the existing [standard lifecycle](../docs/lifecycle/index.md) and [governance](../GOVERNANCE.md), not a new ratification policy introduced by this prototype.

1. **Propose:** open an issue identifying the requirement area, rationale, affected standards, evidence/check changes, and intended pack. Keep the same stable standard ID for a revision; use a new ID for an independent requirement area.
2. **Author through a PR:** edit the authoritative working Markdown and structured front matter, bump the standard version when its text changes, declare its review status and proposed pack, and explain compatibility and predecessor relationships. A source status/date inherited from a predecessor is not approval of the new content. Do not edit historical snapshots or ratified pack membership to make current validation pass.
3. **Validate and review:** require catalog/schema/profile checks and the site build before merging. Add a base-branch comparison that rejects ID reuse, unexplained removal/renaming and content changes without the required version/status transition. Generate the catalog and navigation from sources so adding a standard requires no second hand-maintained inventory. Content that disappears from the current collection must retain historical routes and a supersession/withdrawal record.
4. **Prepare a candidate separately:** resolve the exact pack manifest against an exact source commit, including parent profiles, effective checks, catalogs, schemas, registries and supporting assets. Produce a self-contained candidate bundle and digest for review. A merged specification PR and a green website build do not ratify a release.
5. **Approve exact content:** obtain the working group's decision under existing governance and bind the decision to the candidate source/payload digest. Resolve the original 0.1.0 baseline before its first official publication. A decision for one candidate must not silently approve subsequent edits.
6. **Publish once:** use #84's verified publication path for append-only artifacts, annotated pack tags, release notes, checksums and protected GitHub Releases. Derive site history and selectors from the resulting manifests. Existing released bytes and URLs must survive site/theme changes.
7. **Evolve and verify:** use a new version for corrections or revisions; record errata separately. Rehearse adding a standard, revising one without a version bump, renaming/removing one, and publishing a second pack that carries older standards forward. Verify old URLs and artifact hashes before and after, and periodically test recovery from an independently retained release bundle.

**Implemented here:** automatic discovery of current standards; historical source files independent of current generation; source-based change detection; collection-aware catalog links; four intersecting filters; tests for adding/removing/renaming current catalog entries without losing historical entries; existing catalog validation and strict site-link validation.

**Still required before production adoption:** integrate #84's archive layer; multi-release manifest-derived history including removed standards; enforce source version/status transitions and append-only archive comparisons in required CI against a trusted base; configure protected branches/release environments/tags and immutable releases; complete the legacy URL/anchor and content parity audit; validate resolved profile/schema dependencies, offline bundles and recovery. Tests in this PR do not establish repository-wide immutability or protection against administrators deleting history.

[Kris West's comment on #84](https://github.com/finos-osera/remediation-standards/pull/84#issuecomment-6063955038) highlights the same boundary: FDC3 adds explicit schema/conformance asset copying and reference rewriting alongside Docusaurus's documentation snapshots. Review this prototype with him before choosing the production architecture; keep #83 open until the release guarantees are implemented and exercised.

## Global full-text search

The header search uses `@easyops-cn/docusaurus-search-local` to build and serve its index with the site; no hosted search account or API key is needed. It indexes standard titles, headings, body text and structured requirements/checks, plus the site's ordinary pages. Cmd/Ctrl+K focuses search; suggestions link to matching sections and “See all results” opens `/search/`.

Search from a standard page uses that document's collection. The full results page has an explicit collection selector that preserves the query while switching between working and historical definitions. Migrated shared guidance pages are indexed; material outside the published site is not indexed. Search indexes are generated by the production build (`npm run build` then `npm run serve` for local testing), with content-hashed filenames to avoid stale cached indexes after publication. New generated standards enter the index on the next build.


## Replacement readiness (current audit)

The exploration banner is cosmetic. Removing it does not switch production or satisfy release publication requirements.

| Area | Current state | Remaining work |
| --- | --- | --- |
| Footer | Current site's white OSERA logo, description and community links restored | Visual review |
| Lifecycle, fitness, governance, definitions | Generated from the existing Markdown at original URLs | Editorial review of existing text against current decisions |
| Examples and subpages | Preserved at original URLs with images/assets | Review legacy examples for accuracy, not just link validity |
| Packs | Original source template rendered; 0.1.0 membership links to historical definitions | Replace the single-baseline adapter with multi-release manifests before adding another pack |
| Catalog and schemas | Existing JSON/YAML endpoints and per-standard downloads copied byte-for-byte; catalog landing page added | These remain mutable working endpoints; immutable release catalogs still require #84 |
| Feeds | `/feeds/` retained as documentation, with a clear availability note | Hidden from navigation until a usable service exists; no feed endpoints invented |
| Profiles | Current parent/override relationship tables generated from existing catalog metadata | Confirm historical effective dependencies as part of immutable archives |
| Search | All shared pages plus version-specific standard content indexed | Broader accessibility/keyboard review before launch |
| Deployment | Production still runs Jekyll; this PR only changes previews | Deliberate switch of Pages/Netlify build, custom-domain checks, rollout and rollback |
| Immutable release identity | Historical baseline candidate and working collection demonstrated | Confirm 0.1.0, integrate #84's freeze/publish path, protect releases and test a second pack |

A reader-site launch and an official immutable pack publication are separate decisions. The unconfirmed historical snapshot must retain its honest labeling if the reader is launched first. Complete content/URL parity review and approve a deployment switch before replacing production; do not claim #83 is complete until archive guarantees are implemented.

### Keeping shared content current

`docs/` remains the authoring source. `generate-pages.mjs` discovers every non-standard Markdown page except the deliberately redesigned homepage, requires a unique permalink, and writes ignored Docusaurus page files. Unsupported Liquid fails the build. Static catalogs, schemas and assets are copied from the same source tree. New pack identities fail closed until their version-specific routing is defined.

`verify-site.mjs` checks source-page coverage, byte-identical downloads, historical pack links and footer presence. Search verification checks every guide. The Docusaurus PR workflow now watches all `docs/**` changes, not only standards. `AGENTS.md` gives future agents durable instructions to assess downstream guidance/examples/catalogs when editing a standard and to run the validators. This is repository guidance, not a scheduled maintenance job or a guarantee of semantic freshness: maintainers still review the meaning of changed guidance under governance.
