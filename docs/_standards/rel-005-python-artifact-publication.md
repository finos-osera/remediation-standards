---
schema-version: 0.1.0
sequence: 253
standard_id: REL-005-PYTHON
title: Python Artifact Publication
summary: Python publications preserve baseline wheel and source-distribution coverage and bind package contents, metadata and evidence to each promoted file.
extends: REL-005
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: Not assigned; issue 123 exploration
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Experimental Python profile; not an approved gate
type: REL
category: Release Process
applies-to:
- Python distribution patch providers
- Python package index and exchange operators
- Enterprise Python recipients
requirements:
- id: REL-005-PYTHON.REQ-001
  override-explanation: Specializes upstream file inventory and checksums for wheels and sdists, retaining every required baseline role and compatibility variant; producer declarations cannot waive missing files.
  level: MUST
  text: Producers must retain the exact baseline distribution inventory and publish patched counterparts of every required wheel variant, sdist and companion role with checksums, preserving runtime, ABI and platform coverage and public import and entry-point behavior.
  checkability: partially-automated
  checks:
  - id: REL-005-PYTHON.CHECK-001
    override-explanation: Evaluates Python distribution roles and compatibility coverage while retaining the parent's inventory completeness and checksum obligations.
    title: Required Python distributions and compatibility coverage are preserved
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_python.publication_inventory
    evidence:
    - upstream_release_inventory
    - required_release_inventory
    - distribution_files
    - checksums
    - compatibility_matrix
    - installation_and_import_results
- id: REL-005-PYTHON.REQ-005
  level: MUST
  text: Packaged tracked sources must match the patched commit through an explicit mapping; generated or transformed files must have individually recorded digests, source inputs and generating commands, without disguising tracked-source mismatches.
  checkability: partially-automated
  checks:
  - id: REL-005-PYTHON.CHECK-005
    title: Packaged source and generated-file origins are accounted for
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_python.source_mapping
    evidence:
    - patched_tag_commit
    - source_entry_mapping
    - source_comparison_results
    - generated_file_inventory
    - build_inputs
- id: REL-005-PYTHON.REQ-006
  level: MUST
  text: Distribution archives, embedded identity metadata, index file references and advertised hashes or separate core metadata must consistently describe the exact evaluated and promoted bytes; unsafe or ambiguous archive entries must be rejected.
  checkability: automated
  checks:
  - id: REL-005-PYTHON.CHECK-006
    title: Archives and index metadata identify the evaluated distribution bytes
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_python.archive_index_binding
    evidence:
    - archive_validation
    - wheel_record_validation
    - embedded_metadata
    - retained_index_metadata
    - advertised_hashes
    - downloaded_file_digests
    - promoted_file_digests
- id: REL-005-PYTHON.REQ-007
  level: MUST
  text: Producers must compare baseline and patched dependency, runtime, import, namespace-package, entry-point and license metadata and behavior, disclose intended changes and validate them for every declared supported environment without silently narrowing baseline support.
  checkability: partially-automated
  checks:
  - id: REL-005-PYTHON.CHECK-007
    title: Python metadata changes and import compatibility are validated
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel005_python.metadata_compatibility
    evidence:
    - baseline_metadata
    - patched_metadata
    - dependency_and_marker_diff
    - distribution_import_mapping
    - namespace_coexistence_results
    - runtime_abi_test_results
    - license_inventory
---

## Scope and status

