---
schema-version: 0.1.0
sequence: 293
standard_id: REL-009-PYTHON
title: Python Coordinated Remediation Adoption
summary: Providers publish exact Python remediation sets and coordinated constraints or project and lockfile changes, verified against installed distributions, origins and digests.
extends: REL-009
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
- Enterprise Python recipients
- Python remediation and dependency tooling
requirements:
- id: REL-009-PYTHON.REQ-001
  override-explanation: Specializes scope with normalized distributions, source/import mappings and Python environment/index configurations while preserving baseline and consumer entry-point declarations.
  level: MUST
  text: Providers must declare normalized distribution names, exact baselines, source repositories, import and namespace mappings, coordinated release units, consumer entry points and supported interpreter, installer, platform and index configurations.
  checkability: partially-automated
  checks:
  - id: REL-009-PYTHON.CHECK-001
    override-explanation: Checks Python distribution and configuration evidence for the parent supported-scope obligation without importing Java BOMs or npm publisher scopes.
    title: Python dependency scope and identity mappings are explicit
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009_python.supported_scope
    evidence:
    - supported_dependency_scope
    - upstream_baselines
    - distribution_repository_import_mapping
    - coordinated_release_units
    - consumer_entry_points
    - supported_tooling_configurations
- id: REL-009-PYTHON.REQ-002
  override-explanation: Specializes the immutable remediation set with Python identities, approved origins and per-file hashes while preserving remediation evidence and inherited change disclosure.
  level: MUST
  text: Each immutable versioned remediation set must identify exact normalized distribution names, canonical versions, Python purls, approved index and download origins, filenames, compatibility tags and SHA-256 digests, with baseline and remediation evidence and changed or unchanged member disposition.
  checkability: partially-automated
  checks:
  - id: REL-009-PYTHON.CHECK-002
    override-explanation: Checks exact Python distribution files and evidence for the parent immutable-set obligation; a name/version alone cannot bind an index or wheel variant.
    title: Python remediation set binds exact distributions to origins and evidence
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009_python.remediation_set
    evidence:
    - remediation_set_identity
    - distribution_versions_and_purls
    - approved_origins
    - file_inventory_and_digests
    - baseline_and_remediation_evidence
- id: REL-009-PYTHON.REQ-003
  override-explanation: Specializes adoption through provider-maintained constraints or tool-specific project, source and lockfile changes; inherited CHECK-006 verifies selection and recipients need not maintain transitive overrides manually.
  level: MUST
  text: Providers must supply a supported procedure that updates controlling requirements, constraints, source configuration and lockfiles or hashed installation inputs together as applicable, verifies clean and repeatable installations, and reports incompatible declarations without bypassing dependency checks.
  checkability: partially-automated
  checks:
  - id: REL-009-PYTHON.CHECK-003
    override-explanation: Checks Python adoption instructions, coordinated changes and rollback inputs while retaining the parent obligation to avoid recipient-authored artifact-by-artifact override maintenance.
    title: Supported Python adoption procedure updates the controlling inputs together
    type: release-evidence
    severity: blocking
    implementation: osera-fitness.rel009_python.adoption_procedure
    evidence:
    - adoption_procedure
    - consumer_entry_points
    - requirements_constraints_project_lock_diff
    - source_configuration
    - provider_maintained_rules
    - rollback_inputs
---

## Scope and status

