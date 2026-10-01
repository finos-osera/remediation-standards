---
schema-version: 0.1.0
sequence: 320
standard_id: FEED-002
title: Artifact CycloneDX Document
summary: Every official OSERA artifact carries a CycloneDX document beside it that identifies
  the artifact, the upstream release it derives from, and the vulnerabilities it closes.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.2.0 required
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: FEED
category: Feeds and Advisories
applies-to:
- Patch providers
- Repository operators
- Enterprise recipients
requirements:
- id: FEED-002.REQ-001
  level: MUST
  text: Every official OSERA artifact must be published with a CycloneDX document beside
    it, at the ecosystem's convention for a document that accompanies a release, valid
    against the CycloneDX schema it declares, and readable by anyone who can read the
    artifact's metadata.
  checkability: automated
  checks:
  - id: FEED-002.CHECK-001
    title: A valid CycloneDX document accompanies every published artifact
    type: artifact
    severity: blocking
    implementation: osera-fitness.feed002.document_present
    evidence:
    - cyclonedx_document
    - artifact_files
    - spec_version
- id: FEED-002.REQ-002
  level: MUST
  text: The document's subject must be the artifact it accompanies, carrying the published
    package URL and, for each file the release publishes, hashes equal to the checksums
    published beside that file.
  checkability: automated
  checks:
  - id: FEED-002.CHECK-002
    title: The subject's package URL and hashes match the published artifact
    type: artifact
    severity: blocking
    implementation: osera-fitness.feed002.subject_identifies_artifact
    evidence:
    - purl
    - release_version
    - component_hashes
    - published_checksums
- id: FEED-002.REQ-003
  level: MUST
  text: The document must name the organization that produced it and the organization
    that publishes the coordinate, as a manufacturer and a publisher rather than as
    authors, and the manufacturer must be the approved producer of the release.
  checkability: automated
  checks:
  - id: FEED-002.CHECK-003
    title: Manufacturer and publisher name the producer and the distributor
    type: artifact
    severity: blocking
    implementation: osera-fitness.feed002.attribution
    evidence:
    - metadata_manufacturer
    - component_manufacturer
    - component_publisher
    - producer_identity
- id: FEED-002.REQ-004
  level: MUST
  text: The document's pedigree must identify the upstream release the artifact derives
    from, by package URL, by the checksums the upstream repository publishes for it,
    and by its declared licenses, and must carry one patch entry per vulnerability the
    release closes, naming the change that closes it and the advisory it resolves.
  checkability: automated
  checks:
  - id: FEED-002.CHECK-004
    title: The pedigree identifies the baseline and the change applied to it
    type: artifact
    severity: blocking
    implementation: osera-fitness.feed002.pedigree_identifies_ancestor
    evidence:
    - pedigree_ancestor
    - ancestor_hashes
    - baseline_tag
    - patch_changeset
    - vulnerability_id
- id: FEED-002.REQ-005
  level: MUST
  text: The document's vulnerabilities must be the ones the artifact carries a fix for,
    each affecting only that artifact, each in the state the fix actually reached, and
    never asserted as not affected.
  checkability: automated
  checks:
  - id: FEED-002.CHECK-005
    title: Vulnerability analysis is honest and scoped to the artifact
    type: artifact
    severity: blocking
    implementation: osera-fitness.feed002.analysis_state
    evidence:
    - vulnerability_statement
    - analysis_state
    - affects
---

Version strings in the examples are illustrative. Java release identifiers follow [REL-003-JAVA]({{ site.baseurl }}/standards/rel-003-java-patch-version-naming/).

## Requirement

Every official OSERA artifact MUST be published with a CycloneDX document beside it.

The document MUST identify the artifact it accompanies, name who produced and who publishes it, identify the upstream release it derives from, and state the vulnerabilities that release closes and how.

[FEED-001]({{ site.baseurl }}/standards/feed-001-openvex-cyclonedx/) is unchanged by this standard. The feeds remain the aggregate a scanner subscribes to; this is the same information at the artifact, for a consumer who never subscribes to anything.

## Why beside the artifact

A feed has to be found. A recipient points a scanner at a URL, a vulnerability-management product ingests it on a schedule, and someone has to know it exists to do either. Everything downstream of that first step works only for recipients who took it.

An artifact travels on its own. It is mirrored into a repository manager, proxied by a build, copied into an internal registry, and vendored into an image, and at each hop the files beside it come along. A document published beside the artifact reaches a data team that never heard of OSERA, because they already fetch what sits next to the file. Central supports exactly this for any publisher, at a well-known classifier, and repository managers already store and serve it.

The two are not alternatives. The feed answers "what has OSERA fixed"; the document answers "what is this file I am holding", which is the question a scanner is actually asking when it flags a coordinate its advisory database has never seen.

