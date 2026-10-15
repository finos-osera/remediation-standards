---
schema-version: 0.1.0
sequence: 251
standard_id: REL-005-JAVA
title: JVM Artifact Publication
summary: Maven and Gradle publications preserve upstream companion files and bind
  source archives and module metadata to the exact patched release.
extends: REL-005
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.2.0 required
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required JVM ecosystem profile check
type: REL
category: Release Process
applies-to:
- Maven and Gradle package patch providers
- JVM package repository operators
- Enterprise JVM recipients
requirements:
- id: REL-005-JAVA.REQ-001
  override-explanation: Specializes the parent's required upstream-preserving inventory with Maven classifiers, POM packaging and Gradle module metadata, retaining required files and checksum verification.
  level: MUST
  text: Maven/Gradle releases must preserve the upstream baseline publication's file
    roles and classifiers and include a POM, the primary artifact where packaging
    is not pom, and sources JARs, javadoc JARs and Gradle module metadata wherever
    upstream published them, with the required checksums. Additional companion
    artifacts are optional and must pass applicable checks when supplied.
  checkability: automated
  checks:
  - id: REL-005-JAVA.CHECK-001
    override-explanation: Applies the parent's upstream inventory and checksum check to Maven packaging, classifiers and Gradle metadata while preserving every required upstream counterpart.
    title: Maven and Gradle publication inventory is complete
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_java.publication_inventory
    evidence:
    - upstream_release_inventory
    - required_release_inventory
    - pom_packaging
    - artifact_files
    - checksums
- id: REL-005-JAVA.REQ-005
  level: MUST
  text: Every source-archive entry mapped to a tracked file must match its bytes at
    the patched release tag; build-added entries must be individually listed with
    their origin and must not mask tracked-source mismatches.
  checkability: automated
  checks:
  - id: REL-005-JAVA.CHECK-005
    title: Source archive entries match the patched tag or are listed build additions
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_java.sources_match
    evidence:
    - patched_tag_commit
    - source_roots
    - source_entry_mapping
    - source_comparison_results
    - build_added_entries
- id: REL-005-JAVA.REQ-006
  level: MUST
  text: Every Gradle module file reference must resolve to the exact release file
    promoted for that variant, with matching name, byte size and SHA-256.
  checkability: automated
  checks:
  - id: REL-005-JAVA.CHECK-006
    title: Gradle module metadata identifies the exact promoted variant files
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_java.module_file_binding
    evidence:
    - gradle_module
    - variant_file_references
    - promoted_file_names
    - promoted_file_sizes
    - promoted_file_sha256
---

## Scope and inheritance

REL-005-JAVA extends [REL-005 0.2.0]({{ site.baseurl }}/standards/rel-005-artifact-publication-hygiene/) for the Maven/Gradle/JVM package-manager and build-tool ecosystem. It includes Java, Kotlin, Scala and other implementation languages that publish through this ecosystem. It does not impose these archive formats on npm, Python or other ecosystems.

REQ-001/CHECK-001 specialize the inventory rule. Parent REQ-002 through REQ-004 and CHECK-002 through CHECK-004 are inherited unchanged: patched metadata identity, per-file uploader/checksum/signature verification, staging treatment and retained acceptance records. Numbers 005 and 006 add source-archive and Gradle checks without overriding those parent obligations.

## Required publication files

The gate MUST compare the exact upstream baseline coordinate's repository inventory with the patched publication, preserving extensions, classifiers and variants after substituting the patched version. It MUST require:

| File kind | Required when | Additional content check |
| --- | --- | --- |
| POM | Every Maven publication | Patched coordinate/version consistency under inherited CHECK-002. |
| Primary artifact, typically a JAR | Packaging is not `pom` | Applicable artifact checks plus inherited file binding. |
| `-sources.jar` | Upstream publishes it | CHECK-005, against the patched tag. |
| `-javadoc.jar` | Upstream publishes it | No additional content comparison; inherited identity and file-binding checks still apply. |
| `.module` | Upstream publishes Gradle Module Metadata | CHECK-006 for every declared variant file. |
| Other upstream classifiers or variant files | Present in the upstream baseline inventory | Inherited identity and file-binding checks; source archives also receive CHECK-005. |
| Producer test report | Required by REL-001 | REL-001.CHECK-003; inherited reports may remain at the tested release. |

