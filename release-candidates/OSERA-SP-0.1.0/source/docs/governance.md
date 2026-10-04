---
title: Governance
permalink: /governance/
---

OSERA Remediation Standards follow the repository's Community Specification governance and contribution process.

OSERA-SP-0.1.0 was ratified on **Thursday, September 10, 2026**. It records the standard versions used by the September 20 alignment gate. Changes are reviewed through pull requests and incorporated into subsequent pack releases under the [standard lifecycle]({{ site.baseurl }}/lifecycle/).

## Versioning model

Each standard carries its own version. A standards pack records the exact standard versions included in a candidate or ratified release set.

This lets the working group revise one standard without implying that every other standard changed. For example, `REL-003` could move from `0.1.0` to `0.2.0` and then be included in a later standards pack while `FORK-001` remains unchanged.

The [standard lifecycle]({{ site.baseurl }}/lifecycle/) defines when to reuse an existing identifier, when to create a new identifier, and when to create a standards pack.

## Alignment and certification

OSERA-SP-0.1.0 defines standards-pack alignment. It does not establish provider certification.

Repositories can publish a fitness result showing that they are aligned to a named standards pack. The working group should defer "certified" claims until it has agreed reviewer authority, evidence retention, revocation, dispute handling, and badge or trademark rules.

## Contribution focus

Useful contributions include:

* evidence from additional backpatch providers;
* recipient requirements from enterprise remediation teams;
* feed examples for OpenVEX and CycloneDX;
* examples of "what changed" and "what surface area should we test" metadata;
* acceptance checks for bytecode level, baseline tags, provenance links, and version metadata.

## Licensing note

The repository's [license and contribution documents](https://github.com/finos-osera/remediation-standards/blob/main/CONTRIBUTING.md) govern contributions and use of the material.
