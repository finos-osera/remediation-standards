---
title: Release Files and Test Report Binding
permalink: /examples/release-sidecars/
---

This example illustrates the **draft proposal for OSERA-SP-0.2.0**, tracked in [#78](https://github.com/finos-osera/remediation-standards/issues/78). It is not a ratified pack, a complete fitness result, or evidence of an actual accepted release.

## Standards and responsibilities

[REL-005]({{ site.baseurl }}/standards/rel-005-artifact-publication-hygiene/) defines the generic publication and acceptance-record obligations. [REL-005-JAVA]({{ site.baseurl }}/standards/rel-005-java-artifact-publication/) supplies the Maven/Gradle/JVM inventory and content checks. [REL-001]({{ site.baseurl }}/standards/rel-001-test-provenance/#test-report-digest-binding) binds the test report independently of the package ecosystem.

For a JAR publication whose upstream baseline includes POM, primary JAR, sources, javadoc and `.module`, all five counterparts are required for the patched coordinate. Each content file receives uploader, producer-signature and checksum verification. Checksums and detached signatures are verified as companions of those content files, without recursive signing.

For `org.example:sample:1.2.3.1-osera-00001`, the required content inventory is:

```text
sample-1.2.3.1-osera-00001.pom
sample-1.2.3.1-osera-00001.jar
sample-1.2.3.1-osera-00001-sources.jar
sample-1.2.3.1-osera-00001-javadoc.jar
sample-1.2.3.1-osera-00001.module
sample-1.2.3.1-osera-00001-tests.zip   # OSERA test evidence
```

A POM-only BOM whose upstream has none of the JAR sidecars needs its patched POM and the test-evidence reference permitted by REL-001; it does not need empty JARs. The gate records that packaging exception. It still carries any sidecars upstream actually published.

## Producer evidence extension

Add the version and report digest to the existing evidence file. Other fields remain subject to their respective standards. The report digest below is a placeholder; compute the real digest from the completed report before committing evidence and tagging.

```yaml
evidence-version: "0.2.0"
tests:
  commit: "1111111111111111111111111111111111111111"
  command: "mvn -B test"
  runtime: "OpenJDK 8"
  report: "sample-1.2.3.1-osera-00001-tests.zip"
  report_sha256: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  result: pass
```

The [binding-extension schema]({{ site.baseurl }}/schemas/osera-test-report-binding-0.2.0.schema.json) checks the version, name and digest syntax. It deliberately allows other cross-standard evidence fields. Schema validation alone does not verify the report or prove tests passed.

An inherited report also records `tests.repository` and `tests.release`; its name, digest and tested commit match the tested release's retained evidence. Both fields are required together. The gate retrieves that report at its original release and verifies its digest-bound evidence. It cannot substitute the consuming BOM's repository just because the filenames are the same.

## Verified coverage

The signed fitness result covers the report identity and digest either directly or through a digest of the exact evidence-file bytes. The gate checks the signature, signer authorization, evidence digest if referenced, and actual report digest. The signature contract remains under [#57](https://github.com/finos-osera/remediation-standards/issues/57); this example does not choose an envelope or claim that the current tooling implements the new checks.

For sources, the gate records the source roots and maps each entry to the tagged fork's files. `org/example/Parser.java` must match the corresponding patched source byte for byte. The manifest and generated files are separately listed with their digest and build origin. Missing declared source inputs or a tracked file relabeled as generated fail the check.

For `.module`, each variant's `files` entry identifies the actual promoted file by `name`, resolved `url`, `size` and `sha256`. Reusing upstream metadata pointing to the unpatched JAR fails even if the `.module` file itself has a valid producer signature.

## Acceptance record

The final gate record retains the promoted artifact digests, source tag and resolved commit, exact pack definition/checksum, individual standard versions, effective checks and results, producer and upload identities, signature-verification evidence, source comparison, generated-entry inventory, module references and test-report verification. It also records files left in staging.

For this proposal, the standards to include in a future pack are REL-005 0.2.0, REL-005-JAVA 0.1.0 and REL-001 0.2.0. The JVM effective publication checks are REL-005-JAVA.CHECK-001, inherited REL-005.CHECK-002/003/004, and added REL-005-JAVA.CHECK-005/006. Report binding adds REL-001.CHECK-003 alongside the applicable existing test-provenance checks. A stored verdict must enumerate full IDs, not this abbreviated notation.

## Review cases

These are acceptance criteria for the fitness/exchange implementation, not claims of live gate test coverage.

| Case | Expected outcome under the proposed checks |
| --- | --- |
| Upstream publishes a sources JAR, but the patched counterpart is missing | Block promotion of the required release set, including the primary JAR. |
| Source JAR contains the upstream version of a patched file | Fail source comparison. |
| ZIP timestamp/compression differs but extracted source bytes match | Source comparison may pass. |
| Manifest or generated source is listed with digest and build origin | Allowed as a reported build addition; no claim of reproducible generation. |
| Tracked source mismatch is labeled generated | Fail; a declaration cannot waive the comparison. |
| Empty source JAR omits declared source inputs | Fail. |
| `.module` contains the wrong JAR name, URL, size or SHA-256 | Fail the module check. |
| Two Gradle variants refer to the same correct promoted JAR | Pass their file-reference checks. |
| Non-`pom` upstream release has no sources or javadoc JAR | Do not require either sidecar; their absence does not fail acceptance. |
| Upstream has no sources, javadoc or `.module`, but the producer supplies them voluntarily | Permit publication when the applicable identity, integrity and content checks pass. |
| Voluntary sources JAR contains mismatched tracked source | Fail the applicable source comparison; optional publication does not waive validation. |
| Neither release has `.module` | Module check is not applicable, supported by inventory evidence. |
| POM-only BOM has no upstream sources/javadoc | Do not require synthetic JARs. |
| Javadoc content is not regenerated, but identity/binding checks pass | No additional javadoc content comparison is imposed by this proposal. |
| Sidecar uploader or producer signature differs from the required identity | Block promotion. |
| Report filename matches but bytes differ from its recorded digest | Fail REL-001.CHECK-003. |
| Digest syntax is valid but its signature coverage is missing | Fail REL-001.CHECK-003. |
| Inherited report is only tied by filename in the tested release's evidence | Cannot satisfy the new report-binding check; earlier acceptance remains valid. |
| Unknown extra upload accompanies an otherwise valid set | Keep the extra in staging, report it, and permit the valid required set. |
| Existing release was accepted under OSERA-SP-0.1.0 | Preserve that verdict; no automatic republishing or retrospective failure. |

Before ratification, the fitness and exchange maintainers need to implement the checks, agree the signed-result verification contract with #57, and demonstrate these cases. The next pack must explicitly select the proposed standard versions and effective checks; publishing these draft pages does not activate them.
