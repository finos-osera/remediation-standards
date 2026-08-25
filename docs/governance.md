---
title: Governance
permalink: /governance/
---

This repository starts from the Community Specification process and keeps the legal and contribution structure needed for an eventual standard.

The initial content is provisional and in active evaluation status. It is intended to be reviewed by OSERA starting members, patch providers, enterprise consumers, and the broader FINOS community. It has not been published as a formal FINOS standard.

## Proposed path

1. Capture current OSERA patch-production practice as provisional markdown-backed standards.
2. Propose a versioned `OSERA-SP-0.1` standards pack with individually versioned standards, inclusion rationale, deferred items, and a target decision date.
3. Collect implementation feedback from providers and consuming banks.
4. Split stable requirements from examples, tooling profiles, and implementation notes.
5. Move mature requirements through the Community Specification governance process.

## Versioning model

Each standard carries its own version. A standards pack records the exact standard versions included in a candidate or ratified release set.

This lets the working group revise one standard without implying that every other standard changed. For example, `REL-003` could move from `0.1.0` to `0.2.0` and then be included in a later standards pack while `FORK-001` remains unchanged.

The proposed [standard lifecycle]({{ site.baseurl }}/lifecycle/) defines when to reuse an existing identifier, when to create a new identifier, and when to create a standards pack.

## Alignment and certification

The v0.1 proposal should use alignment language, not certification language.

Repositories can publish a fitness result showing that they are aligned to a named standards pack. The working group should defer "certified" claims until it has agreed reviewer authority, evidence retention, revocation, dispute handling, and badge or trademark rules.

## Contribution focus

Useful contributions include:

* evidence from additional backpatch providers;
* recipient requirements from enterprise remediation teams;
* feed examples for OpenVEX and CycloneDX;
* examples of "what changed" and "what surface area should we test" metadata;
* acceptance checks for bytecode level, baseline tags, provenance links, and version metadata.

## Licensing note

The user proposal suggests starting with CC-BY-4.0 for draft written material, with the option to transition later to a formal standards license. The existing repository includes Community Specification governance documents that should be reviewed before ratification.