## The subject is the artifact

The document's `metadata.component` is the artifact it sits beside, at the package URL [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) defines, with hashes equal to the checksums [REL-005]({{ site.baseurl }}/standards/rel-005-artifact-publication-hygiene/) already requires beside each file.

Hashes are the point of the exercise. A patched coordinate is a version no advisory database recognizes, so a scanner that matches by coordinate falls back to the baseline and reports it as vulnerable. A scanner that matches by file digest has no such problem, and a document that carries the digests of the very files it accompanies lets a data team tie the two together without downloading anything: the digests are published beside the artifact, where the artifact itself may be entitled.

For the same reason the hashes MUST be the ones published beside the file rather than computed at some other time. A document that disagrees with the repository about what the bytes are is worse than one that says nothing.

Licenses belong to the subject too. A patch is upstream's code with a fix applied, released under upstream's terms, so the document declares the licenses the upstream release declares and marks them as declared rather than concluded.

## Who made it and who publishes it

A document written by a build is not authored by a person, and CycloneDX distinguishes the two. The document MUST carry `metadata.manufacturer`, not `metadata.authors`, and that manufacturer MUST be the approved producer of the release under [REL-004]({{ site.baseurl }}/standards/rel-004-approved-producers/), so the producer identity in the release evidence and the one in the document cannot drift apart.

The component carries two attributions, and they answer different questions:

* `manufacturer` is the organization that **created** the component: the producer that built the patched artifact.
* `publisher` is the organization that **distributes** that coordinate. For an official OSERA artifact, published through the OSERA Exchange, that is FINOS OSERA.

A producer that also publishes the same patch under coordinates of its own writes its own name as the publisher there, and FINOS OSERA on the artifacts it submits to the Exchange. The manufacturer does not change between them: the same organization built both.

## The ancestor

`pedigree.ancestors` MUST identify the upstream release the patch stands on, not merely name it. That means its package URL, the checksums the upstream repository publishes for it, its declared licenses, and a reference to the file, so a reader holding the document alone can fetch the ancestor and confirm it is the release the pedigree claims.

This is what makes the unchanged members of a line checkable. [REL-009]({{ site.baseurl }}/standards/rel-009-line-release-and-bom-propagation/) requires a line to release whole, with unchanged members shipping upstream's bytes under a new version, and `REL-009.CHECK-002` verifies that by comparing checksums. When the ancestor's checksum and the subject's are both in the document, an unchanged member proves itself: the two are equal, and the pedigree carries no patches.

`pedigree.patches` MUST carry one entry per vulnerability the release closes, each naming the change that closes it — the commit or commit range on the patch repository, under [SRC-002]({{ site.baseurl }}/standards/src-002-provenance-links/) — and resolving an issue that identifies the advisory: its identifier, its name, and a description of what was done about it, with the source that documents it.

## The vulnerabilities it closes

The document's `vulnerabilities` are the ones this artifact carries a fix for, each affecting only this artifact, each in the state the fix actually reached: a fix ported onto the baseline is `resolved_with_pedigree`, a vulnerability closed by taking an upstream release is `resolved`.

An OSERA document MUST NOT assert `not_affected` for a vulnerability that a fix closed. The state is checkable, some products honor one state and not another, and a producer that mislabels a fix to make a finding disappear has made the feed and the document worthless as evidence. This is the same commitment FEED-001 makes for the feeds, restated here because the document travels further than the feed does.

## Spec version and redistribution

The document MUST be valid against the CycloneDX version it declares, and that version MUST be 1.6 or later. Documents that declare 1.7 or later SHOULD carry `metadata.distributionConstraints.tlp` of `CLEAR`: a document published beside a public artifact is redistributed by everyone who mirrors that artifact, and the classification is where CycloneDX lets a producer say so.

Each artifact SHOULD also carry the line and release properties `REL-009` describes, `osera:line` and `osera:release`, and a BOM SHOULD carry one `osera:cause` per vulnerability its release closes.

## Example

