---
schema-version: 0.1.0
sequence: 290
standard_id: REL-009
title: Line Release and BOM Propagation
summary: A patched artifact releases with every artifact in its line, and every
  supported BOM that pins the line releases again pinning the new version, so a
  recipient takes the fix by advancing one BOM version.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.2.0 required
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: REL
category: Release Process
applies-to:
- Patch providers
- Repository operators
- Enterprise recipients
requirements:
- id: REL-009.REQ-001
  level: MUST
  text: Patch providers must publish a line declaration in the line's repository
    naming the BOM or the artifact set that defines the line, its members, its
    upstream baseline, and the supported lines whose BOMs pin it.
  checkability: automated
  checks:
  - id: REL-009.CHECK-001
    title: Line declaration is present and complete against the upstream baseline
    type: repository
    severity: blocking
    implementation: osera-fitness.rel009.line_declaration
    evidence:
    - line_declaration
    - baseline_bom
    - pinning_bom_poms
    - line_members
- id: REL-009.REQ-002
  level: MUST
  text: A patch must release every member of its line at the line's next patched
    version, whether or not each member changed, shipping unchanged members as the
    upstream bytes with rewritten metadata.
  checkability: automated
  checks:
  - id: REL-009.CHECK-002
    title: Every line member is published at the release version, unchanged members byte for byte
    type: artifact
    severity: blocking
    implementation: osera-fitness.rel009.whole_line_release
    evidence:
    - line_release_version
    - member_artifact_versions
    - member_checksums
    - baseline_checksums
    - member_pedigree
- id: REL-009.REQ-003
  level: MUST
  text: After a line releases, every supported line whose BOM pins it must release
    at its own next patched version, with the BOM pinning the new version and no other
    managed version changed, bottom-up until every supported root has released.
  checkability: automated
  checks:
  - id: REL-009.CHECK-003
    title: A BOM release pins the current release of every supported line it manages and changes nothing else
    type: release
    severity: blocking
    implementation: osera-fitness.rel009.bom_repin
    evidence:
    - bom_pom
    - previous_bom_pom
    - bom_pin_diff
    - pinned_line_releases
  - id: REL-009.CHECK-004
    title: The fix has reached every supported root
    type: release
    severity: blocking
    implementation: osera-fitness.rel009.root_reached
    evidence:
    - vulnerability_statement
    - root_release_versions
---

## Requirement

Patch providers MUST publish a line declaration in the line's repository.

A patch MUST release every member of its line at the line's next patched version, whether or not each member changed. Unchanged members MUST ship upstream's bytes with only their metadata rewritten.

After a line releases, every supported line whose BOM pins it MUST release at its own next patched version, with the BOM pinning the new version below it and nothing else changed, bottom-up until every supported root has released. A patch is not aligned until the roots have released: `REL-009.CHECK-004` fails on a lower line's release until a release of every supported root names its vulnerability, so providers run the gate when the last root has released, not when the first line publishes.

## Lines

Spring Framework 5.3.39 is 22 artifacts, `spring-core`, `spring-web`, `spring-webmvc` and 19 more, published together at one version, plus a BOM, `spring-framework-bom`, that lists all 22 at 5.3.39. Rather than pin those 22 one at a time, Spring Boot's BOM sets one property, `spring-framework.version`, and imports the Framework BOM at that version, so an application that imports Boot's BOM takes all 22 from that one property.

This standard calls that unit a line: the artifacts an upstream project releases together under one version, and the BOM, if the project publishes one, that names them. Upstream builds and tests a line as a unit, downstream BOMs version it with a single property, and so a patch has to move it as a unit. A line takes one of two shapes.

**A BOM line** is a BOM and the artifacts it manages at its own version. `spring-framework-bom` is one; so is `jackson-bom` 2.13.5 with the 64 artifacts it manages through `${jackson.version}`. The members do not have to share the BOM's version string. `reactor-bom` 2020.0.47 ships `reactor-core` 3.4.41 and `reactor-netty` 1.0.48, and it is still one line, because upstream releases them together and a downstream BOM takes them together by importing it.

**An artifact line** is a set of artifacts released at one version with no BOM of their own. Tomcat publishes `tomcat-embed-core`, `tomcat-embed-el`, `tomcat-embed-websocket`, `tomcat-embed-jasper` and the rest of `org.apache.tomcat.embed:*` and `org.apache.tomcat:*` at one version, and Spring Boot manages every one of them through `tomcat.version`. The property does the job a BOM would.

