---
title: Definitions
permalink: /definitions/
---

## Patch

A security or reliability change applied to an upstream software line for OSERA-compatible remediation.

## Backpatch

A patch applied to an older software line that is not receiving the same fix through normal upstream maintenance. This remains a useful descriptive term, but the proposed OSERA naming conventions use `patch-*`, `patch/`, and `+patch.baseline` so the standards can cover broader remediation workflows.

## Patch provider

An organization or participant that produces, validates, publishes, or contributes OSERA-compatible patches.

## Recipient

An enterprise, vendor, or other downstream consumer that evaluates and applies OSERA-compatible patches.

## Baseline tag

The tag identifying the original source state from which a patch line begins, using the `v<VERSION>+patch.baseline` scheme.

## Remediation set

An immutable, versioned set of exact artifact versions and associated remediation evidence, with a supported adoption procedure and declared dependency scope under [REL-009]({{ site.baseurl }}/standards/rel-009-line-release-and-bom-propagation/). Its representation is defined by the applicable ecosystem profile.

## Line

In [REL-009-JAVA]({{ site.baseurl }}/standards/rel-009-java-line-release-and-bom-propagation/), the set of artifacts an upstream project releases together under one version: a BOM and the artifacts it manages at its own version, or a BOM-less set that downstream BOMs version through one property. A line is the unit a patch releases, and every supported BOM that pins it releases again to pin the new version.

## Approved producer

A producer approved by the standards group or other agreed OSERA governance process to publish official OSERA artifacts for a named standards pack.

## Patch basis

The reason and source for a patch change. A patch basis can be an upstream commit backported to an older line, or a provider-developed fix where no upstream fix exists.

## Recipient evidence

Metadata and human-readable guidance that helps recipients understand what changed, why it changed, and what they should test before adopting the patch.

## JavaScript package profile (proposed)

The `-JAVASCRIPT` profiles specialize generic requirements for npm ecosystem packages, including TypeScript libraries published as JavaScript. The proposed [JavaScript remediation set]({{ site.baseurl }}/standards/rel-009-javascript-coordinated-adoption/) binds exact package identities and digests to supported consumer changes; it does not inherit Java's BOM or whole-line republication mechanism. See the [PR review brief](https://github.com/finos-osera/remediation-standards/pull/99#issuecomment-6321428330) for experimental status and evidence gaps.

## Python distribution and import identity

A Python distribution is the installable project identified by its normalized distribution name and version. Its import names may differ, and several distributions can contribute portions of a shared import namespace. Neither an import namespace nor a dotted distribution name is an authenticated publisher scope. The proposed [Python adoption profile]({{ site.baseurl }}/standards/rel-009-python-coordinated-adoption/) records distribution, import, source repository and approved artifact origin mappings separately.

## Python package profiles proposed

The `-PYTHON` Pre-Drafts propose [local-version naming]({{ site.baseurl }}/standards/rel-003-python-patch-version-naming/), [wheel and sdist publication]({{ site.baseurl }}/standards/rel-005-python-artifact-publication/) and [coordinated adoption]({{ site.baseurl }}/standards/rel-009-python-coordinated-adoption/). They have no assigned pack or active gate. Python purls identify the distribution without a publisher namespace; repository origin and individual file digests remain separate evidence. See the [research and parent audit]({{ site.baseurl }}/research/python-ecosystem/).
