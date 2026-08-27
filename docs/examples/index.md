---
title: Examples
permalink: /examples/
---

These examples are intentionally concise and implementation-oriented. They are meant to help providers publish consistent patch evidence and help enterprise recipients automate ingestion.

See also [OSERA Commit Evidence]({{ site.baseurl }}/examples/osera-commit-evidence/) for concrete examples from public `finos-osera/backpatch-*` repositories and [Backpatch Release Tags]({{ site.baseurl }}/examples/release-tags/) for the current release-tag inventory.

## Backpatch repository shape

```text
github.com/finos-osera/backpatch-spring-framework
  branch: backpatch/5.3.x
  tag: v5.3.39+backpatch.baseline
  release: v5.3.39+osera-patch.001
```

## Patch evidence bundle

```yaml
patch:
  provider: Moderne
  repository: https://github.com/finos-osera/backpatch-spring-framework
  branch: backpatch/5.3.x
  baseline_tag: v5.3.39+backpatch.baseline
  release_version: 5.3.39+osera-patch.001
  basis:
    type: upstream-backport
    upstream_commit: https://github.com/spring-projects/spring-framework/commit/example
  compatibility:
    bytecode_source: last-released-artifact
    bytecode_level: 8
  recipient_guidance:
    what_changed:
      - Tightened parsing of affected input path.
      - Added regression coverage for malicious payload handling.
    suggested_test_surface:
      - Applications using the affected parser or endpoint.
      - Integration tests that exercise custom serialization or deserialization.
      - Smoke tests for dependent frameworks that wrap the affected API.
```

## Feed statement sketch

OpenVEX and CycloneDX examples should identify the patched artifact, vulnerability, status, and provenance links. The exact schema should be maintained in feed-specific examples as the working group converges.

### OpenVEX-style example

```json
{
  "@context": "https://openvex.dev/ns/v0.2.0",
  "@id": "https://vex.example.org/openvex/example-1.0.0+osera-patch.001.json",
  "author": "Example Patch Provider <security@example.org>",
  "timestamp": "2026-07-10T00:00:00Z",
  "version": 1,
  "statements": [
    {
      "vulnerability": {
        "name": "CVE-2026-0001",
        "aliases": ["GHSA-example-example-example"]
      },
      "products": [
        {
          "@id": "pkg:maven/org.example/example-lib@1.0.0%2Bosera-patch.001",
          "identifiers": {
            "purl": "pkg:maven/org.example/example-lib@1.0.0%2Bosera-patch.001"
          },
          "hashes": {
            "sha-256": "..."
          }
        }
      ],
      "status": "fixed",
      "action_statement": "CVE-2026-0001 fixed by backporting the upstream fix onto the 1.0.0 baseline."
    }
  ]
}
```

### CycloneDX-style example

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.6",
  "version": 1,
  "vulnerabilities": [
    {
      "id": "CVE-2026-0001",
      "source": {
        "name": "NVD",
        "url": "https://nvd.nist.gov/vuln/detail/CVE-2026-0001"
      },
      "analysis": {
        "state": "resolved_with_pedigree",
        "detail": "Fixed by backporting the upstream fix onto the 1.0.0 baseline; see component pedigree."
      },
      "affects": [
        {
          "ref": "pkg:maven/org.example/example-lib@1.0.0%2Bosera-patch.001"
        }
      ]
    }
  ]
}
```
