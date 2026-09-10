---
title: Standard Packs
permalink: /standard-packs/
---

OSERA-SP-0.1.0 was ratified on **Thursday, September 10, 2026**. It defines the first set of standards that will gate OSERA patch releases. Seven additional standards are tracked in observe mode for OSERA-SP-0.2.0.

Each pack fixes the exact versions of its included standards. Later revisions do not change an existing pack. The catalog shows each standard's lifecycle status and pack membership separately.

See the [standard lifecycle]({{ site.baseurl }}/lifecycle/) for identifiers, versions, and pack maintenance.

## Release history

<table>
  <thead>
    <tr>
      <th>Pack</th>
      <th>Status</th>
      <th>Proposed</th>
      <th>Gate target</th>
      <th>Ratified</th>
    </tr>
  </thead>
  <tbody>
    {% for pack in site.data.standard_packs %}
    <tr>
      <td><a href="#{{ pack.id | slugify }}">{{ pack.id }}</a></td>
      <td>{{ pack.status }}</td>
      <td>{{ pack.proposed_date }}</td>
      <td>{{ pack.target_gate_date }}</td>
      <td>{{ pack.ratified_date }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

{% for pack in site.data.standard_packs %}
<h2 id="{{ pack.id | slugify }}">{{ pack.id }}: {{ pack.title }}</h2>

{{ pack.summary }}

| Field | Value |
| --- | --- |
| Status | {{ pack.status }} |
| Proposed date | {{ pack.proposed_date }} |
| Target gate date | {{ pack.target_gate_date }} |
| Ratified date | {{ pack.ratified_date }} |
| GitHub issue | [Issue #12]({{ pack.issue }}) |
| Standards-as-code issue | [Issue #23]({{ pack.standards_as_code_issue }}) |
| Machine-readable | [YAML]({{ site.baseurl }}/catalog/packs/{{ pack.id }}.yaml) / [JSON]({{ site.baseurl }}/catalog/packs/{{ pack.id }}.json) |

### Release metadata posture

{{ pack.release_metadata.scope }}

The generic default form is `+{{ pack.release_metadata.official_token }}`, for example `{{ pack.release_metadata.official_example }}`, where no concrete ecosystem profile exists. Java artifacts follow the REL-003-JAVA profile.

Existing `+{{ pack.release_metadata.legacy_token }}` releases are legacy/proof-of-concept evidence and are not the official signed-artifact naming for this pack.

### Approved producers

The approved-producer registry is `{{ pack.approved_producers.registry }}`.

{{ pack.approved_producers.lifecycle_policy }}

### Observed evidence

{% for item in pack.evidence_summary %}
* {{ item }}
{% endfor %}

### Required standards in v0.1.0

<table>
  <thead>
    <tr>
      <th>Standard</th>
      <th>Version</th>
      <th>Fitness role</th>
      <th>Rationale</th>
    </tr>
  </thead>
  <tbody>
    {% for standard in pack.included_standards %}
    {% assign standard_doc = site.standards | where: "standard_id", standard.id | first %}
    <tr>
      <td><a href="{{ site.baseurl }}{{ standard_doc.url }}">{{ standard.id }}</a></td>
      <td>{{ standard.version }}</td>
      <td>{{ standard.role }}</td>
      <td>{{ standard.rationale }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

### Advisory in v0.1.0

{% if pack.advisory_standards and pack.advisory_standards.size > 0 %}
<table>
  <thead>
    <tr>
      <th>Standard</th>
      <th>Version</th>
      <th>Fitness role</th>
      <th>Rationale</th>
    </tr>
  </thead>
  <tbody>
    {% for standard in pack.advisory_standards %}
    {% assign standard_doc = site.standards | where: "standard_id", standard.id | first %}
    <tr>
      <td><a href="{{ site.baseurl }}{{ standard_doc.url }}">{{ standard.id }}</a></td>
      <td>{{ standard.version }}</td>
      <td>{{ standard.role }}</td>
      <td>{{ standard.rationale }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
{% else %}

This pack has no advisory standards. Items that need more implementation evidence are tracked in observe mode for v0.2.0 consideration.

{% endif %}

### Observe mode for v0.2.0

Observe-mode checks run during the v0.1.0 gate to collect evidence and implementation feedback. Their results do not block OSERA-SP-0.1.0 alignment. Promotion requires inclusion in a later ratified pack.

<table>
  <thead>
    <tr>
      <th>Standard</th>
      <th>Version</th>
      <th>Fitness role</th>
      <th>Rationale</th>
    </tr>
  </thead>
  <tbody>
    {% for standard in pack.observe_standards %}
    {% assign standard_doc = site.standards | where: "standard_id", standard.id | first %}
    <tr>
      <td><a href="{{ site.baseurl }}{{ standard_doc.url }}">{{ standard.id }}</a></td>
      <td>{{ standard.version }}</td>
      <td>{{ standard.role }}</td>
      <td>{{ standard.rationale }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

{% endfor %}
