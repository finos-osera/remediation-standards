---
schema-version: 0.1.0
sequence: 250
standard_id: REL-005
title: Artifact Publication Hygiene
summary: Published OSERA releases preserve the ecosystem's expected package files and
  bind each promoted file to the patched release with retained acceptance evidence.
extended-by:
- REL-005-JAVA
doc-status: Draft
standard-version: 0.2.0
candidate-pack: OSERA-SP-0.2.0 required
ratified-in: OSERA-SP-0.1.0
ratified-date: '2026-09-10'
fitness-role: Required check
type: REL
category: Release Process
applies-to:
- Patch providers
- Repository operators
- Enterprise recipients
requirements:
- id: REL-005.REQ-001
  level: MUST
  text: Official OSERA releases must publish the package files and checksums required
    by the applicable ecosystem profile, including counterparts of the upstream
    baseline release's package files.
  checkability: automated
  checks:
  - id: REL-005.CHECK-001
    title: Required release inventory and checksums are present
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005.package_checksum_hygiene
    evidence:
    - upstream_release_inventory
    - required_release_inventory
    - artifact_files
    - checksums
- id: REL-005.REQ-002
  level: MUST
  text: Published package metadata must identify the patched version consistently
    with REL-003.
  checkability: automated
  checks:
  - id: REL-005.CHECK-002
    title: Package metadata uses the approved patched version
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005.package_metadata_version
    evidence:
    - package_metadata
    - artifact_version
    - release_tag
- id: REL-005.REQ-003
  level: MUST
  text: Each promoted release file must be bound to the patched release by its
    identity, SHA-256 digest, upload account and verified producer signature, and
    satisfy the applicable profile's content checks; unrecognized uploads remain
    in staging and are reported.
  checkability: automated
  checks:
  - id: REL-005.CHECK-003
    title: Promoted files are bound to the release and unrecognized uploads are staged
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005.release_file_binding
    evidence:
    - release_file_inventory
    - observed_upload_accounts
    - signature_verification
    - profile_check_results
    - staged_files
- id: REL-005.REQ-004
  level: MUST
  text: The publication gate must retain an immutable acceptance record for each
    released binary or metadata-only package, identifying its exact artifacts,
    standards pack, standard versions, effective checks, results and evidence.
  checkability: automated
  checks:
  - id: REL-005.CHECK-004
    title: Acceptance record preserves the exact release and evaluation rules
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel005.acceptance_record
    evidence:
    - artifact_digests
    - standard_pack
    - pack_checksum
    - standard_versions
    - effective_check_results
    - retained_evidence
---

## Requirement

Official OSERA releases MUST publish the expected package files and checksums for their package-manager and build-tool ecosystem. A companion artifact (or sidecar) is a separately published file accompanying a package, such as source, documentation, metadata or a test report.

