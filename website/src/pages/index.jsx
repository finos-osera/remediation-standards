import React, { useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import standards from "../data/current.json";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = standards.filter(
    (s) =>
      (category === "All" || s.category === category) &&
      `${s.id} ${s.title} ${s.summary}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <Layout
      title="Explore the standards"
      description="Browse OSERA remediation standards, working drafts and recorded ratified history."
    >
      <main>
        <section className="hero-osera">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">FINOS OSERA / REMEDIATION STANDARDS</p>
              <h1>
                Trusted patches.
                <br />
                <span>Transparent standards.</span>
              </h1>
              <p className="hero-description">
                A shared foundation for producing, publishing, and consuming
                open source patches. Find the requirements, inspect the
                evidence, and follow every version.
              </p>
              <div className="hero-actions">
                <Link
                  className="button button--primary button--lg"
                  to="/standards/0.1.0/overview/"
                >
                  Explore 0.1.0
                </Link>
                <Link
                  className="button button--secondary button--lg"
                  to="/standards/overview/"
                >
                  Review working drafts →
                </Link>
              </div>
            </div>
            <aside className="release-panel">
              <p className="eyebrow">THE STANDARDS JOURNEY</p>
              <div className="journey-entry">
                <span className="status-pill ratified">Recorded ratified</span>
                <h2>0.1.0</h2>
                <p>September 10, 2026 · 13 included standards</p>
                <p className="small">
                  Historical baseline awaiting confirmation.
                </p>
                <Link to="/standards/0.1.0/overview/">
                  Browse historical collection →
                </Link>
              </div>
              <div className="journey-entry">
                <span className="status-pill draft">Draft</span>
                <h2>0.2.0</h2>
                <p>The next collection, open for review.</p>
                <Link to="/versions/">
                  See version history & release notes →
                </Link>
              </div>
            </aside>
          </div>
        </section>
        <section className="container catalog-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE WORKING COLLECTION / 0.2.0</p>
              <Heading as="h2" id="standards">
                Find your standard
              </Heading>
              <p>Stable IDs. Explicit versions. Traceable decisions.</p>
            </div>
            <span className="result-count" aria-live="polite">
              {filtered.length} standards
            </span>
          </div>
          <div className="catalog-controls">
            <label>
              Search standards
              <input
                type="search"
                placeholder="Search by ID, topic, or requirement…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label>
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {["All", ...new Set(standards.map((s) => s.category))].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  ),
                )}
              </select>
            </label>
          </div>
          <div className="standard-grid">
            {filtered.map((s) => (
              <article className="standard-card" key={s.id}>
                <div className="card-top">
                  <span className="standard-id">{s.id}</span>
                  <span className="version-small">v{s.version}</span>
                </div>
                <h3>
                  <Link to={`/standards/${s.slug}/`}>{s.title}</Link>
                </h3>
                <p>{s.summary}</p>
                <div className="card-bottom">
                  <span>{s.category}</span>
                  <Link to={`/standards/${s.slug}/#version-history`}>
                    {s.changed
                      ? "Changed since 0.1.0 ↗"
                      : "Version history ↗"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <p className="empty-state">
              No standards match your search. Try a different term or category.
            </p>
          )}
        </section>
      </main>
    </Layout>
  );
}
