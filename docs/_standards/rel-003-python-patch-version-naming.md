---
schema-version: 0.1.0
sequence: 233
standard_id: REL-003-PYTHON
title: Python Patch Version Naming
summary: Python patched distributions retain upstream names and use canonical local versions on a controlled index, with explicit resolver and release-identity evidence.
extends: REL-003
doc-status: Pre-Draft
standard-version: 0.0.2
candidate-pack: Not assigned; issue 123 exploration
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Experimental Python profile; not an approved gate
type: REL
category: Release Process
applies-to:
- Python distribution patch providers
- Python package index operators
- Enterprise Python recipients
requirements:
- id: REL-003-PYTHON.REQ-001
  override-explanation: Specializes the parent naming outcome with PEP 440 local versions and controlled-index resolution while preserving upstream baseline and OSERA identity; SemVer build-metadata spelling is not imposed on Python.
  level: MUST
  text: Patched distributions must retain the normalized upstream distribution name and use the canonical version <baseline>+osera.<N>, where baseline is a supported canonical public final version and N is a positive unpadded integer, with supported-tool evidence that the intended remediation is selected.
  checkability: partially-automated
  checks:
  - id: REL-003-PYTHON.CHECK-001
    override-explanation: Replaces generic profile-selection evidence with canonical Python syntax, baseline identity, ordering and supported-tool resolution evidence; the parent recipient outcome remains required.
    title: Python version preserves the baseline and resolves to the intended remediation
    type: release
    severity: blocking
    implementation: osera-fitness.rel003_python.version_pattern_compatibility
    evidence:
    - baseline_version
    - normalized_distribution_name
    - artifact_version
    - supported_tooling_configurations
    - resolver_test_result
    - dependency_update_test_result
- id: REL-003-PYTHON.REQ-002
  override-explanation: Specializes identifier consistency for Python distribution metadata and package URLs while retaining source-tag, artifact, feed and evidence correlation.
  level: MUST
  text: Release tags, distribution filenames and metadata, Python package URLs, feeds and release evidence must identify the same canonical patched release; repository origin and file SHA-256 must distinguish its individual artifacts.
  checkability: automated
  checks:
  - id: REL-003-PYTHON.CHECK-002
    override-explanation: Checks Python name normalization and version identity across source, distributions and feeds; repository and digest evidence supplement rather than replace the parent consistency rule.
    title: Python release identity is consistent across source, distributions and feeds
    type: release
    severity: blocking
    implementation: osera-fitness.rel003_python.identifier_consistency
    evidence:
    - release_tag
    - distribution_metadata
    - distribution_filenames
    - python_purl
    - feed_purl
    - repository_origins
    - artifact_digests
- id: REL-003-PYTHON.REQ-003
  level: MUST
  text: The release counter must increase without reuse for each normalized distribution and exact baseline, and each later patch must retain all prior remediation fixes on that baseline.
  checkability: partially-automated
  checks:
  - id: REL-003-PYTHON.CHECK-003
    title: Counter allocation is unique and remediation fixes are cumulative
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel003_python.cumulative_release
    evidence:
    - counter_allocation_record
    - previous_release_inventory
    - previous_remediation_evidence
    - current_remediation_evidence
---

## Scope and status

