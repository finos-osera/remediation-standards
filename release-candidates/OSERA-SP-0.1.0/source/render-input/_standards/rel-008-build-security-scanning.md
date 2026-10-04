---
schema-version: 0.1.0
sequence: 280
standard_id: REL-008
title: Build Security Scanning
summary: Patch release builds should be checked for build-tool, dependency, and
  pipeline-injection risks before publication.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: OSERA-SP-0.2.0 observe
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Observe-only check
type: REL
category: Release Process
applies-to:
- Patch providers
- Repository operators
- Enterprise recipients
requirements:
- id: REL-008.REQ-001
  level: SHOULD
  text: Patch providers should run build-security scanning appropriate to the package
    ecosystem before publishing an official patched artifact.
  checkability: partially-automated
  checks:
  - id: REL-008.CHECK-001
    title: Build-security scan evidence is present
    type: release-evidence
    severity: observe
    implementation: osera-fitness.rel008.build_security_scan
    evidence:
    - build_security_scan_tool
    - scan_scope
    - scan_result
- id: REL-008.REQ-002
  level: SHOULD
  text: Build-security evidence should identify unresolved high-risk findings or
    explain why the selected tooling is not applicable to the patched project.
  checkability: manual
  checks:
  - id: REL-008.CHECK-002
    title: Build-security findings are dispositioned
    type: release-evidence
    severity: observe
    implementation: osera-fitness.rel008.finding_disposition
    evidence:
    - unresolved_findings
    - finding_disposition
    - not_applicable_rationale
---

## Requirement

Patch providers SHOULD run build-security scanning appropriate to the package ecosystem before publishing an official patched artifact.

Build-security evidence SHOULD identify unresolved high-risk findings or explain why the selected tooling is not applicable to the patched project.

## Rationale

Build files, dependency resolution, and release pipelines can become part of the attack surface for patched artifacts. The working group should observe whether implementers can consistently scan for risks such as unsafe build plugins, dependency confusion exposure, script injection, tampered wrappers, unexpected network fetches, and publish-time credential leakage.

This is not proposed as a blocking SP-0.1.0 requirement because tooling differs by ecosystem and repository age. The first step should be to collect evidence about which checks are practical across representative patch repositories, then decide whether a narrower enforceable subset belongs in OSERA-SP-0.2.0.

Scanner expectations should be informed by the member tooling survey in [finos-osera/operations-taskforce#6](https://github.com/finos-osera/operations-taskforce/issues/6), with responses requested by September 4, 2026.

## Observe-mode evidence

Observe-mode evidence SHOULD include:

* patched coordinate and source tag;
* build system and package ecosystem;
* build-security scan tool or manual review method;
* scan scope, including build files, wrappers, plugins, dependency resolution, and publication pipeline where applicable;
* scan result;
* unresolved high-risk findings;
* rationale when scanning is not applicable or no ecosystem-appropriate scanner is available.
