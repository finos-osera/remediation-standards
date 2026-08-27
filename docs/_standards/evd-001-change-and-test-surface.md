---
schema-version: 0.1.0
sequence: 410
standard_id: EVD-001
title: Change and Test Surface Guidance
summary: Providers publish concise recipient guidance describing what changed and
  what surface area should be tested.
doc-status: Pre-Draft
standard-version: 0.0.1
candidate-pack: OSERA-SP-0.2.0 observe
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Observe-only check
type: EVD
category: Recipient Evidence
applies-to:
- Patch providers
- Enterprise recipients
- Tooling providers
requirements:
- id: EVD-001.REQ-001
  level: SHOULD
  text: Patch providers should publish versioned recipient guidance describing what
    changed and what surface area should be tested.
  checkability: manual
  checks:
  - id: EVD-001.CHECK-001
    title: Recipient guidance uses the current guidance schema
    type: release-evidence
    severity: observe
    implementation: osera-fitness.evd001.recipient_guidance_schema
    evidence:
    - recipient_guidance
    - schema_version
---

## Requirement

Patch providers SHOULD publish a recipient-facing summary alongside each patch that describes:

* what changed;
* why the change was made;
* whether the patch is an upstream backport or provider-developed fix;
* what application surface area recipients should consider testing;
* references to OpenRewrite recipes, markdown, LLM-friendly context, or other machine-readable guidance when available.

## Rationale

Financial services consumers need more than a coordinate. They need enough context to evaluate the patch, route testing, and explain adoption decisions internally.

## Suggested schema

```yaml
recipient_guidance:
  schema_version: 0.1.0
  what_changed:
    - Short, concrete change summary.
  suggested_test_surface:
    - APIs, frameworks, configuration paths, or runtime behaviors to test.
  automation:
    openrewrite_recipes:
      - org.example.security.ExampleRecipe
    llm_context: docs/patch-context.md
```

The draft schema is published at [`/schemas/osera-recipient-guidance-0.1.0.schema.json`]({{ site.baseurl }}/schemas/osera-recipient-guidance-0.1.0.schema.json).

## Maturity note

This is an intentionally early standard. The working group should refine the minimum fields and decide which parts belong in feeds, release notes, repository files, or separate evidence bundles.

This is deferred from OSERA-SP-0.1.0 because the working group has not yet defined the expected format tightly enough to make it advisory or required for the first ratification decision. It should run in observe mode and be reconsidered for OSERA-SP-0.2.0.

## Observed OSERA example

The historical `backpatch-spring-framework` CVE-2024-38816 commit gives recipients useful test-surface evidence by identifying the affected WebMvc.fn and WebFlux.fn resource lookup classes and adding regression tests under those packages:

<https://github.com/finos-osera/backpatch-spring-framework/commit/dfaa2e9a99173fc9cbb22a76c99f9acfe616ede6>

That commit suggests a useful evidence pattern: provider notes should name the affected framework surface, list the regression tests added or run, and call out meaningful adaptations from the upstream fix.