A single artifact that a BOM pins on its own is not a line. Boot manages `snakeyaml` through `snakeyaml.version`, but nothing else is released at that version to move with it. Such an artifact is patched at its own coordinate with its own counter, and the BOM that pins it re-pins it, exactly as it would take a new upstream release.

### Which lines a patch supports

A patch request under [REL-006]({{ site.baseurl }}/standards/rel-006-patch-request-authorization/) names the lines it wants patched; OSERA Wave 1 named Spring Boot 2.7, Spring Framework 5.3 and Spring Security 5.7. The request implies more: every line a requested BOM pins in which an in-scope vulnerability names an artifact. Wave 1 implied twelve, from Tomcat to Logback. Together these are the supported lines: the ones released whole, and the ones whose BOMs release again when a line beneath them moves.

### Baselines

Each line stands on a baseline: the last release upstream made in that series, not the version a downstream BOM happens to pin. Boot 2.7.18 pins Framework 5.3.31, but upstream went on to publish 5.3.39, so the Framework line begins at 5.3.39 and every patch to it sits on top of every fix upstream shipped. A recipient who advances to the patched Boot moves Framework from 5.3.31 to 5.3.39 and the patch in one step.

### Versions

A release of a line is one counter, shared by the BOM and every member, in the [REL-003-JAVA]({{ site.baseurl }}/standards/rel-003-java-patch-version-naming/) form. Each member keeps its own baseline version in front of the counter: `spring-data-bom` `2021.2.18.1-osera-00003` pins `spring-data-commons` `2.7.18.1-osera-00003`, and the shared `00003` says they were released together. The counter and its tag live on the line's own repository under [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/), which for a BOM line is the BOM's repository.

## Propagation

Three relations join lines, and only one of them releases anything:

* **A pin** is a version in a BOM's `dependencyManagement`: an entry, a property, or an imported BOM. Whoever imports the BOM takes that version at every depth of their dependency graph. When a pinned line releases, the pinning BOM releases too.
* **A declared dependency** is the version in a member's own POM, what it was built against. Maven carries it transitively, but any BOM in the consumer's build overrides it, so nothing releases for it.
* **A use** is a package the member's bytecode references with no declaration a consumer resolves, optional or provided. Nothing releases for it either.

Declared dependencies and uses say what to test when a line moves. Pins say what to release.

Releases run bottom-up so each BOM names final numbers, and each release has one cause: one source change for one vulnerability, or one re-pin of a lower line to one version, which closes every vulnerability that version closes. A root is a line nothing pins; a line pinned by two roots releases on both.

Because a root's counter climbs once per cause anywhere beneath it, a root version is not a claim that the line is clean. `spring-boot-dependencies` at `-osera-00030` with no Boot code changed is the expected shape. Release evidence and feeds under [FEED-001]({{ site.baseurl }}/standards/feed-001-openvex-cyclonedx/) say which vulnerabilities each version closes, and only those.

### OSERA Wave 1

![Lines supported for OSERA Wave 1]({{ site.baseurl }}/assets/examples/wave-1-lines.svg)

Fifteen lines carried the OSERA Wave 1 vulnerabilities. The three filled boxes are the lines the request named; the other twelve are supported because a requested BOM pins them and a Wave 1 vulnerability names one of their artifacts. Rectangles are BOM lines, rounded boxes are artifact sets, and the count is the Wave 1 vulnerabilities in each line. Dark arrows are pins, read upward: Boot pins all fourteen lines below it directly, so every fix in the picture ends in a Boot release. Grey arrows are declared dependencies and dashed arrows are uses; they shaped the test matrix and released nothing.

Each cause, a source change for one vulnerability or a re-pin of one lower line, became one release of its line and one of Boot. The 121 vulnerabilities came to about fifty Boot releases, most of them republishing Boot's own 68 modules byte for byte with a rewritten BOM.

## What recipients do

Versions below are illustrative, in the REL-003-JAVA form; they are not an inventory of published releases. In each example, CVE-2025-24813 in `tomcat-embed-core` was closed by re-pinning the Tomcat line to upstream 9.0.99, which released Boot as `2.7.18.1-osera-00004`.