This **Pre-Draft** extends [REL-009]({{ site.baseurl }}/standards/rel-009-line-release-and-bom-propagation/) working version 0.1.2 for [#123](https://github.com/finos-osera/remediation-standards/issues/123). Requirements/checks 001–003 specialize their parent counterparts; CHECK-006 (actual consumer resolution) and CHECK-007 (change and validation disclosure) remain inherited. Sibling Java checks 004–005 are not inherited. Proposed blocking severities and implementation names do not activate production checks. No pack is assigned; a future pack must pin parent/profile versions.

## Distribution identity and scope

A distribution's normalized name is a flat key in an index, not a publisher namespace. Import packages can have dotted names and share namespace portions across distributions; neither fact establishes ownership of the distribution key. The same name on two indexes is not proof of the same trusted publisher. Record upstream project/repository, OSERA fork, source subdirectory, distribution name, provided import names and approved index/download origins separately. Never derive a fork URL from the distribution spelling alone. FORK-001's organization and repository naming rules continue to apply to the mapped source repository.

A shared import namespace or monorepo does not automatically create a Java-style line or require every contributor to be republished. Declare upstream coordinated release units and the members that actually need changes, with reasons and exact identities for unchanged members. Verify supported co-installed namespace contributors. Do not add `osera` to distribution or import names to simulate npm scopes; the naming profile preserves distribution identity.

## Adoption procedure

Start with provider-maintained exact local-version constraints for pip, or coordinated native project/source/lock updates for other declared tools. Constraints narrow resolution; they neither install packages on their own nor override incompatible dependency requirements. A parent requiring `===1.4.1` and a constraint selecting `1.4.1+osera.1` must fail rather than silently retain vulnerable code or disable dependency checks. [pip constraints](https://pip.pypa.io/en/stable/user_guide/#constraints-files).

Update the consumer's actual controlling inputs together, including dependency groups, extras, markers and supported platform selections. A dependency's own lockfile must not be assumed to control its consumers. Record tool versions and flags: `uv pip install`, `uv lock`/`sync`, pip and Poetry are distinct workflows. Providers maintain any transformation rules; recipients retain the explicit adoption decision and should not reconstruct a transitive override list.

For initial trials use one controlled index, or another origin-selection procedure validated for the declared tooling. `--extra-index-url` does not impose trusted-index priority in pip. uv's first-index behavior differs. Record allowed redirects/download hosts and reject a selected artifact outside the approved origins even when its name/version matches. Credentials must be supplied separately from retained evidence. [pip installation](https://pip.pypa.io/en/stable/cli/pip_install/), [uv indexes](https://docs.astral.sh/uv/concepts/indexes/).

## Resolution and reproducibility evidence

Inherited CHECK-006 MUST retain, for each supported configuration:

- Python implementation/version, installer version, OS/architecture, ABI, index and cache settings, selected extras/groups and marker environment;
- before/after controlling inputs and resolved distributions, covering all targeted transitive dependencies;
- downloaded filenames, origins and SHA-256 matched against the set, including the selected wheel variant;
- clean resolution and installation, explicit upgrade of an existing installation where supported, and subsequent frozen-lock or complete hash-pinned replay, with commands, exit codes and logs;
- actual installed metadata and import/entry-point smoke results; source-build paths additionally retain build inputs and resulting wheel digests.

Unchanged locks, cached vulnerable distributions, wrong origins, mismatched hashes, unavailable required artifacts and dependency conflicts must not produce a successful adoption result. Zero installer exit status is insufficient if a targeted remediation was not installed. A platform-excluded dependency needs an evidence-backed explanation, not a silent pass for a required target.

Inherited CHECK-007 discloses all dependency and metadata changes, component tests, integration tests performed and remaining limitations. Exact pins and replay evidence provide reproducibility for the declared environment; they do not prove compatibility on untested systems. A later upstream version must have remediation evidence before it is recommended as a safe return. Retain prior inputs and set identity for rollback; rollback is not a claim that the prior state is secure.

## Review cases and remaining decisions

| Case | Proposed result |
| --- | --- |
| Local constraint satisfies a transitive public equality pin | Can pass for the measured configuration and exact artifacts |
| Constraint conflicts with arbitrary equality or a direct artifact reference | Report failure; do not bypass dependency semantics |
| Project updated but replay retains vulnerable locked bytes | Fail inherited CHECK-006 |
| Same name/version selected from an unapproved index | Fail origin binding and inherited CHECK-006 |
| Shared namespace contributor becomes unimportable | Fail supported compatibility validation |
| Component tests pass without integration testing | Disclose scope under CHECK-007; do not claim integration compatibility |

The [research]({{ site.baseurl }}/research/python-ecosystem/) covers synthetic offline pip/uv installations, not lockfile, production-index or member-package trials. Before Draft approval, agree supported tools/environments, set schema and transport, repository ownership policy, native/source-build replay and sidecar discovery. REL-001 tests, REL-004 producer approval, REL-005 publication and FEED-001/002 evidence remain separate obligations; a Python profile cannot silently waive them.
