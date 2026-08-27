---
title: Fitness Function
permalink: /fitness/
---

The v0.1.0 fitness function should measure alignment to a standard pack, not certify a provider or repository. This keeps the first gate useful for implementers without implying a mature accreditation regime before the working group has agreed one.

## Scope

The first fitness function evaluates a single patch repository and one published patch release against a named standards pack, for example `OSERA-SP-0.1.0`.

The result SHOULD identify the standards-pack version, each standard version tested, each check ID, the commit tested, the artifact digest when an artifact exists, the evidence inspected, and whether every check is `pass`, `warn`, `fail`, `not-tested`, `not-applicable`, or `manual-evidence-required`.

Blocking checks determine whether an artifact can claim `OSERA-SP-0.1.0` alignment. Observe-mode checks SHOULD run during the same gate, but their results collect implementation data for `OSERA-SP-0.2.0` and SHOULD NOT block the v0.1.0 gate unless promoted by the standards group.

## Blocking checks

| Standard | v0.1.0 check |
| --- | --- |
| FORK-001 | Repository is public under `finos-osera` and named `patch-<upstream-or-artifact-name>`. |
| FORK-002 | Patch work happens on a `patch/<version>` branch for the supported line. |
| FORK-003 | Baseline source commit is tagged `v<VERSION>+patch.baseline`. |
| SRC-002 | Backport evidence links to upstream commit, commit range, pull request, advisory, or release note. |
| REL-001 | Release evidence records runtime, test command or suite, test result, and any published test report. |
| REL-002 | Release evidence records bytecode level and how it was checked against the prior released artifact. |
| REL-003 | Official OSERA release tag and artifact version use `<UPSTREAM_VERSION>+osera-patch.NNN` and match feed purls. |
| REL-004 | Producer identity is approved for the targeted standards pack and recorded in release evidence. |
| REL-005 | Package files, checksums, and package metadata are present and internally consistent. |
| FEED-001 | OpenVEX and CycloneDX feed data can identify vulnerability, patched artifact, release, baseline, and provenance. |

## Advisory and observe checks

| Standard | Mode | Check |
| --- | --- |
| EVD-001 | Observe | Recipient guidance describes what changed and what surface area should be tested using schema version `0.1.0`, once the expected format is defined. |
| FORK-004 | Observe | Repository is fully public, publicly fetchable, hosted in the appropriate official fork, and released under the same applicable upstream open-source license terms. |
| SRC-001 | Observe | Patch basis classification vocabulary and minimum provider wording are present once defined by the working group. |
| SRC-003 | Observe | New files follow the surrounding license-header convention where that convention is determinable, with manual review or not-applicable rationale otherwise. |
| REL-006 | Observe | Release has a backlog item, public request, sponsor record, or equivalent authorization record. |
| REL-007 | Observe | Producer signs an attestation linking artifact digest to source tag and release evidence, while preserving reproducible builds as the longer-term goal. |
| REL-008 | Observe | Build-security scan evidence identifies tooling, scope, results, and unresolved high-risk findings where ecosystem-appropriate scanning is available. |
| APP-001 | Observe | Feed and metadata support estate-wide automated discovery and application. |

## Output shape

```json
{
  "standard_pack": "OSERA-SP-0.1.0",
  "pack_checksum": "sha256:...",
  "repository": "finos-osera/patch-example",
  "release": "v1.2.3+osera-patch.001",
  "commit": "...",
  "artifact_digest": "sha256:...",
  "producer": "example-producer",
  "result": "warn",
  "signature": "...",
  "checks": [
    {
      "standard": "FORK-003",
      "standard_version": "0.1.0",
      "status": "pass",
      "evidence": "v1.2.3+patch.baseline resolves to commit ..."
    }
  ]
}
```

## Certification posture

For v0.1.0, the working group SHOULD use "OSERA-SP-0.1.0 aligned" only when a repository publishes the fitness result and all blocking checks pass. The working group SHOULD NOT use "certified" until it has agreed reviewer identity, evidence retention, revocation, dispute handling, and trademark or badge rules.
