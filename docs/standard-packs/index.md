---
title: Standard Packs
permalink: /standard-packs/
---

Standard packs collect individually versioned remediation standards into a release candidate or ratified set. A pack version is the thing an implementer targets; each included standard keeps its own version so the working group can revise one standard and include the revision in a later pack.

Standard lifecycle status and standards-pack membership are separate. Ratifying `OSERA-SP-0.1` should record the exact standard versions included in that pack and set their pack relationship to ratified for that release set. It should not erase later draft work or imply that every future revision of those standards is automatically part of `OSERA-SP-0.1`.

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
| Ratified date | {{ pack.ratified_date }} |
| GitHub issue | [Issue #12]({{ pack.issue }}) |
| Agenda issue | [Issue #13]({{ pack.agenda_issue }}) |
| Proposal branch | `{{ pack.branch }}` |

### Observed evidence

{% for item in pack.evidence_summary %}
* {{ item }}
{% endfor %}

### Candidate v0.1 inclusion

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

### Deferred from v0.1

<table>
  <thead>
    <tr>
      <th>Standard</th>
      <th>Version</th>
      <th>Rationale</th>
    </tr>
  </thead>
  <tbody>
    {% for standard in pack.deferred_standards %}
    {% assign standard_doc = site.standards | where: "standard_id", standard.id | first %}
    <tr>
      <td><a href="{{ site.baseurl }}{{ standard_doc.url }}">{{ standard.id }}</a></td>
      <td>{{ standard.version }}</td>
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
