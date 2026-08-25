---
sequence: 220
standard_id: REL-002
title: Bytecode Compatibility
summary: Patched artifacts preserve the bytecode level of the last released artifact unless an explicit exception is approved.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required evidence
type: REL
applies-to:
  - Patch providers
  - Enterprise recipients
---

## Requirement

Patch providers MUST guarantee that patched Java artifacts are released at the correct bytecode version.

The bytecode level SHOULD be determined from the last released artifact, not solely from the fork's build configuration.

## Rationale

Old source trees do not always encode the runtime compatibility level that enterprise consumers rely on. Publishing a patch at the wrong bytecode level can break consumers even when source tests pass.

## Acceptance check

The working group SHOULD define an automated publish-time check that compares bytecode level against the last released artifact for the same line.

## Evidence

Release evidence SHOULD include the bytecode level, how it was determined, and whether the published artifact was checked before release.

## Observed OSERA example

The `backpatch-logback` `backpatch/1.2.9` branch includes a compatibility-focused commit titled `ensure JDK 8 compatibility`:

<https://github.com/finos-osera/backpatch-logback/commit/a721d9c51643f0a9fd113a1a3bb4e25ad7a76e4e>

This is useful evidence, but a future standard should make runtime compatibility machine-verifiable at release time.