A patched artifact, abbreviated to the fields this standard requires:

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.7",
  "version": 1,
  "metadata": {
    "timestamp": "2026-09-16T00:00:00Z",
    "manufacturer": {
      "name": "Example Producer, Inc.",
      "url": ["https://producer.example.org"]
    },
    "distributionConstraints": { "tlp": "CLEAR" },
    "component": {
      "type": "library",
      "bom-ref": "pkg:maven/org.example/example-lib@1.0.0.1-osera-00001",
      "manufacturer": { "name": "Example Producer, Inc." },
      "publisher": "FINOS OSERA",
      "group": "org.example",
      "name": "example-lib",
      "version": "1.0.0.1-osera-00001",
      "hashes": [
        { "alg": "SHA-1", "content": "527a337cd36d2468b160a2a42d42cf70b47c75f0" },
        { "alg": "SHA-256", "content": "43a743416e67024b312007a3bcc98355192522b8e378d502eb9c3e5947468a14" }
      ],
      "licenses": [
        { "license": { "id": "Apache-2.0", "acknowledgement": "declared" } }
      ],
      "purl": "pkg:maven/org.example/example-lib@1.0.0.1-osera-00001",
      "pedigree": {
        "ancestors": [
          {
            "type": "library",
            "publisher": "The Example Software Foundation",
            "group": "org.example",
            "name": "example-lib",
            "version": "1.0.0",
            "hashes": [
              { "alg": "SHA-1", "content": "fa43ba4467f5300b16d1e0742934149bfc5ac564" }
            ],
            "licenses": [
              { "license": { "id": "Apache-2.0", "acknowledgement": "declared" } }
            ],
            "purl": "pkg:maven/org.example/example-lib@1.0.0",
            "externalReferences": [
              {
                "type": "distribution",
                "url": "https://repo1.maven.org/maven2/org/example/example-lib/1.0.0/example-lib-1.0.0.jar"
              }
            ]
          }
        ],
        "patches": [
          {
            "type": "backport",
            "diff": { "url": "https://github.com/finos-osera/patch-example-lib/commit/61c0d7b" },
            "resolves": [
              {
                "type": "security",
                "id": "CVE-2026-0001",
                "name": "Example Lib: unescaped characters in the XML layout lose log events",
                "description": "The upstream fix for CVE-2026-0001 ported onto example-lib 1.0.0 and released as 1.0.0.1-osera-00001.",
                "source": { "name": "NVD", "url": "https://nvd.nist.gov/vuln/detail/CVE-2026-0001" }
              }
            ]
          }
        ],
        "notes": "1.0.0 with the fix for CVE-2026-0001 ported."
      }
    }
  },
  "vulnerabilities": [
    {
      "bom-ref": "CVE-2026-0001",
      "id": "CVE-2026-0001",
      "source": { "name": "NVD", "url": "https://nvd.nist.gov/vuln/detail/CVE-2026-0001" },
      "analysis": {
        "state": "resolved_with_pedigree",
        "response": ["update"],
        "detail": "The upstream fix for CVE-2026-0001 ported onto example-lib 1.0.0 and released as 1.0.0.1-osera-00001."
      },
      "affects": [{ "ref": "pkg:maven/org.example/example-lib@1.0.0.1-osera-00001" }]
    }
  ]
}
```

An unchanged member of the same line is the same document without `patches` and without `vulnerabilities`, and with a subject whose hashes equal its ancestor's.

## Evidence

For Maven-style releases, the document is published in the version directory at the classifier the ecosystem uses for it, `<artifact>-<version>-cyclonedx.json`, beside the POM, with the checksums and signature REL-005 requires of any published file. Other ecosystems use their own convention for a file that accompanies a release; the requirement is that it travels with the artifact and is fetchable by anyone who can fetch the artifact's metadata.

Release evidence SHOULD include:

* the document and its checksums and signature;
* the package URL and the checksums of every file the release published;
* the baseline tag the pedigree's ancestor corresponds to;
* the changeset each patch names;
* the vulnerability identifiers the release closes.

`FEED-002.CHECK-002` and `FEED-002.CHECK-004` read checksums rather than files: the gate never needs the jar, which matters when the jar is entitled and its metadata is not.

## Alternatives considered

**The feeds alone.** FEED-001 already requires OpenVEX and CycloneDX feeds, and a recipient who subscribes to them learns everything this document says. It is the artifact in someone else's repository manager that the feeds cannot reach, and a mirrored artifact with no document beside it is indistinguishable from an unpatched one.

**A document per release rather than per artifact.** One document listing every member of a line is smaller in total and says the same things. It also has to be found by a consumer holding one jar, which returns us to the feed's problem one level down. Per artifact, the document is where the file is.

**A dependency graph in the document.** A full SBOM of the artifact's own dependencies is what most CycloneDX documents carry, and it is deliberately not required here. The metadata already published with the artifact declares its dependencies, legacy builds frequently cannot run the tooling that would generate a graph faithfully, and a graph generated badly is worse than none. This standard requires the part a recipient cannot reconstruct: what the artifact is, where it came from, and what it fixes.

**SPDX instead.** A second format doubles the producer's work and the gate's. CycloneDX carries pedigree and vulnerability analysis in one document, which is the shape this standard needs, and FEED-001 already commits OSERA to it.

**Embedding the document in the archive.** A file inside the jar cannot be read without fetching the jar, which is exactly what an entitled distribution prevents, and changing the archive changes its digest. Beside the artifact, the document is readable by anyone and the artifact is untouched.