A Maven application under the Boot parent edits one version:

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>2.7.18.1-osera-00004</version>
</parent>
```

That edit moves `tomcat.version` to 9.0.99 for `tomcat-embed-core`, `tomcat-embed-el`, `tomcat-embed-websocket` and `tomcat-embed-jasper` together, and every other supported line to the version this Boot release pins. The build declares nothing about Tomcat.

A Maven application with its own corporate parent imports the BOM instead, and makes the same edit:

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>2.7.18.1-osera-00004</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

A Gradle application moves the plugin version, because the plugin is a member of the Boot line and imports `spring-boot-dependencies` at its own version; an application using `platform("org.springframework.boot:spring-boot-dependencies:...")` moves that coordinate instead:

```groovy
plugins {
    id 'org.springframework.boot' version '2.7.18.1-osera-00004'
    id 'io.spring.dependency-management' version '1.0.15.RELEASE'
}
```

An application on Spring Framework without Boot imports `spring-framework-bom`, and a Framework fix reaches it as `5.3.39.1-osera-00001` at that one coordinate, moving all 22 Framework artifacts. Framework's BOM pins no third parties, so an application on Framework alone already pins Tomcat with a property of its own, one for the whole line, and moves that property to 9.0.99. An application importing `spring-security-bom` alone takes Security's fix the same way and pins Framework itself, because Security's POMs keep declaring the upstream Framework version and a declared dependency releases nothing.

## Rationale

Recipients adopt patches through the coordinates they already declare, and both kinds of coordinate work. An application that depends on `spring-web` directly takes the patched `spring-web` at the same coordinate, one version edit, and its declared dependencies bring the rest of the Framework line along at the same counter. An application that declares a parent or a BOM takes the fix through that parent or BOM, one version edit again, because the line and every BOM above it were republished. Without that republishing, the second application threads the fix through its stack by hand, differently in every build, and ends up with an override block that records which artifacts had vulnerabilities rather than what the application depends on. Republishing moves that work to the provider, once, where it can be checked.

The cost is one release per BOM above each cause, most of it metadata. Under the Wave 1 graph that is one Boot release per cause, which is why every release names its cause: the counter alone cannot say what changed.

The checks block rather than observe because a provider who skips them saves nothing; the work moves to every recipient, in the override blocks and precedence contests the alternatives below describe. The gate is the one place it can be paid once.

## Evidence

The line declaration lives at the root of the patch branch in the line's repository, the fork that carries the counter and tag under [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/). Its format is for the working group; its content is the BOM or the artifact set, the members, the baseline, and the supported lines whose BOMs pin the line:

```yaml
line: tomcat-9.0
artifacts:
  - org.apache.tomcat:*
  - org.apache.tomcat.embed:*
members:
  - org.apache.tomcat.embed:tomcat-embed-core
  - org.apache.tomcat.embed:tomcat-embed-el
  - org.apache.tomcat.embed:tomcat-embed-jasper
  - org.apache.tomcat.embed:tomcat-embed-websocket
  - org.apache.tomcat:tomcat-annotations-api
  - org.apache.tomcat:tomcat-jdbc
  - org.apache.tomcat:tomcat-jsp-api
baseline: 9.0.121
pinned-by:
  - spring-boot-2.7