This generic standard defines the publication obligations. Ecosystem profiles define concrete file kinds and content checks; [REL-005-JAVA]({{ site.baseurl }}/standards/rel-005-java-artifact-publication/) specializes them for Maven/Gradle/JVM publications, regardless of implementation language. Unoverridden parent requirements and checks continue to apply under the [profile lifecycle]({{ site.baseurl }}/lifecycle/#profile-extension-and-overrides).

### Required release inventory

The producer MUST identify the exact upstream baseline package version and repository location, and record its published file inventory. The gate MUST derive the required patched inventory from that inventory and the applicable versioned profile. Every upstream package file MUST have a counterpart for the patched version with the same role, classifier or variant, except for exclusions explicitly defined by that profile. Upstream signatures and checksums are replaced by those for the patched bytes; copying them is not preservation. Repository-wide indexes and mutable download statistics are not package release files.

Profiles MAY require additional files even when upstream did not publish them. A producer declaration alone MUST NOT waive a required file. If the upstream inventory cannot be established, the check is unresolved and MUST NOT pass. The acceptance record MUST retain the observed inventory so subsequent repository changes cannot change what was evaluated.

Package metadata MUST identify the patched version consistently with [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) and its applicable naming profile.

### Per-file binding and promotion

For each content file to be promoted, the gate MUST record its package/release identity, filename, byte size and SHA-256 digest calculated from the actual uploaded bytes. It MUST verify that the file was uploaded by the same account as the primary package file, and verify its producer signature using the producer identity accepted for that release. A shared upload account or a filename alone is insufficient. Signature and checksum companion files are verified against their target content file; this does not require recursively signing signatures or checksums. The gate MUST ensure that the bytes promoted are the bytes checked.

Every file MUST also pass its applicable profile checks. A missing required file, a digest or signature mismatch, a mismatched uploader, or a failed required content check blocks promotion of the release's required file set, including the primary package. Unexpected uploads MUST remain in staging and be listed with a reason in the verdict; their presence alone need not block an otherwise valid required set. An unexpected file cannot become publishable just because a producer lists it: the applicable profile must recognize its role and checks.

Test-report binding follows [REL-001]({{ site.baseurl }}/standards/rel-001-test-provenance/#test-report-digest-binding). A legitimately inherited report may remain at its tested release; it is verified there and need not be uploaded again with the consuming release. Re-uploaded copies MUST have identical bytes and meet this release's upload and signature rules.

### Retained acceptance record

For every released binary, or the primary metadata of a metadata-only package, the gate MUST retain an immutable record containing:

* the package coordinate, source repository, release tag and resolved source commit;
* filenames, sizes and SHA-256 digests of the promoted set, plus upstream inventory and staged-file disposition;
* exact standards-pack identifier/version and checksum, the retained pack definition, and every evaluated standard/profile identifier and version;
* the effective inherited, overridden and added check IDs, severities, results and supporting evidence;
* the producer, observed upload accounts, signature verification results, and the fitness result and release evidence inspected, retained by content digest.

References MUST resolve to retained immutable evidence or accompany retained copies; a mutable URL alone is insufficient. The record MUST remain available for as long as the release is distributed. The gate MUST finalize and persist the record as part of promotion; it cannot claim CHECK-004 passed merely because it intends to retain a record later. A later evaluation creates a new record without overwriting the original decision.

## Versioning and transition

These additions are proposed for OSERA-SP-0.2.0 in [#78](https://github.com/finos-osera/remediation-standards/issues/78). They become required only when a ratified pack includes these exact standard versions and checks. OSERA-SP-0.1.0 remains pinned to REL-005 0.1.0 and its original checks. Implementers MUST NOT evaluate that frozen pack using this draft's revised semantics.

No retroactive sidecar promotion, republishing, evidence rewrite or acceptance-record backfill is required for existing releases. A prior filename-only report binding does not meet the new digest requirement, but does not invalidate an earlier acceptance under its original pack. A new claim against a later pack requires a new evaluation and record.

## Scope boundary

Source archive comparison and artifact digest binding establish consistency of the published files. They do not prove that a binary was built from the claimed source. Full build provenance remains in [REL-007]({{ site.baseurl }}/standards/rel-007-build-provenance-and-signed-attestation/). The signature envelope and trust-verification contract are coordinated with [#57](https://github.com/finos-osera/remediation-standards/issues/57); listing an implementation binding in the catalog does not mean the fitness or exchange tool already implements it.

See the [release-file evidence example]({{ site.baseurl }}/examples/release-sidecars/) and [gate responsibilities]({{ site.baseurl }}/fitness/#proposed-020-release-file-checks).

## Revisions

* 0.1.0, ratified in OSERA-SP-0.1.0 on 2026-09-10: expected package files, checksums and consistent package versions.
* 0.2.0, draft for OSERA-SP-0.2.0: makes CHECK-001 inventory-based, keeps CHECK-002 ecosystem-neutral, adds CHECK-003 for file binding and staging and CHECK-004 for acceptance records, and introduces REL-005-JAVA. The frozen 0.1.0 pack is unchanged.
