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

Continue editing `docs/_standards/*.md`. `npm run prepare:docs` converts those authoritative files into ignored Docusaurus Markdown, retaining full body text and structured source metadata. Standard links stay in the selected collection. Supporting guidance links resolve to repository source because this experiment does not migrate all existing Liquid-driven pages. Unhandled Liquid or missing supporting targets fail generation.

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
3. Migrate the remaining Jekyll pages (packs, lifecycle, fitness, feeds, examples, governance), preserve all public URLs/catalog endpoints and resolve profile inheritance from each approved snapshot. Local YAML shown on standard pages is not a resolved conformance catalog.
4. Define deliberate release preparation, review and tagging with baseline confirmation, repository protections and recoverable publication. Do not use Docusaurus's snapshot command as ratification.
5. Complete accessibility testing, full-text search selection, and visual review across the remaining page types before switching production hosting.

## Validation

`npm test` covers exact historical member versions/check IDs, source hashes, same-version content changes, historical link scope, overwrite refusal and preservation of historical Markdown during current generation. The production build fails on broken internal links, anchors and Markdown links. Historical supporting links use the pinned Git revision; no snapshot claims to be offline/self-contained. The Node version and dependency lockfile make the preview reproducible.
