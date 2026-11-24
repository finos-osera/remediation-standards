---
title: Python Remediation Pre-Draft Example
permalink: /examples/python-remediation/
---

This page accompanies the Python Pre-Drafts for [#123](https://github.com/finos-osera/remediation-standards/issues/123). It separates sourced public precedents from the illustrative OSERA example. The OSERA example is not a published package, active endpoint, approved producer, complete evidence schema or gate result.

## Public examples and the OSERA proposal

Sources reviewed November 24, 2026:

| Example | Evidence | How to interpret it |
| --- | --- | --- |
| `certifi==2021.10.8.post2+tuxcare` | [TuxCare ELS installation guide](https://docs.tuxcare.com/els-for-libraries/python-libraries/) | Vendor-documented security-patched distribution from its authenticated index; downloaded bytes and fixes were not independently verified |
| `<version>+tuxcare.N` | [TuxCare remediation guide](https://sc.tuxcare.cloud/guide/fix) | Documented vendor/counter convention for Python remediation builds |
| Wheel version suffix `+patched` or an added `.patched` | [Bazel rules_python source](https://github.com/bazelbuild/rules_python/blob/main/python/private/pypi/patch_whl.bzl) | Implementation behavior for patched wheel filenames; does not by itself validate embedded identity or integrity |
| `torch-1.12.1+cpu-cp310-cp310-linux_x86_64.whl` | [Public PyTorch wheel index](https://download.pytorch.org/whl/torch/) | Listed local-version build variant, not evidence of a security patch |
| `example-lib==1.4.1+osera.1` | Illustrative proposal below | Proposed OSERA naming, not an existing public release |

The TuxCare certifi form includes a public postrelease number; the OSERA proposal puts its counter entirely after the plus and preserves the baseline. The vendor examples do not establish a universal convention or approve any producer. PyTorch shows why an upstream local label must not be silently removed. Existing local baselines are outside the initial OSERA profile pending explicit rules and tests.

See the [research findings]({{ site.baseurl }}/research/python-ecosystem/#public-naming-precedents) and the [naming Pre-Draft's rationale]({{ site.baseurl }}/standards/rel-003-python-patch-version-naming/#public-naming-precedents) for the relationship to the proposed requirements.

## Identity and distribution files

| Field | Illustrative value |
| --- | --- |
| Normalized distribution | `example-lib` |
| Import package | `examplelib` |
| Upstream source repository | `https://github.com/example/example-library` |
| OSERA source fork | `https://github.com/finos-osera/patch-example-library` |
| Baseline version | `1.4.1` |
| Patched version | `1.4.1+osera.1` |
| Release tag | `v1.4.1+osera.1` |
| Python purl | `pkg:pypi/example-lib@1.4.1%2Bosera.1` |
| Wheel | `example_lib-1.4.1+osera.1-py3-none-any.whl` |
| Sdist, if upstream publishes it | `example_lib-1.4.1+osera.1.tar.gz` |

The fork name follows the source repository, not a guessed import or distribution spelling. The purl contains no publisher namespace. The evidence set separately records the configured approved index and download origins, filename, byte size and calculated SHA-256 for every artifact. Wheel and sdist hashes will differ. An `osera-` prefix would rename the distribution; adding `osera` to imports would change its interface.

## Coordinated adoption

Suppose the application installs a parent distribution whose dependency is `example-lib==1.4.1`. A provider-maintained constraints file can select the local release:

```text
# Illustrative constraints.txt
example-lib==1.4.1+osera.1
```

The supported procedure must configure the approved artifact source, apply the constraint alongside the application's requirements, update any controlling lockfile or hashed installation inputs, and verify the downloaded wheel and installed metadata. A constraint alone neither installs a package nor overrides an incompatible declaration. If the parent instead requires `example-lib===1.4.1`, this proposed adoption fails and requires a reviewed dependency change.

For repeatability, retain the complete resolved dependency set and hashes appropriate to the supported environment. Reinstall with the tool's frozen-lock or hash-enforced workflow, then compare the installed identities and bytes with the selected set. Do not promote the synthetic experiment to evidence for an untested member package.

## Gate review cases

| Observation | Proposed verdict |
| --- | --- |
| Name/version match, download origin not approved | Fail identity/adoption binding |
| Correct patched wheel but stale lock keeps upstream wheel | Fail REL-009.CHECK-006 |
| Baseline publishes native wheels but patched release provides only sdist | Fail REL-005-PYTHON.CHECK-001 |
| Shared namespace contributor disappears after install | Fail REL-005-PYTHON.CHECK-007 |
| Wheel digest and signature verify, but test-report digest is missing | Required REL-001 evidence remains unresolved |
| Publishing attestation present without source build provenance | No claim of source-to-binary proof; preserve REL-007 observe status |
| Sigstore identity supplied instead of mandatory REL-004 registry fields | No waiver; producer trust-model revision must be reviewed separately |

See [naming]({{ site.baseurl }}/standards/rel-003-python-patch-version-naming/), [publication]({{ site.baseurl }}/standards/rel-005-python-artifact-publication/), [adoption]({{ site.baseurl }}/standards/rel-009-python-coordinated-adoption/) and the [research evidence]({{ site.baseurl }}/research/python-ecosystem/). Existing pack membership and historical definitions are unchanged.
