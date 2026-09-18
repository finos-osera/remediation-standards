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