This **Pre-Draft** extends [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) for [#123](https://github.com/finos-osera/remediation-standards/issues/123). Proposed blocking severities and implementation names describe review contracts, not deployed validators. No pack includes this profile. The proposed parent is REL-003 0.1.1; a future pack must pin exact parent/profile versions. Requirements/checks 001–002 override their parent counterparts; 003 is added.

The first supported baseline grammar is a canonical numeric final release such as `1.4.1` or `2024.11`. Epochs, postreleases, prereleases, development releases and existing local labels are outside this initial profile. They require further fixtures and a versioned scope extension, not stripping qualifiers or inventing a new baseline.

## Version and identity

The version MUST be `<baseline>+osera.<N>`, for example `1.4.1+osera.1`. N starts at 1 and increases for each normalized distribution and exact baseline. Use canonical unpadded decimal digits. Retain a coordinated allocation record across producers; never reuse an allocated release identity for changed bytes. The allocation service and conflict handling remain review decisions. A later patch that drops a previous fix fails CHECK-003; a correction or withdrawal needs explicit review rather than an automatic cumulative-success claim.

The normalized upstream distribution name MUST be preserved. Compare names by lowercasing and collapsing runs of `.`, `_` and `-` to `-`, under the [name specification](https://packaging.python.org/en/latest/specifications/name-normalization/). `Example.Lib`, `example_lib` and `example-lib` denote the same distribution key. A dot is not a Maven group separator, and an `osera-` name prefix would create a different distribution rather than a publisher scope.

```text
Distribution:     example-lib
Baseline:         1.4.1
Release tag:      v1.4.1+osera.1
Wheel:            example_lib-1.4.1+osera.1-py3-none-any.whl
Python purl:      pkg:pypi/example-lib@1.4.1%2Bosera.1
```

The `v` is a source-tag prefix, not part of distribution metadata. A Python purl has no publisher namespace; do not insert a Maven group, index hostname or GitHub organization in that position. Record approved origin, filename and digest separately. FORK-002 branch naming and FORK-003 baseline tags remain unchanged. Distribution names, import names and source repository names MUST NOT be inferred from one another; the adoption profile records their explicit mapping.

## Distribution and resolution

Local versions are intended for compatible downstream modifications, but PyPI prohibits them. This proposal therefore requires a controlled index or explicitly validated artifact source that accepts local versions, not upload to PyPI. [Python version specification](https://packaging.python.org/en/latest/specifications/version-specifiers/#local-version-identifiers).

CHECK-001 MUST test actual selection in the declared installer, update-tool and repository configuration. A version-parser pass is insufficient. Record fresh installation, existing-install upgrade and lockfile behavior where supported, plus origin and digest. `==1.4.1` can admit a local rebuild, `===1.4.1` does not, and an exact local pin stays pinned. Do not claim automatic adoption solely from version ordering. A different producer label can sort higher; `osera` is not authentication. A newer upstream version must have appropriate remediation evidence before being recommended as a safe return path.

The [research]({{ site.baseurl }}/research/python-ecosystem/) retains 22 passing offline pip/uv installation cases and separates them from untested index, update-tool and lockfile behavior. CHECK-001 remains unresolved for a claimed supported configuration without its evidence. [REL-009-PYTHON]({{ site.baseurl }}/standards/rel-009-python-coordinated-adoption/) specifies coordinated consumer changes.

## Public naming precedents

The following informative examples were reviewed on November 24, 2026. They motivate the proposed local-version mechanism; they are not OSERA releases, producer approvals or conformance results.

| Public source | Documented example | Relevance and limits |
| --- | --- | --- |
| [TuxCare Python ELS guide](https://docs.tuxcare.com/els-for-libraries/python-libraries/) | `certifi==2021.10.8.post2+tuxcare` | A specific vendor-documented patched release on an authenticated index. Its public postrelease plus local vendor label differs from this profile's unchanged baseline plus local counter. The package bytes were not independently verified |
| [TuxCare remediation guide](https://sc.tuxcare.cloud/guide/fix) | `<version>+tuxcare.N` for Python builds | Vendor documentation of the same local vendor/counter shape proposed for OSERA; not an independently tested release inventory |
| [Bazel rules_python implementation](https://github.com/bazelbuild/rules_python/blob/main/python/private/pypi/patch_whl.bzl) | Patched wheel filenames receive `+patched`, or `.patched` after an existing local label | Public patching-tool precedent. Filename changes alone do not establish consistent embedded metadata, valid hashes or conformance with this profile |
| [PyTorch wheel index](https://download.pytorch.org/whl/torch/) | `torch-1.12.1+cpu-cp310-cp310-linux_x86_64.whl` | Public artifact listing demonstrating local-version distribution outside PyPI. `+cpu` identifies a build variant, not a security backpatch |

These conventions are evidence for evaluating local versions, not a single ecosystem-wide security patch convention. The proposed `+osera.N` spelling and cumulative-counter rules remain OSERA choices. Existing local labels such as `+cpu` need a separately reviewed extension policy; this initial profile must not discard them or append a second plus. See the [research findings]({{ site.baseurl }}/research/python-ecosystem/#public-naming-precedents) and [worked example]({{ site.baseurl }}/examples/python-remediation/#public-examples-and-the-osera-proposal).

## Review cases

| Case | Proposed result |
| --- | --- |
| Canonical `1.4.1+osera.1`, correct baseline, successful supported installation | Naming may pass when all required tooling evidence is present |
| `1.4.1+osera.01` or `1.4.1+OSERA-1` | Fail canonical naming even if a parser normalizes it |
| Existing local baseline or unsupported epoch/postrelease | Outside initial scope; do not report a pass |
| Same name/version but wrong origin or digest | Fail identity/adoption binding |
| Counter reused or predecessor fix omitted | Fail CHECK-003 |

Before Draft approval, settle supported baselines, tooling matrix, counter coordination and real repository behavior. Public naming precedents support evaluating this mechanism; they do not establish OSERA approval or conformance.

## Editorial revision

Version 0.0.2 adds sourced public naming precedents and their evidence limits. Proposed requirements, checks and Pre-Draft status are unchanged.
