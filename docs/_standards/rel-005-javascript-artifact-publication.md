---
schema-version: 0.1.0
sequence: 252
standard_id: REL-005-JAVASCRIPT
title: JavaScript Package Publication
summary: npm publications preserve upstream package contents and bind tarballs, metadata and source evidence to the exact patched release.
extends: REL-005
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: Not assigned; Wave 3 exploration
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Experimental JavaScript profile; not an approved gate
type: REL
category: Release Process
applies-to:
- npm ecosystem package patch providers
- JavaScript and TypeScript library recipients
- npm registry and exchange operators
requirements:
- id: REL-005-JAVASCRIPT.REQ-001
  override-explanation: Specializes the parent upstream inventory and checksum obligation for npm tarballs, their contents and separately published companion files; no required upstream role is waived.
  level: MUST
  text: Producers must retain the exact upstream package inventory and publish a patched tarball preserving its required file roles and entry points, plus counterparts of separately published upstream companion files and required checksums.
  checkability: partially-automated
  checks:
  - id: REL-005-JAVASCRIPT.CHECK-001
    override-explanation: Examines the npm tarball contents and companion-file inventory while retaining the parent completeness and checksum obligations.
    title: npm publication preserves required upstream file roles and entry points
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_javascript.publication_inventory
    evidence:
    - upstream_release_inventory
    - required_release_inventory
    - tarball_entries
    - entry_point_resolution
    - companion_files
    - checksums
- id: REL-005-JAVASCRIPT.REQ-005
  level: MUST
  text: Published source files must match the patched tag through an explicit path mapping; generated or transformed files must be individually identified with their generating inputs and command, and required source inputs must not be silently omitted.
  checkability: partially-automated
  checks:
  - id: REL-005-JAVASCRIPT.CHECK-005
    title: Packaged sources match the patched tag and generated files have declared origins
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_javascript.source_mapping
    evidence:
    - patched_tag_commit
    - source_entry_mapping
    - source_comparison_results
    - generated_file_inventory
    - packaging_inputs
- id: REL-005-JAVASCRIPT.REQ-006
  level: MUST
  text: The registry version metadata must identify the same package name and patched version as the tarball package.json, and its tarball reference and advertised integrity must identify the exact bytes evaluated and promoted.
  checkability: automated
  checks:
  - id: REL-005-JAVASCRIPT.CHECK-006
    title: Registry metadata resolves to the evaluated package identity and tarball bytes
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_javascript.registry_binding
    evidence:
    - registry_version_metadata
    - tarball_package_json
    - downloaded_tarball_digest
    - advertised_integrity
    - promoted_tarball_sha256
---

## Scope and status

This initial **Pre-Draft** extends [REL-005]({{ site.baseurl }}/standards/rel-005-artifact-publication-hygiene/) for npm ecosystem packages, including TypeScript compiled to JavaScript. It is input for Francesco and team's experimental Wave 3 gates, tracked in [#98](https://github.com/finos-osera/remediation-standards/issues/98), not ratified policy. Proposed blocking severities describe eventual acceptance semantics; they do not activate production enforcement or add these checks to OSERA-SP-0.1.0. Implementation names are proposed contracts, not implemented validators.

REQ-001/CHECK-001 override the parent's inventory rule. Parent requirements/checks 002–004 remain inherited: patched identity, uploader/signature/digest binding and staging, and immutable acceptance records. Requirements/checks 005–006 add source mapping and registry binding. This profile uses the parent working version 0.2.1; a future pack must freeze the exact parent and profile versions together.

## Publication inventory

Retain the baseline registry metadata and downloaded baseline tarball by digest. Compare unpacked file roles, not compressed archive bytes: a patched tarball will normally differ. Inventory the package manifest, runtime modules, bundled dependencies, type declarations, source maps, license files, documented assets, and platform/native companions where upstream ships them. Account for scoped names and monorepo subdirectories explicitly.

Preserve every upstream role and public entry point, allowing patched contents and version substitutions. Verify declared `main`, `module` where used, `exports` conditions and patterns, `types`/`typings`, and `bin` targets against packaged files and the declared supported runtime/tooling matrix. Record applicable conditions; an absent field is not an error when upstream has none. Do not manufacture sources, declarations, maps or separate archives absent upstream. Additional recognized files receive the same applicable checks; unknown uploads remain staged under the parent rule.

Check the actual published tarball, not just the repository or a dry-run packing list. Reject ambiguous duplicate paths, extraction paths escaping the package root, and unsafe link targets before examining contents. Install scripts and native downloads require declared origins and a controlled test environment; their behavior is not established by a file listing.

## Source and metadata binding

Compare each mapped tracked source file byte-for-byte with the resolved patched tag. A mismatch cannot be relabeled as generated. For compiled JS, bundles, declarations and maps without an identical tracked counterpart, retain per-file digests, source input references and generating commands. Identify missing required packaging inputs. This disclosure is not proof of reproducible builds or source-to-binary provenance; [REL-007]({{ site.baseurl }}/standards/rel-007-build-provenance-and-signed-attestation/) remains separate.

CHECK-006 verifies the registry's tarball reference and every advertised integrity value against downloaded bytes, and compares the retained SHA-256 with the promoted bytes. An unresolved reference, identity mismatch or digest mismatch fails. Registry integrity is not a producer signature or approval: inherited CHECK-003 still requires the verified producer/account binding and signature contract being developed in [#57](https://github.com/finos-osera/remediation-standards/issues/57). Mutable dist-tags are discovery pointers, not immutable release identity.

Use [REL-003-JAVASCRIPT]({{ site.baseurl }}/standards/rel-003-javascript-patch-version-naming/) for the proposed naming form; record the chosen experimental revision explicitly. Test-report evidence remains governed by [REL-001]({{ site.baseurl }}/standards/rel-001-test-provenance/), including its digest binding where that draft is evaluated. Existing JVM sidecar examples remain JVM examples, not npm archive requirements.

## Review cases and open questions

| Case | Proposed result |
| --- | --- |
| Required exported module or upstream declaration missing from tarball | Fail CHECK-001. |
| Tracked source differs from the patched tag | Fail CHECK-005. |
| Generated bundle has listed inputs and command | Mapping may pass; no claim of reproducibility or build provenance. |
| Registry tarball is replaced after evaluation | Fail CHECK-006; do not promote different bytes. |
| Registry integrity passes but producer signature is absent | Inherited CHECK-003 remains unresolved; integrity alone cannot pass the publication set. |
| Upstream has no separate source archive | Do not require a synthetic archive; retain packaging/source mapping evidence. |

Resolve exact entry-point test coverage (ESM/CommonJS/browser conditions), native/optional artifact coverage, generated-source evidence shape, and npm registry signature versus OSERA producer-signature integration before production use. The [Wave 3 review matrix]({{ site.baseurl }}/examples/javascript-wave3/) records evidence still needed.

The [npm package manifest documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) describes npm packaging fields. The stricter inventory, source mapping and acceptance rules above are OSERA proposals, not claims that npm enforces them.
