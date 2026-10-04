---
title: Fitness Function
permalink: /fitness/
---

The v0.1.0 fitness function should measure alignment to a standard pack, not certify a provider or repository. This keeps the first gate useful for implementers without implying a mature accreditation regime before the working group has agreed one.

## Scope

The first fitness function evaluates a single patch repository and one published patch release against a named standards pack, for example `OSERA-SP-0.1.0`.

The result SHOULD identify the standards-pack version, each standard version tested, each check ID, the commit tested, the artifact digest when an artifact exists, the evidence inspected, and whether every check is `pass`, `warn`, `fail`, `not-tested`, `not-applicable`, or `manual-evidence-required`.

Blocking checks determine whether an artifact can claim `OSERA-SP-0.1.0` alignment. Observe-mode checks SHOULD run during the same gate, but their results collect implementation data for `OSERA-SP-0.2.0` and SHOULD NOT block the v0.1.0 gate unless included as blocking checks in a later ratified pack.

## Blocking checks

The following checks define OSERA-SP-0.1.0 alignment. REL-003 is the generic naming requirement; REL-003-JAVA supplies the Java specialization. For Java, same-number profile checks replace the corresponding base checks, as described in the [profile lifecycle]({{ site.baseurl }}/lifecycle/#profile-extension-and-overrides).

| Standard | v0.1.0 check |
| --- | --- |
| STD-001 | Standard sources carry validated metadata and generate current catalogs with valid pack and check references. |
| FORK-001 | Repository is public under `finos-osera` and named `patch-<upstream-or-artifact-name>`. |
| FORK-002 | Patch work happens on a `patch/<version>` branch for the supported line. |
| FORK-003 | Baseline source commit is tagged `v<VERSION>+patch.baseline`. |
| SRC-002 | Backport evidence links to upstream commit, commit range, pull request, advisory, or release note. |
| SRC-003 | New files match the nearest existing file of the same type in the same module, ignoring years and whitespace; result is `not-applicable` where no local header convention exists. |
| REL-001 | Release evidence records tested commit, runtime, test command or suite, published unit-test report artifact, and no failed tests. |
| REL-002 | Release evidence records bytecode level and how it was checked against the prior released artifact. |
| REL-003 | Release tag, artifact version, vulnerability feeds, and release evidence use the applicable patch version naming profile, or the default SemVer form where no profile exists. |
| REL-003-JAVA | Java release tag and artifact version use the ratified Java patch version naming pattern selected from compatibility evidence and match Maven/feed purls. |
| REL-004 | Producer identity is approved for the targeted standards pack and recorded in release evidence. |
| REL-005 | Package files, checksums, and package metadata are present and internally consistent. |
| FEED-001 | OpenVEX and CycloneDX feed data can identify vulnerability, patched artifact, release, baseline, and provenance. |

## Advisory and observe checks

| Standard | Mode | Check |
| --- | --- |
| EVD-001 | Observe | Recipient guidance describes what changed and what surface area should be tested using schema version `0.1.0`, once the expected format is defined. |
| FORK-004 | Observe | Repository is fully public, publicly fetchable, hosted in the appropriate official fork, and released under the same applicable upstream open-source license terms. |
| SRC-001 | Observe | Patch basis classification vocabulary and minimum provider wording are present once defined by the working group. |
| REL-006 | Observe | Release has a backlog item, public request, sponsor record, or equivalent authorization record. |
| REL-007 | Observe | Producer signs an attestation linking artifact digest to source tag and release evidence, while preserving reproducible builds as the longer-term goal. |
| REL-008 | Observe | Build-security scan evidence identifies tooling, scope, results, and unresolved high-risk findings where ecosystem-appropriate scanning is available. |
| APP-001 | Observe | Feed and metadata support estate-wide automated discovery and application. |

## Output shape

The example below illustrates a partial CI result with only FORK-003 evaluated; the remaining blocking checks have not been tested, so the overall result is `not-tested`. Java implementations use the REL-003-JAVA release naming pattern.

```json
{
  "standard_pack": "OSERA-SP-0.1.0",
  "pack_checksum": "sha256:...",
  "registry_ref": "OSERA-SP-0.1.0",
  "repository": "finos-osera/patch-example",
  "release": "v1.2.3.1-osera-00001",
  "commit": "...",
  "artifact_digest": "sha256:...",
  "producer": "example-producer",
  "producer_accounts": {
    "registry": {
      "staging_account": "example-producer-upload",
      "github_users": ["example-maintainer"]
    },
    "observed": {
      "tag_actor": "example-maintainer",
      "upload_account": null
    }
  },
  "result": "not-tested",
  "standards": [
    { "standard": "FORK-003", "standard_version": "0.1.0", "status": "pass" }
  ],
  "checks": [
    {
      "standard": "FORK-003",
      "standard_version": "0.1.0",
      "requirement": "FORK-003.REQ-001",
      "check": "FORK-003.CHECK-001",
      "status": "pass",
      "expected": "tag v1.2.3+patch.baseline exists and resolves to the unpatched baseline source commit",
      "observed": "v1.2.3+patch.baseline resolves to commit ...",
      "evidence": [
        { "command": "git rev-parse --verify v1.2.3+patch.baseline^{commit}", "exit": 0, "output": "<baseline commit SHA>" }
      ]
    }
  ]
}
```

`checks` records each evaluated check by check ID and its associated requirement ID; `standards` summarizes the evaluated checks for each standard. `expected` states the rule with the actual values, `observed` describes what the repository showed, and `evidence` records the supporting commands and outputs. Resolving the baseline tag demonstrates that it points to a commit; evidence identifying that commit as the unpatched source state is also needed.

Result summaries must respect the targeted pack's check roles and severities. A failed blocking check prevents alignment. Advisory and observe-only findings remain visible but do not become blocking failures through the standard or overall summary. A blocking check marked `not-tested` or `manual-evidence-required` remains unresolved and cannot support an alignment claim until the required evaluation or review is completed. A `not-applicable` result needs an evidence-backed explanation permitted by the relevant standard; it must not silently waive a required check. A warning does not waive an unresolved blocking requirement. Only a complete evaluation satisfying all applicable blocking checks can support alignment.

`producer_accounts.registry` is copied from the matched registry entry at `registry_ref`; `producer_accounts.observed` records what the run and the gate saw. The CI result may leave `upload_account` as `null` without failing REL-004. The gate records the observed upload account in its verdict, alongside the CI evidence and its own artifact checks. Differences between registry account metadata and observed actors are recorded but do not block in 0.1.0.

The signed fitness-result contract and its verification behavior are tracked in [#57](https://github.com/finos-osera/remediation-standards/issues/57) for 0.2.0. This example does not add a blocking signature-verification requirement to 0.1.0.

## Certification posture

For v0.1.0, the working group SHOULD use "OSERA-SP-0.1.0 aligned" only when a repository publishes the fitness result and all blocking checks pass. The working group SHOULD NOT use "certified" until it has agreed reviewer identity, evidence retention, revocation, dispute handling, and trademark or badge rules.