Checksums and producer signatures accompany content files under the parent binding rule and the repository's publication requirements. Test reports are OSERA evidence; this profile does not require a particular archive format or the literal filename `tests.zip`.

Sources, javadoc and Gradle module metadata are required only when present in the exact upstream baseline release's published inventory, regardless of whether generated artifacts are checked into its source repository. Producers are not required to introduce companion artifacts absent from that upstream release. POM-only BOMs and parent POMs do not need synthetic binary, sources or javadoc JARs when upstream has none; upstream sidecars still carry forward.

Producers MAY voluntarily publish additional companion artifacts. Their absence MUST NOT cause acceptance to fail when upstream does not publish them. A voluntarily supplied `.module`, sources or javadoc file is recognized and MUST pass the same applicable checks as a required counterpart. Other voluntary companion files may be published when their role and applicable checks are recognized under the parent binding rule; upstream absence alone does not prohibit publication. Unrecognized uploads remain in staging. OSERA's separately required test and provenance evidence is unaffected.

## Sources from the patched tag

The comparison MUST use the fork's release tag resolved to a commit, never the unpatched upstream tag. Compare uncompressed file bytes without whitespace or line-ending normalization; ZIP timestamps, ordering and compression are not source content.

The gate MUST inventory every non-directory archive entry and record its mapping to the relevant module's source roots at that commit. Preserve relative paths within each root, including package paths; matching by basename alone is insufficient. Record the roots and mapping used. Ambiguous mappings, duplicate archive paths and entries that escape the archive root MUST fail rather than being silently skipped. A matched tracked file with different bytes MUST fail and cannot be reclassified as generated.

Entries that have no tracked-file counterpart and are added by the build MUST be listed individually with their archive path, SHA-256, and generating task or packaging origin. Examples include `META-INF/MANIFEST.MF`, an embedded published POM and generated code such as Jackson's `PackageVersion.java`. These entries are reported and allowed, rather than rejected merely because they are generated; listing them is not proof of reproducible generation. Unexplained entries fail CHECK-005.

The gate MUST also record missing entries relative to the module's source-archive inputs declared by the tagged build, including patched source files in those inputs, and fail on missing required inputs. This prevents an empty or truncated archive passing a comparison of only the files it happens to contain. Files outside the publication's source inputs are not required just because they are in the repository.

## Gradle module metadata

For each variant's `files` entry, the gate MUST resolve `url` relative to the publication location and verify that it identifies the intended promoted file. `name`, `size` in bytes and `sha256` MUST match that file's actual name and bytes. A reference to an upstream, staged-only, missing or different file fails. Multiple variants may refer to the same verified JAR; distinct variant artifacts are checked separately. Source and documentation variants receive the same reference checks.

These fields are defined in the [Gradle Module Metadata specification](https://github.com/gradle/gradle/blob/master/platforms/documentation/docs/src/docs/design/gradle-module-metadata-latest-specification.md). This profile requires SHA-256 even if a metadata format permits other hashes. Module component identity also receives inherited CHECK-002. For `available-at` redirects, retain the target metadata and follow it to the declared variant files; unresolved targets cannot produce a passing result. The acceptance evidence must identify the promoted release files reached through the redirect.

CHECK-006 is `not-applicable` only when neither upstream nor the patched release publishes module metadata, with the inventory as evidence. A POM-only module with no file-bearing variants may pass after the gate records that fact and verifies its metadata identity. CHECK-005 is `not-applicable` only when no source archive is required or supplied.

## Transition and review

This is a draft proposed for the next pack in [#78](https://github.com/finos-osera/remediation-standards/issues/78). Version 0.1.0 is this profile's initial version, not membership in OSERA-SP-0.1.0. It takes effect only when a ratified pack includes it alongside its parent 0.2.0. Existing releases need no retroactive sidecar promotion. See the [example and review cases]({{ site.baseurl }}/examples/release-sidecars/).
