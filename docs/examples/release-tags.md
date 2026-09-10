---
title: Java Release Examples
permalink: /examples/release-tags/
---

These illustrative examples use OSERA-SP-0.1.0 naming. They are not an inventory of published patches or evidence of conformance. [REL-003-JAVA]({{ site.baseurl }}/standards/rel-003-java-patch-version-naming/) defines the adopted [Maven CARE-style approach](https://central.sonatype.org/policies/care-policy/) and packaging validation requirements.

| Scenario | Baseline tag | Release tag | Artifact version |
| --- | --- | --- | --- |
| Numeric Maven base (decision example) | `v5.3.39+patch.baseline` | `v5.3.39.1-osera-00001` | `5.3.39.1-osera-00001` |
| Qualified Maven base | `v5.6.15.Final+patch.baseline` | `v5.6.15.Final-osera-00001` | `5.6.15.Final-osera-00001` |
| OSGi bundle with a numeric base | `v1.2.3+patch.baseline` | `v1.2.3.1-osera-00001` | `1.2.3.1-osera-00001` |
| OSGi bundle with a qualifier | `v1.2.3.Final+patch.baseline` | `v1.2.3.Final-osera-00001` | `1.2.3.Final-osera-00001` |

The qualified and OSGi rows illustrate applications of the adopted approach; validate each actual package before publication. In the OSGi rows, everything after the third dot is a single qualifier. Do not introduce another dot inside it. See the [profile's OSGi explanation]({{ site.baseurl }}/standards/rel-003-java-patch-version-naming/#examples-by-packaging-scenario).

Source repositories use `patch-<upstream-project>` and branches use `patch/<version>` under [FORK-001]({{ site.baseurl }}/standards/fork-001-repository-naming/) and [FORK-002]({{ site.baseurl }}/standards/fork-002-patch-branches/). Baseline tags keep the [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/) convention, independently of the Java artifact version.

For the numeric Maven example, the feed identifies the artifact as `pkg:maven/org.springframework/spring-core@5.3.39.1-osera-00001`. Source tag, artifact version, feed, and release evidence must refer to the same patched release.
