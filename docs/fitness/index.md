---
title: Fitness Function
permalink: /fitness/
---

The v0.1 fitness function should measure alignment to a standard pack, not certify a provider or repository. This keeps the first gate useful for implementers without implying a mature accreditation regime before the working group has agreed one.

## Scope

The first fitness function evaluates a single backpatch repository and one published backpatch release against a named standards pack, for example `OSERA-SP-0.1`.

The result SHOULD identify the standards-pack version, each standard version tested, the evidence inspected, and whether every check is `pass`, `warn`, `fail`, or `not-tested`.

## Candidate checks

| Standard | v0.1 check |
| --- | --- |
| FORK-001 | Repository is public under `finos-osera` and named `backpatch-<upstream-or-artifact-name>`. |
| FORK-002 | Backpatch work happens on a `backpatch/<version>` branch for the supported line. |
| FORK-003 | Baseline source commit is tagged `v<VERSION>+backpatch.baseline`. |
| SRC-001 | Evidence classifies the patch as upstream backport or provider-developed fix. |
| SRC-002 | Backport evidence links to upstream commit, commit range, pull request, advisory, or release note. |
| SRC-003 | New files added by the patch follow the surrounding license-header convention. |
| REL-001 | Release evidence records build tool, runtime, test command, and validation result. |
| REL-002 | Release evidence records bytecode level and how it was checked against the prior released artifact. |
| REL-003 | Release tag and artifact version use `<UPSTREAM_VERSION>+backpatch.NNN`. |
| FEED-001 | OpenVEX and CycloneDX feed data can identify vulnerability, patched artifact, release, baseline, and provenance. |
| EVD-001 | Recipient guidance describes what changed and what surface area should be tested. |

## Output shape

```json
{
  "standard_pack": "OSERA-SP-0.1",
  "repository": "finos-osera/backpatch-example",
  "release": "v1.2.3+backpatch.001",
  "result": "warn",
  "checks": [
    {
      "standard": "FORK-003",
      "standard_version": "0.1.0",
      "status": "pass",
      "evidence": "v1.2.3+backpatch.baseline resolves to commit ..."
    }
  ]
}
```

## Certification posture

For v0.1, the working group SHOULD use "OSERA-SP-0.1 aligned" only when a repository publishes the fitness result and all required checks pass. The working group SHOULD NOT use "certified" until it has agreed reviewer identity, evidence retention, revocation, dispute handling, and trademark or badge rules.