```

A BOM line names `bom` in place of `artifacts`, and may name `excludes`, artifacts the BOM manages at its own version that the line leaves out.

`REL-009.CHECK-001` reads the declaration against upstream on Central. Every member exists at the baseline. For a BOM line, every artifact the BOM manages at its own version is a member or excluded, so an omission cannot pass for a decision. For an artifact line, every artifact a pinning BOM manages through the line's property is a member.

`REL-009.CHECK-002` reads the release. Every member exists at the release version. An unchanged member's jar checksum equals the baseline's on Central, and the CycloneDX document beside it carries a pedigree whose ancestor is the baseline release and no patches; a changed member's pedigree lists each backport with the vulnerability it resolves. The check needs no jar, because the checksums are published with it.

`REL-009.CHECK-003` reads a BOM release and the release before it. The diff of managed versions names only supported lines, and each is pinned at that line's current release.

`REL-009.CHECK-004` reads the feed. The OpenVEX statement for the vulnerability the release closes names a release of every supported root that pins the line, directly or through the lines between. On a lower line's release it fails until the roots have released.

Each artifact's CycloneDX component SHOULD carry its line and release as properties, `osera:line` and `osera:release`, and a BOM's component SHOULD carry one `osera:cause` per vulnerability its release closes and a pedigree note saying whether a member changed or which lower line was re-pinned and at what version. These are for the reader with only a root number; the checks read the POMs, checksums and feed.

## Alternatives considered

Each alternative below gives up one requirement and is measured on the same application as above, a Boot 2.7.18 build taking the Wave 1 fixes: what it edits, and what its build then says.

### Patching one artifact of a line

Suppose CVE-2025-24813 had instead been fixed by publishing `tomcat-embed-core` alone at `9.0.121.1-osera-00001`. Boot manages `tomcat-embed-core`, `tomcat-embed-el`, `tomcat-embed-websocket`, `tomcat-embed-jasper`, `tomcat-jdbc` and the rest through the one property `tomcat.version`. Moving the property fails to resolve, because `tomcat-embed-el` does not exist at that version. Leaving it means a per-artifact override for `tomcat-embed-core` alone and a runtime of Tomcat modules at two versions that Tomcat never released or tested together. Every downstream BOM that manages the line through a property has the same problem, and every recipient solves it differently.

Releasing the whole line removes the problem at its source. `tomcat-embed-el` at `9.0.121.1-osera-00001` is upstream's 9.0.121 jar byte for byte with a rewritten POM, disclosed as such in its pedigree, so a scanner that matches by hash still sees the 9.0.121 jar. A version that exists for every member is what lets one property, and one BOM above it, carry the fix.

### Publishing only the patched coordinates

Had only the patched coordinates been published, the same Boot application would carry the Wave 1 fixes as overrides, one per line that had a vulnerability, found and maintained by hand:

```xml
<properties>
  <tomcat.version>9.0.99</tomcat.version>
  <spring-framework.version>5.3.39.1-osera-00001</spring-framework.version>
  <spring-security.version>5.7.14.1-osera-00001</spring-security.version>
  <jackson-bom.version>2.13.5.1-osera-00002</jackson-bom.version>
  <netty.version>4.1.135.Final</netty.version>
  <spring-data-bom.version>2021.2.18.1-osera-00001</spring-data-bom.version>
  <hibernate.version>5.6.15.Final-osera-00001</hibernate.version>
  <!-- and jetty, log4j2, logback, reactor-bom, spring-ldap, spring-ws, spring-graphql -->
</properties>
```

Every property is a coordinate that had a vulnerability, spelled the way this one build shape allows. The block works only under `spring-boot-starter-parent`: a property in an imported BOM resolves inside the BOM, so the BOM-import application needs a `dependencyManagement` entry per artifact placed ahead of the import, and the Gradle application needs `ext['tomcat.version']` under the dependency-management plugin or a constraint per artifact under `platform()`. Each property moves again whenever its line moves again, nothing in the build says which vulnerabilities the current set of numbers closes, and a fifteenth line found later changes the block in every application in the estate.

### An aggregator BOM per line

The other way to give recipients one number is for FINOS to publish it: an `osera-bom-spring-boot-2.7` whose `dependencyManagement` lists every patched coordinate, released once per cause like the Boot line itself, and imported by the application next to the Boot BOM it already uses. Producers then publish only what they changed, and no jar is republished byte for byte.

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.finos.osera</groupId>
      <artifactId>osera-bom-spring-boot-2.7</artifactId>
      <version>2.7.18-osera-00004</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>2.7.18</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

Two BOMs now manage the same coordinates, and which one wins is the build tool's decision, made differently in each build shape. Maven takes the first import that names a coordinate, so the block above works and the same block with its two imports swapped changes nothing, without a warning. Under `spring-boot-starter-parent` the application imports the overlay and inherits Boot's management, and Maven prefers an inherited direct entry to any import: the overlay wins `spring-web`, which Boot manages through an imported `spring-framework-bom`, and loses `tomcat-embed-core`, which Boot manages with a direct entry. That application keeps Boot's own Tomcat pin with CVE-2025-24813 open, and only `mvn dependency:tree` says so. Gradle's `platform()` turns both BOMs into constraints and resolves each coordinate to the higher version, and the dependency-management plugin applies a precedence rule of its own.

Boot's own modules are direct entries at a literal 2.7.18, so under the parent the overlay cannot deliver any of Boot's five Wave 1 fixes. Boot's Maven and Gradle plugins take no version from any BOM; they are members of the Boot line and move only when the parent or plugin version moves.

The application is left tracking two numbers whose relationship it has to know: the overlay is built against one Boot patch level, and which of its entries take effect depends on the build shape and the order of two imports. Republishing the Boot line puts the patched pins in the one BOM the application already reads, where there is no second BOM to lose to. What the overlay saves is publication, one POM per cause instead of Boot's 68 modules republished byte for byte, and this standard takes that cost, because a republished jar is disclosed once in its pedigree and a precedence contest is fought again in every application.
