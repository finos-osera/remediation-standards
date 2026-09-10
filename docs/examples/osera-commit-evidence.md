---
title: OSERA Commit Evidence
permalink: /examples/osera-commit-evidence/
---

These examples come from OSERA's **legacy proof of concept and are illustrative only**. They explain provenance, regression-test, and compatibility evidence; they do not demonstrate compliance with the ratified OSERA-SP-0.1.0 standards. Historical names and commit references are retained as recorded, and those repositories may become unavailable.

A follow-up GitHub issue is planned to replace this material with evidence from new official OSERA patches. For current naming and release examples, use [Examples]({{ site.baseurl }}/examples/) and [Java Release Examples]({{ site.baseurl }}/examples/release-tags/).

## Upstream provenance and adaptation notes

The Spring Framework backpatch commit for CVE-2024-38816 is a strong example of provenance-oriented commit evidence:

* OSERA commit: <https://github.com/finos-osera/backpatch-spring-framework/commit/dfaa2e9a99173fc9cbb22a76c99f9acfe616ede6>
* Upstream commit referenced by the OSERA commit: `spring-projects/spring-framework@d86bf8b2056429edf5494456cffcb2b243331c49`
* The commit explains the CVE/GHSA, identifies the upstream source line, and describes source-level adaptations needed for Java 8 compatibility.
* The commit lists the patched WebMvc.fn and WebFlux.fn resource lookup classes.

This is the kind of source-change evidence `SRC-002` should encourage: the recipient can trace the patch back to the upstream fix and understand meaningful deviations from the upstream implementation.

## Regression test evidence

The same Spring Framework commit adds two public regression test files:

* `spring-webmvc/src/test/java/org/springframework/web/servlet/function/PathResourceLookupFunctionPathTraversalTests.java`
* `spring-webflux/src/test/java/org/springframework/web/reactive/function/server/PathResourceLookupFunctionPathTraversalTests.java`

The test locations identify the affected framework surfaces and give recipients a practical signal for their own validation planning: applications using WebMvc.fn or WebFlux.fn static resource handling from filesystem locations should consider targeted regression coverage.

## Runtime compatibility evidence

The Logback `backpatch/1.2.9` branch includes a commit titled `ensure JDK 8 compatibility`:

* <https://github.com/finos-osera/backpatch-logback/commit/a721d9c51643f0a9fd113a1a3bb4e25ad7a76e4e>

This supports the need for an explicit compatibility standard. A future acceptance check should make runtime or bytecode compatibility machine-verifiable rather than relying only on commit history.

## Provider process evidence

The ActiveMQ repository includes a fork-maintenance commit disabling GitHub Actions on the fork:

* <https://github.com/finos-osera/backpatch-activemq/commit/ff29ab870ba35275f7363fda8a6653a7615722eb>

This supports the release-process position that public GitHub Actions should not be required for every patch fork, while still leaving room for providers to publish their own test evidence under `REL-001` and build provenance evidence under `REL-007`.
