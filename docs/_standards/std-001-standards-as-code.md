---
schema-version: 0.1.0
sequence: 610
standard_id: STD-001
title: Standards-as-Code Source Metadata
summary: OSERA standards use human-authored Markdown with structured YAML front matter
  as the machine-readable source of truth.
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 candidate
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required check
type: STD
category: Standards Governance
applies-to:
- OSERA maintainers
- Tooling providers
requirements:
- id: STD-001.REQ-001
  level: MUST
  text: Standard pages must include schema-versioned YAML front matter containing
    identifiers, lifecycle status, requirements, checks, evidence expectations, and
    pack references.
  checkability: automated
  checks:
  - id: STD-001.CHECK-001
    title: Standard front matter validates against the active OSERA schema
    type: standards-repository
    severity: blocking
    implementation: osera-fitness.std001.standard_frontmatter_schema
    evidence:
    - standard_markdown
    - schema-version
- id: STD-001.REQ-002
  level: MUST
  text: The standards repository must publish normalized catalog artifacts generated
    from the Markdown front matter.
  checkability: automated
  checks:
  - id: STD-001.CHECK-002
    title: Generated catalog artifacts are current
    type: standards-repository
    severity: blocking
    implementation: osera-fitness.std001.generated_catalog_current
    evidence:
    - docs/catalog/osera-standards.yaml
    - docs/catalog/osera-standards.json
---

## Requirement

OSERA standards MUST be authored as readable Markdown pages with schema-versioned YAML front matter.

The YAML front matter is the machine-readable source for:

* standard identifiers and versions;
* lifecycle status;
* pack membership;
* requirements;
* check identifiers and severity;
* evidence expectations;
* implementation binding names for future fitness tooling.

The standards repository MUST publish normalized catalog artifacts generated from that source metadata.

## Rationale

Markdown remains the right format for reviewable standards prose. Gates and fitness functions need stronger structure than prose headings can provide.

This hybrid model keeps the current Jekyll/GitHub Pages site while making the same standards consumable by CI, acceptance gates, and downstream policy tooling.

## Generated artifacts

The repository SHOULD publish generated artifacts at stable HTTP paths such as:

```text
/catalog/osera-standards.yaml
/catalog/osera-standards.json
/catalog/packs/OSERA-SP-0.1.0.yaml
/catalog/packs/OSERA-SP-0.1.0.json
```

## Generator posture

The generated artifacts are derived from the Markdown front matter. Contributors SHOULD update the Markdown source and rerun the generator rather than editing generated catalog files directly.
