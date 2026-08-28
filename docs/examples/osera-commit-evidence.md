---
title: OSERA Commit Evidence
permalink: /examples/osera-commit-evidence/
---

The public OSERA backpatch repositories already contain concrete examples that inform the draft standards. These examples are non-normative; they include legacy/proof-of-concept naming that predates the proposed `patch-*`, `patch/`, and `+patch.baseline` conventions.

## Branch and tag conventions

Observed examples:

| Repository | Branch evidence | Tag evidence |
| --- | --- | --- |
| `backpatch-spring-framework` | `backpatch/5.3.39` | `v5.3.39+backpatch.baseline`, `v5.3.39+backpatch.001` |
| `backpatch-logback` | `backpatch/1.2.9` | `v1.2.9+backpatch.baseline` |
| `backpatch-gson` | `main` | `v2.8.8+backpatch.baseline`, `v2.8.8+backpatch.001` |
| `backpatch-activemq` | `main` | `v5.14.5+backpatch.baseline`, `v5.14.5+backpatch.001` |

These examples show why OSERA needs explicit source branch, baseline tag, and release metadata standards. They are historical evidence, not the proposed future naming convention.

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
