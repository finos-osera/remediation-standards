---
title: Python Remediation Research and Proposal
permalink: /research/python-ecosystem/
---

Research for [issue #123](https://github.com/finos-osera/remediation-standards/issues/123), reviewed November 24, 2026. The issue requests Python packaging, attestation and conformance proposals by year end, informed by member-submitted lines expected around November 25.

**Recommendation:** start with Python packaging profiles for naming, publication and adoption, using the existing Java and JavaScript profile structure. Trial `<upstream-public-version>+osera.<counter>` on a controlled Python package index, preserving the upstream distribution name. Require evidence for each wheel and source distribution, and verify the actual consumer installation. PyPI hosting is a separate decision: its version rules prohibit local version identifiers.

This research accompanies three initial Pre-Drafts: [REL-003-PYTHON]({{ site.baseurl }}/standards/rel-003-python-patch-version-naming/), [REL-005-PYTHON]({{ site.baseurl }}/standards/rel-005-python-artifact-publication/) and [REL-009-PYTHON]({{ site.baseurl }}/standards/rel-009-python-coordinated-adoption/). They are review material under the [lifecycle]({{ site.baseurl }}/lifecycle/) and [governance]({{ site.baseurl }}/governance/), with no assigned pack or active gate. The offline experiment exercises synthetic packages; member packages and production repository behavior still need trials.

## Relationship to Java and JavaScript

| Area | Existing approach | Proposed Python treatment |
| --- | --- | --- |
| Release identity | Java uses CARE-style versions; JavaScript proposes a prerelease of the next patch | `REL-003-PYTHON`: evaluate PEP 440 local versions and preserve normalized upstream distribution identity |
| Publication | REL-005 and ecosystem profiles derive required files from the baseline inventory | `REL-005-PYTHON`: inventory wheels by interpreter, ABI and platform, plus any upstream sdist; bind every promoted file |
| Adoption | Java propagates BOMs; JavaScript proposes coordinated manifest and lockfile edits | `REL-009-PYTHON`: provider-maintained constraints or tool-specific project/lock changes, verified against the installed dependency graph |
| Compatibility | REL-002 explicitly governs Java bytecode | Decide separately how to standardize Python runtime and native ABI preservation |
| Attestation | REL-007 is observe-only; proposed REL-005 verifies release-file signatures | Reuse both responsibilities; evaluate PEP 740 distribution attestations without treating upload identity as build proof |

The reference texts are [Java naming]({{ site.baseurl }}/standards/rel-003-java-patch-version-naming/), [JavaScript naming]({{ site.baseurl }}/standards/rel-003-javascript-patch-version-naming/), [Java publication]({{ site.baseurl }}/standards/rel-005-java-artifact-publication/), and [JavaScript adoption]({{ site.baseurl }}/standards/rel-009-javascript-coordinated-adoption/). Their lifecycle status and experimental coverage differ; copying their requirement structure does not transfer approval or implementation evidence to Python.

## Naming and distribution decision

Python's local versions are intended for compatible downstream rebuilds and patches. Unlike SemVer build metadata, their labels participate in ordering. PyPI must reject local versions, so retaining the original project name with an OSERA local version requires another index. [Python version specification](https://packaging.python.org/en/latest/specifications/version-specifiers/#local-version-identifiers).

Proposed first-trial scope: canonical numeric final baselines; defer epochs, postreleases, existing local labels and prerelease/development baselines until explicit rules and fixtures exist. Use a positive, unpadded integer counter per normalized package and exact upstream baseline. The counter should identify cumulative remediation releases, with prior fixes retained or an explicit reviewed correction. OSERA would need to coordinate counter allocation across approved producers; the label alone authenticates nobody.

Illustrative identity:

```text
Distribution:     example-lib
Upstream version: 1.4.1
Patched version:  1.4.1+osera.1
Release tag:      v1.4.1+osera.1
Baseline tag:     v1.4.1+patch.baseline
Wheel:            example_lib-1.4.1+osera.1-py3-none-any.whl
Source archive:   example_lib-1.4.1+osera.1.tar.gz
Package URL:      pkg:pypi/example-lib@1.4.1%2Bosera.1
```

The package URL follows REL-003's existing plus-encoding rule; release evidence must additionally identify the repository and file SHA-256 because a package version can have several wheels. A distribution name and its import names are different identities: preserving `example-lib` does not justify renaming its Python imports. The wheel filename's underscore spelling is the packaging convention, not a renamed project. [Wheel specification](https://packaging.python.org/en/latest/specifications/binary-distribution-format/).

| Candidate | Assessment for the initial trial |
| --- | --- |
| `1.4.1+osera.1` | Preferred candidate: visible initiative, distinct identity, no claim on upstream's next public version; requires controlled distribution |
| Generic `1.4.1+osera-patch.001` | Local-label normalization changes this to `1.4.1+osera.patch.1`; choose one canonical spelling rather than carrying SemVer formatting assumptions |
| JavaScript `1.4.2-osera-00001` or Java `1.4.1.1-osera-00001` | Not valid Python versions; do not transplant either grammar |
| `1.4.1.post1` | Valid public form, but consumes an upstream version identity and lacks an OSERA marker; not proposed for independent downstream publishing |
| `1.4.2.dev1` | Valid public form, but occupies upstream's development sequence and introduces prerelease selection behavior |
| Wheel build tag only | Does not change the distribution version; unsuitable for identifying a security remediation in dependencies or feeds |
| Rename to `osera-example-lib` | Changes distribution identity and leaves dependents referring to the original name; would need a separate migration model |

Syntax and normalization above follow the [version specification](https://packaging.python.org/en/latest/specifications/version-specifiers/); the wheel specification explicitly cautions against using build numbers for externally referenced security fixes. Valid public syntax alone provides no permission to upload to an upstream-owned PyPI project.

## Public naming precedents

Public evidence supports local-version naming, but the evidence types differ. These sources were reviewed on November 24, 2026; authenticated commercial artifacts were not downloaded or independently verified.

| Source | Observed convention | What it establishes |
| --- | --- | --- |
| [TuxCare Python ELS installation guide](https://docs.tuxcare.com/els-for-libraries/python-libraries/) | `certifi==2021.10.8.post2+tuxcare` | A vendor publicly documents a specific patched Python release using a postrelease plus local vendor label and its own authenticated index |
| [TuxCare remediation guide](https://sc.tuxcare.cloud/guide/fix) | Python builds use `+tuxcare.N` | Public vendor documentation describes the same baseline-plus-vendor-counter shape proposed here; this is not independent verification of available artifacts |
| [Bazel rules_python patch implementation](https://github.com/bazelbuild/rules_python/blob/main/python/private/pypi/patch_whl.bzl) | Patched wheel filenames gain `+patched`, or `.patched` after an existing local label | Public implementation precedent for marking downstream patched wheels; not a commercial security release, nor evidence that filename-only rewriting satisfies OSERA metadata/integrity checks |
| [PyTorch wheel index](https://download.pytorch.org/whl/torch/) | Public filenames such as `torch-1.12.1+cpu-cp310-cp310-linux_x86_64.whl` | Real artifact listings show local-version distribution on an alternate index; these denote build variants, not proof of security backpatches |

These precedents strengthen the local-version candidate without establishing a universal convention. TuxCare's postrelease form differs from the initial OSERA proposal, which keeps the public baseline unchanged and puts the counter inside the local label. PyTorch also demonstrates why upstream versions already containing local labels need a separate policy rather than blindly appending a second plus.

The same sourced examples are included directly in the [naming Pre-Draft]({{ site.baseurl }}/standards/rel-003-python-patch-version-naming/#public-naming-precedents) and [Python example]({{ site.baseurl }}/examples/python-remediation/#public-examples-and-the-osera-proposal), with their evidence limits preserved. The synthetic installer results below test OSERA's proposed spelling; they do not validate the vendors' artifacts or security fixes.

## Namespace and parent standard audit

Python has import namespaces, including namespace packages spread across distributions. It does not use Maven-style group IDs or npm-style publisher scopes in ordinary distribution names. Distribution names, import paths and repository names can differ; name normalization collapses punctuation that might otherwise look like a namespace. [Distribution versus import packages](https://packaging.python.org/en/latest/discussions/distribution-package-vs-import-package/), [namespace packages](https://packaging.python.org/en/latest/guides/packaging-namespace-packages/), [name normalization](https://packaging.python.org/en/latest/specifications/name-normalization/).

The Pre-Drafts therefore preserve normalized distribution names, declare source/import mappings, validate namespace coexistence and bind artifacts to approved origins and digests. A shared import namespace does not create a coordinated release unit or prove common ownership.

| Existing standard | Audit outcome |
| --- | --- |
| REL-003 | Python overrides 001–002 for local versions and flat distribution/purl identity; no fabricated publisher namespace |
| REL-005 | Python overrides inventory 001, inherits identity/binding/retention 002–004 and adds source, index/archive and import/namespace compatibility checks 005–007 |
| REL-009 | Python overrides scope/set/adoption 001–003 with explicit distribution/source/import/origin mapping; inherits actual resolution and disclosure 006–007 |
| FORK-001 | Its namespace is the GitHub organization, which remains valid. No override needed; map each distribution to its actual fork rather than guessing from package spelling |
| REL-004 | Actual additional constraint: mandatory OpenPGP registry fields and jar/pom implementation examples. The Python publication draft preserves approval and does not waive those fields. Keyless-only acceptance needs a versioned REL-004 revision or profile plus registry/trust schema work under #56/#57 |
| REL-002 | Java-only bytecode requirement is not Python runtime/ABI evidence. A broader compatibility standard or versioned parent generalization remains a separate decision; Python publication already proposes coverage checks |
| FEED-001/002 | Generic identity, attribution and pedigree obligations remain. Use Python purls without publisher namespace, with origin and per-file hashes separately. Demonstrate discoverable evidence sidecars rather than assuming PyPI accepts arbitrary uploads |
| APP-001 | `groupId`/`artifactId` are explanatory Java examples, not required fields in its generic observe check. Python scope uses distribution names and supported dependency graphs through REL-009-PYTHON |

A child of REL-005 cannot override requirements in REL-004 or FEED-002. Unresolved cross-standard trust or evidence-transport work must remain visible before any pack or production-gate claim.

## Measured installer behavior

Run from the repository root:

```sh
python3 tools/check_python_naming.py --uv > python-naming-results.json
```

Omit `--uv` for pip alone. The script requires Python 3.10 or later and pip, with uv on PATH for the combined run. It creates complete synthetic pure-Python wheels, installs into fresh temporary targets with indexes disabled, reads installed distribution metadata, and fails if observations differ from expectations. No package is uploaded. Commands, candidate sets, tool versions and failure diagnostics are emitted as JSON.

On November 24, 2026, all **22 cases** passed using Python 3.14.3, pip 26.0 and uv 0.10.9 on macOS arm64. Here uv means its `uv pip install` interface, not `uv lock` or `uv sync`. These are the installed tool versions, not a claim to test the latest versions. Retained output is in `tools/research/python-naming-results.json`.

The base wheel set contains `1.4.1` and `1.4.1+osera.1`, `.2`, and `.10`. Each row is an independent fresh install. Both tools produced these observations:

| Requirement or scenario | Observed version | Consequence |
| --- | --- | --- |
| `==1.4.1` | `1.4.1+osera.10` | A public equality pin admits local rebuilds; it is not a pin to the upstream bytes |
| `===1.4.1` | `1.4.1` | Arbitrary equality prevents the local-version substitution |
| `==1.4.1+osera.1` | `1.4.1+osera.1` | Explicit local pin stays on that release |
| `~=1.4.1` | `1.4.1+osera.10` | Numeric counter ordering chooses 10 after 2 |
| `~=1.4.1`, also offering upstream `1.4.2` | `1.4.2` | Re-resolution can return to upstream |
| `==1.4.1`, also offering upstream `1.4.2` | `1.4.1+osera.10` | The public pin still prevents the next public release |
| `>1.4.1,<1.4.2` | Resolution failure | Do not assume an exclusive lower bound admits local builds of that baseline |
| `==1.4.1`, also offering `1.4.1+vendor.1` | `1.4.1+vendor.1` | Version ordering does not enforce producer trust |
| `~=1.4.1`, also offering `1.4.1.post1` | `1.4.1.post1` | A public postrelease can displace the local build |
| Parent requires `==1.4.1`; constraint pins `==1.4.1+osera.10` | `1.4.1+osera.10` | A provider constraint can remediate a compatible transitive pin |
| Parent requires `===1.4.1`; same local constraint | Resolution failure | Constraints cannot repair an incompatible dependency declaration |

Selecting an upstream version does not prove it fixes the vulnerability. Require remediation evidence before recommending that transition. Fresh resolution also says nothing about an unchanged lockfile or an already-satisfied installation; pip normally retains installed versions unless asked to upgrade. [pip install](https://pip.pypa.io/en/stable/cli/pip_install/).

## Proposed publication checks

Candidate wording for `REL-005-PYTHON`: **a release must preserve the exact baseline's distribution-file roles and supported compatibility coverage, identify the patched version consistently, and bind every promoted file to retained acceptance evidence.** A producer cannot silently replace native wheels with an sdist or narrow the runtime matrix.

| Proposed check | Evidence and failure condition |
| --- | --- |
| Baseline inventory | Retain source index, baseline identity, filenames, digests and wheel compatibility tags. Missing inventory is unresolved; missing required counterparts blocks promotion |
| Package identity | Compare normalized name and version across filenames, wheel `METADATA`, sdist `PKG-INFO`, source release and feed identity. Reject disagreement |
| Archive integrity | Validate wheel structure and `RECORD`, calculate whole-file SHA-256, and check sdist layout under its applicable format. Reject corrupt archives, unsafe archive paths and mismatched file hashes |
| Metadata preservation | Compare `Requires-Python`, `Requires-Dist`, extras, markers, entry points and license material with the baseline. Record intentional changes and their validation; do not require identical dependencies when remediation changes them |
| Source correspondence | Map packaged source files to the patched commit; list generated/transformed files with inputs and build commands. Byte correspondence is not source-to-binary proof |
| Repository integrity | Check that advertised filenames, download digests and any separately served core metadata describe the evaluated bytes. Preserve yanked state and index observations in evidence |
| Compatibility | Compare supported interpreters, ABIs, operating systems and architectures; install and test on declared targets. A wheel tag or `Requires-Python` declaration alone is not execution evidence |

The formats define wheel metadata and compatibility tags, modern sdist layout, dependency metadata, and index download references. Older sdists require an explicit legacy-format assessment rather than an invented requirement that all historical upstreams already had `pyproject.toml`. [Wheels](https://packaging.python.org/en/latest/specifications/binary-distribution-format/), [sdists](https://packaging.python.org/en/latest/specifications/source-distribution-format/), [core metadata](https://packaging.python.org/en/latest/specifications/core-metadata/), [Simple repository API](https://packaging.python.org/en/latest/specifications/simple-repository-api/).

Follow REL-005's inventory rule: an sdist is required when upstream publishes one; additional package companions are optional. Separately required OSERA tests and evidence remain required. Native extension trials should include shared-library dependencies and ABI behavior, not only successful imports. Source builds must record the backend, build dependencies and build environment separately from the runtime dependency graph.

## Attestation and trust proposal

Use PEP 740 as the first interoperability candidate. Its distribution attestation contains an in-toto statement with one wheel or sdist filename and SHA-256 subject, a signature and verification material. The specification supports PyPI Publish and SLSA provenance predicates and discovery through index provenance references. [Index hosted attestations](https://packaging.python.org/en/latest/specifications/index-hosted-attestations/).

Keep these claims separate:

| Claim | Proposed treatment |
| --- | --- |
| A particular identity published these bytes | Verify the distribution signature, subject digest and expected publisher identity against OSERA's approved-producer policy |
| These bytes were built from this source | Evaluate SLSA provenance, builder identity, source commit and build inputs under REL-007's observe-mode scope |
| This release fixes the vulnerability and passed checks | Bind VEX, SBOM, completed test reports and fitness results to exact artifacts using the existing OSERA evidence contracts |

PyPI Publish attests publishing identity and intent; its predicate body is empty. It does not itself attest a source build, tests, remediation correctness or OSERA producer approval. [PyPI Publish predicate](https://docs.pypi.org/attestations/publish/v1/).

For the proposed non-PyPI index, trial a digest-addressed evidence store and standards-compatible attestations, then prove retrieval and verification end to end. Do not assume PyPI's upload service or Trusted Publisher identity rules are available on that index, and do not label a private-index upload as a PyPI publication. Coordinate the accepted envelope, identity policy and retained verification material with [#57](https://github.com/finos-osera/remediation-standards/issues/57). Missing or invalid required signature evidence blocks the proposed publication gate; missing observe-mode build provenance remains visible without silently changing REL-007's severity.

## Coordinated consumer adoption

Candidate wording for `REL-009-PYTHON`: **providers must publish an immutable remediation set and a supported procedure that selects its exact artifacts for declared consumer configurations, with failures and limitations reported.** Include normalized names, versions, allowed repository origins, file digests, supported environments, remediation evidence and rollback inputs.

For pip, start with a provider-maintained constraints file and a documented installation or upgrade procedure. Constraints restrict resolution; they neither install a package by themselves nor override conflicting dependency requirements. The strict-pin failure above is an expected failure, not permission to bypass dependency checking. [pip constraints](https://pip.pypa.io/en/stable/user_guide/#constraints-files).

For uv projects and Poetry, trial coordinated project, source configuration and lockfile updates using each tool's native workflow. Do not present the `uv pip` experiment as coverage of these workflows. Re-resolve relevant extras and environment markers, install the resulting lock or hashed requirements in a clean environment, and compare the resulting graph with the remediation set. Record changed dependencies and integration-test scope under inherited REL-009 checks.

Use a single controlled package index for the first pip trial, or an explicitly validated artifact selection procedure. pip combines candidates from its configured locations; `--extra-index-url` does not mean “trusted index wins,” and pip documents the dependency-confusion risk. uv defaults to the first index containing a package, which can produce different results. [pip index behavior](https://pip.pypa.io/en/stable/cli/pip_install/), [uv index behavior](https://docs.astral.sh/uv/concepts/indexes/).

For both tools, the gate should verify origin and digest as well as the installed version. Retain hashes for the complete supported installation, including transitive dependencies, and test wrong-origin, tampered-file, stale-lock and unavailable-artifact failures. An unchanged hash for the original wheel cannot validate a patched wheel. No public endpoint or deployed OSERA Python repository is asserted by this proposal.

## Proposed profile and gate mapping

The accompanying Pre-Drafts register these proposed allocations as review contracts, not implemented fitness functions. Matching numbers specialize parent checks; other parent checks remain inherited.

| Candidate | Mapping in the initial Pre-Drafts |
| --- | --- |
| `REL-003-PYTHON` | Override REQ/CHECK-001 for canonical Python naming and supported-tool resolution; override REQ/CHECK-002 for consistent Python identities; add CHECK-003 for cumulative fixes and counter allocation |
| `REL-005-PYTHON` | Override REQ/CHECK-001 for Python inventory; inherit 002 identity, 003 per-file binding and 004 acceptance records; add source correspondence, archive/index consistency and metadata checks starting at 005 |
| `REL-009-PYTHON` | Specialize REQ/CHECK-001–003 for Python scope, immutable sets and adoption; inherit CHECK-006 actual resolution and CHECK-007 change disclosure |
| Runtime and ABI preservation | Decide whether to generalize a new version of REL-002 with Java/Python profiles or create an independently scoped standard. Its existing Java requirement must not be silently reinterpreted |

The producer captures source, baseline inventory, build and test evidence. Fitness checks validate source/evidence relationships. The exchange gate independently checks actual uploaded bytes, uploader and producer identity, required file coverage and retained evidence before promotion, following [fitness guidance]({{ site.baseurl }}/fitness/) and [release-file binding]({{ site.baseurl }}/examples/release-sidecars/). Consumer verification evaluates the supported installation procedure. A parser-only check cannot substitute for any of these stages.

## Evidence needed before Draft approval

1. **Member lines:** collect exact upstream projects and baselines, release inventories, Python support, native-extension status, dependency roots and recipient tooling. Choose a pure-Python pilot and a native-extension pilot from actual submissions.
2. **Naming decision:** rerun with selected supported pip/uv versions; test Poetry, epoch/postrelease baselines and update bots. Decide canonical spelling, cumulative-fix policy, counter ownership and treatment of upstream local versions.
3. **Index trial:** exercise upload, normalized project lookup, HTML/JSON metadata, caching, yanking, hash verification and mixed-index conflicts on the intended repository manager. Offline wheel selection does not establish any of these.
4. **Build and adoption trial:** reproduce sdist-to-wheel builds and wheel installs on the declared Python/OS/ABI matrix. Cover locked and installed environments, extras, markers, transitive constraints, hash-pinned installation, upstream return and rollback.
5. **Attestation trial:** retain one valid end-to-end evidence bundle and negative cases for wrong digest, wrong publisher, invalid signature and missing evidence. Confirm the non-PyPI transport and OSERA trust mapping.
6. **Pre-Draft review:** review the accompanying profile sources, versions, override explanations and fixtures; decide compatibility scope and proposed pack inclusion through governance. Agree the year-end draft deliverable separately from ratification and gate deployment.

## Impact on existing sources

The three accompanying Pre-Drafts propose requirements without activating gates or adding pack members. Their parents receive versioned editorial discovery updates, and catalogs and effective profile relationships are regenerated. JavaScript publication/adoption Pre-Drafts receive editorial version bumps solely to keep their parent-version references accurate. Definitions, fitness guidance and a Python example describe the proposal. Existing lifecycle rules, evidence schemas, producer registry, ratified pack membership and historical snapshots remain unchanged.

REL-001 test binding, REL-004 producer policy, REL-007 provenance, FEED-001/002 identities and REL-009 effective checks were reviewed. No new evidence schema is claimed: the Python evidence fields are proposed contracts, and a complete machine-readable evidence/producer trust contract remains required before production use. A passing site build or merged proposal does not ratify Python requirements.
