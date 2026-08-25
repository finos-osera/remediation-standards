---
title: Standard Packs
permalink: /standard-packs/
---

Standard packs collect individually versioned remediation standards into a release candidate or ratified set. A pack version is the thing an implementer targets; each included standard keeps its own version so the working group can revise one standard and include the revision in a later pack.

## Release history

| Pack | Status | Proposed | Target decision | Ratified |
| --- | --- | --- | --- | --- |
{% for pack in site.data.standard_packs %}
| [{{ pack.id }}](#{{ pack.id | slugify }}) | {{ pack.status }} | {{ pack.proposed_date }} | {{ pack.target_decision_date }} | {{ pack.ratified_date }} |
{% endfor %}

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