This **Pre-Draft** extends [REL-005]({{ site.baseurl }}/standards/rel-005-artifact-publication-hygiene/) working version 0.2.2 for [#123](https://github.com/finos-osera/remediation-standards/issues/123). REQ/CHECK-001 specializes inventory; parent 002–004 remain inherited for identity, per-file uploader/signature/digest binding and staging, and immutable acceptance records. Added 005–007 cover sources, archive/index integrity and Python metadata compatibility. Proposed blocking checks are not active gates, and implementation names are not implemented validators. A future pack must pin parent/profile versions together.

## Distribution inventory and compatibility

Retain the exact upstream index observation, filenames, digests, file roles, wheel build tags and expanded interpreter/ABI/platform tags. Every upstream wheel variant and sdist MUST have a patched counterpart. Version substitutions and patched bytes are expected; silent removal of a variant is not. An sdist does not substitute for a required native wheel. A wheel does not substitute for an upstream sdist. This profile defines no exclusions; unresolved inventory cannot pass and proposed support reductions need a separately reviewed profile revision.

Additional package companions are optional when absent upstream, but separately required OSERA provenance and test evidence remain required. Recognized additions receive applicable checks; unexpected uploads remain staged under the parent rule. Verify the actual uploaded distributions, not a repository build manifest alone.

CHECK-001 and CHECK-007 MUST compare runtime support against the baseline and retain installation, public-import and entry-point evidence for declared environments. Native wheels additionally need ABI/shared-library validation appropriate to their supported targets. Wheel tags and `Requires-Python` alone do not prove compatibility. This defines publication compatibility for these distributions; it does not reinterpret Java bytecode under REL-002. A broader runtime compatibility standard remains a governance follow-up.

## Archive and metadata checks

Validate wheel filenames, `.dist-info`, `METADATA`, `WHEEL` and `RECORD` under the applicable [wheel format](https://packaging.python.org/en/latest/specifications/binary-distribution-format/). Respect RECORD's specified exclusions for its own hash and signature files. Calculate whole-archive SHA-256 separately. Validate sdists against the applicable modern or explicitly identified legacy format; do not require historical upstreams to have modern metadata they never published. Filename, archive directory and embedded name/version MUST agree after permitted normalization. [Source distribution format](https://packaging.python.org/en/latest/specifications/source-distribution-format/).

Reject duplicate or ambiguous paths, path traversal and unsafe link targets before extraction. Compare `Requires-Python`, `Requires-Dist`, extras and markers, entry points, bundled native libraries and license files. Preserve intended upstream behavior, record intentional remediation changes and tests, and do not require dependency bytes to remain identical when they must change to fix a vulnerability. Builds from sdists must record backend and build dependencies separately from runtime dependencies.

Map distributions to their actual import names, including shared namespace portions. Preserve namespace-package behavior: adding a regular `__init__.py` can hide another distribution's portion. Test supported co-installed namespace contributors and reject unintended import shadowing. Do not infer imports by replacing hyphens in a distribution name; older metadata need not contain explicit import declarations. [Distribution versus import packages](https://packaging.python.org/en/latest/discussions/distribution-package-vs-import-package/), [namespace packages](https://packaging.python.org/en/latest/guides/packaging-namespace-packages/).

CHECK-006 verifies download references, advertised file hashes and any separately served core metadata against the archives evaluated. Retain yanked state and source index identity. A valid hash on untrusted bytes is not producer authorization. The [Simple repository API](https://packaging.python.org/en/latest/specifications/simple-repository-api/) governs discovery; it does not supply the inherited OSERA signature or acceptance record.

## Signatures and attestations

Parent CHECK-003 remains required in this proposed profile: retain the observed uploader, approved producer, verified signature and exact file digest. REL-004 currently requires registry fields including `pgp_fingerprint` and `pgp_key_urls`; this profile does not waive them or substitute a Sigstore identity. Its `.asc` jar/pom examples must not be treated as Python artifact kinds. An experimental verifier must declare its transport and policy, retain verification results, and leave the proposed check unresolved where that contract is absent.

Evaluate PEP 740 distribution attestations as additional evidence under [REL-007]({{ site.baseurl }}/standards/rel-007-build-provenance-and-signed-attestation/). They bind one filename and SHA-256 subject to an in-toto statement. PyPI Publish concerns publication identity and intent, not build reproduction or test correctness. Private-index publication must not claim it was a PyPI upload. [Index hosted attestations](https://packaging.python.org/en/latest/specifications/index-hosted-attestations/), [PyPI Publish predicate](https://docs.pypi.org/attestations/publish/v1/).

Replacing the mandatory OpenPGP registry model with keyless identities needs a versioned REL-004 revision or Python profile, registry schema and trust-policy work coordinated with #56/#57. It cannot be implemented by silently overriding REL-004 from this REL-005 child. REL-007 remains observe-only. Test-report digests remain governed by REL-001; feed/SBOM identities and pedigree remain governed by FEED-001/002. Python evidence-sidecar discovery must be demonstrated on the proposed index; arbitrary SBOM or signature files are not assumed to be accepted as package distributions.

## Review cases

| Case | Proposed result |
| --- | --- |
| Native baseline wheel replaced only with an sdist | Fail CHECK-001 |
| Required import or another namespace contributor is hidden | Fail CHECK-007 |
| Tracked source mismatch labeled as generated | Fail CHECK-005 |
| Index metadata or promoted bytes differ from evaluated archive | Fail CHECK-006 |
| Package hash passes but required producer signature is missing | Inherited CHECK-003 unresolved; no promotion pass |
| Valid publishing attestation without build provenance | No claim of source-to-binary proof |

Before Draft approval, exercise real pure-Python and native-extension baselines, agree legacy sdist handling and environment coverage, demonstrate evidence discovery and signature verification, and resolve the producer trust-model decision. See the [research and parent audit]({{ site.baseurl }}/research/python-ecosystem/) for measured coverage and remaining work.
