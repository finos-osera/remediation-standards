---
schema-version: 0.1.0
sequence: 610
standard_id: STD-001
title: Standards-as-Code Source Metadata
summary: OSERA standards use human-authored Markdown with structured YAML front matter
  as the machine-readable source of truth.
doc-status: Ratified
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.1.0 ratified
ratified-in: OSERA-SP-0.1.0
ratified-date: '2026-09-10'
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

* standard identifiers, profile relationships, and versions;
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

## Authoring model

Standard prose pages are maintained manually in `docs/_standards/*.md`. The structured YAML front matter at the top of each page is the machine-readable source for standard IDs, versions, lifecycle status, pack membership, requirements, checks, evidence expectations, and future fitness-function bindings.

The documentation site renders those Markdown files through Jekyll templates. The same front matter is also used by `tools/generate_catalog.rb` to produce normalized YAML and JSON artifacts under `docs/catalog/`.

Package-ecosystem or package-manager profiles MAY extend a base standard by appending an uppercase profile suffix to the base standard identifier, for example `REL-003-JAVA`. The profile suffix uses `-PROFILE` rather than `.PROFILE` so requirement and check IDs can keep the established dotted form, such as `REL-003-JAVA.REQ-001` and `REL-003-JAVA.CHECK-001`.

When a profile extends a base standard, the base standard's checks automatically apply to the profile unless the profile defines a check with the same numeric suffix. The numeric suffix is the override key. For example, `REL-003-JAVA.CHECK-001` overrides `REL-003.CHECK-001`, while `REL-003-JAVA.CHECK-003` adds a new Java-specific check after the inherited and overridden checks. This mirrors method overriding in an object-oriented class extension: unchanged parent checks are inherited, same-number child checks replace the parent behavior for that profile, and new child check numbers add profile-specific behavior.

### Explicit parent relationships

Every overriding requirement and check MUST include an `override-explanation` string in its YAML metadata. It MUST describe the specialization and the parent obligations that remain applicable. An override does not implicitly waive the parent outcome. The field is omitted for added items; inherited items are not copied into the profile source.

```yaml
extends: REL-003
requirements:
- id: REL-003-JAVA.REQ-002
  override-explanation: Adds Maven package URL evidence while retaining the parent obligation to use the same patched-release identity across tags, artifacts, feeds, and evidence.
  # Other required requirement fields are omitted from this excerpt.
  checks:
  - id: REL-003-JAVA.CHECK-002
    override-explanation: Uses Maven package URLs to verify the parent identifier-consistency obligation.
    # Other required check fields are omitted from this excerpt.
```

The generator derives **Inherited**, **Overrides**, and **Added** relationships by numeric suffix, independently for requirements and checks. Overriding a requirement does not remove parent checks: a check is replaced only by a same-number profile check. For profiles extending other profiles, the comparison uses the parent's effective inherited and overridden items.

The generated catalogs include `parent_relationship` with the parent ID/version and separate requirement/check rows containing `parent_item`, `treatment`, `effective_item`, and `explanation`. Added rows have a null `parent_item`; inherited rows retain the defining ancestor's item ID. This is a relationship map, not a second copy of the requirements or an executable fitness result.

The same data is generated into `docs/_data/profile_relationships.yml` to render a **Relationship to parent** section before each profile's structured requirements. Authors MUST NOT edit the generated relationship data or author `parent_relationship` in front matter. Consumers resolve each effective item ID to its defining standard record; the parent version identifies the version in this catalog snapshot.

Validation rejects missing or blank override explanations, explanations on items that do not override a parent, unknown parents, inheritance cycles, and duplicate item numbers. No manually maintained inherited/overridden lists are required.


Profile requirements follow the same numbering convention. A same-number profile requirement specializes the parent requirement for the profile; a new number adds a profile-specific requirement.

Profile pages SHOULD be readable on their own. A profile SHOULD explicitly describe any same-number requirements or checks that override the parent. Parent requirements and checks that are inherited without modification do not need to be duplicated in the child page; catalog and fitness tooling should compute the effective requirement and check set from the parent plus the profile.

The generated YAML and JSON files SHOULD NOT be edited independently. When a standard changes, update the Markdown page and rerun the generator so the rendered documentation and machine-readable catalog remain synchronized.
