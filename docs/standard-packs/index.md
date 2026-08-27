---
title: Standard Packs
permalink: /standard-packs/
---

Standard packs collect individually versioned remediation standards into a release candidate or ratified set. A pack version is the thing an implementer targets; each included standard keeps its own version so the working group can revise one standard and include the revision in a later pack.

Standard lifecycle status and standards-pack membership are separate. Ratifying `OSERA-SP-0.1.0` should record the exact standard versions included in that pack and set their pack relationship to ratified for that release set. It should not erase later draft work or imply that every future revision of those standards is automatically part of `OSERA-SP-0.1.0`.

In the catalog, the primary pill shows the standard lifecycle status. The pack pill shows whether that version is a candidate, deferred item, or eventually ratified member of a standards pack.

See the [standard lifecycle]({{ site.baseurl }}/lifecycle/) for guidance on standard identifiers, versions, ratification, and pack creation.

## Release history

<table>
  <thead>
    <tr>
      <th>Pack</th>
      <th>Status</th>
      <th>Proposed</th>
      <th>Target decision</th>
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
      <td>{{ pack.target_decision_date }}</td>
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
| Target decision date | {{ pack.target_decision_date }} |
| Target gate date | {{ pack.target_gate_date }} |
| Ratified date | {{ pack.ratified_date }} |
| GitHub issue | [Issue #12]({{ pack.issue }}) |
| Agenda issue | [Agenda]({{ pack.agenda_issue }}) |
| Standards-as-code issue | [Issue #23]({{ pack.standards_as_code_issue }}) |
| Proposal branch | `{{ pack.branch }}` |
| Machine-readable | [YAML]({{ site.baseurl }}/catalog/packs/{{ pack.id }}.yaml) / [JSON]({{ site.baseurl }}/catalog/packs/{{ pack.id }}.json) |

### Release metadata posture

Official OSERA signed artifacts proposed for this pack use `+{{ pack.release_metadata.official_token }}`, for example `{{ pack.release_metadata.official_example }}`.

Existing `+{{ pack.release_metadata.legacy_token }}` releases are legacy/proof-of-concept evidence and are not the proposed official signed-artifact naming for this pack.

### Approved producers

The approved-producer registry is `{{ pack.approved_producers.registry }}`.

{{ pack.approved_producers.lifecycle_policy }}

### Observed evidence

{% for item in pack.evidence_summary %}
* {{ item }}
{% endfor %}

### Blocking in v0.1.0

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

### Observe mode for v0.2.0

Observe-mode checks run during the v0.1.0 gate to collect evidence and implementation feedback. They should not block official OSERA-SP-0.1.0 publication unless the working group explicitly promotes them before ratification.

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

### Discussion agenda

{% for topic in pack.discussion_topics %}
* {{ topic }}
{% endfor %}
{% endfor %}
