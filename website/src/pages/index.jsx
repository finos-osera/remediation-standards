import StatusLabel from "../components/StatusLabel";
import React, { useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import standards from "../data/catalog.json";
import FilterMenu from "../components/FilterMenu";
import { filterCatalog } from "../lib/catalog.mjs";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [collection, setCollection] = useState("current");
  const filtered = filterCatalog(standards, {
    query,
    category,
    status,
    collection,
  });
  const options = (values) => [
    { value: "All", label: "All" },
    ...values.map((value) => ({ value, label: value })),
  ];
  const reset = () => {
    setQuery("");
    setCategory("All");
    setStatus("All");
    setCollection("current");
  };
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
                <span className="status-pill ratified">
                  <StatusLabel status="Recorded ratified" />
                </span>
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
                <span className="status-pill draft">
                  <StatusLabel status="Draft" />
                </span>
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
              <p className="eyebrow">
                {collection === "current"
                  ? "WORKING COLLECTION / 0.2.0"
                  : collection === "0.1.0"
                    ? "HISTORICAL COLLECTION / 0.1.0"
                    : "ALL COLLECTIONS"}
              </p>
              <Heading as="h2" id="standards">
                Find your standard
              </Heading>
              <p>Stable IDs. Explicit versions. Traceable decisions.</p>
            </div>
            <span className="result-count" aria-live="polite">
              {filtered.length}{" "}
              {filtered.length === 1 ? "standard version" : "standard versions"}
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
            <FilterMenu
              label="Category"
              value={category}
              onChange={setCategory}
              options={options(
                Array.from(new Set(standards.map((s) => s.category))).sort(),
              )}
            />
            <FilterMenu
              label="Collection"
              value={collection}
              onChange={setCollection}
              options={[
                { value: "current", label: "0.2.0 · Working collection" },
                { value: "0.1.0", label: "0.1.0 · Historical pack" },
                { value: "All", label: "All collections" },
              ]}
            />
            <FilterMenu
              label="Status"
              value={status}
              onChange={setStatus}
              options={options(
                Array.from(new Set(standards.map((s) => s.status))).sort(),
              ).map((option) => ({
                ...option,
                label: <StatusLabel status={option.label} />,
              }))}
            />
          </div>
          <div className="filter-context">
            <p>
              {collection === "current"
                ? "Working copies for the next collection. Individual standard versions and statuses vary."
                : "Pack 0.1.0 includes ratified and observe-only standards. Historical snapshot verification is pending."}
            </p>
            <button type="button" className="filter-reset" onClick={reset}>
              Reset filters
            </button>
          </div>
          <div className="standard-grid">
            {filtered.map((s) => (
              <article
                className="standard-card"
                key={`${s.collection}-${s.id}`}
              >
                <div className="card-top">
                  <Link className="standard-id" to={s.href}>
                    {s.id}
                  </Link>
                  <span className="version-small">v{s.version}</span>
                </div>
                <h3>
                  <Link to={s.href}>{s.title}</Link>
                </h3>
                <div className="card-status">
                  <span
                    className={`status-pill ${s.status === "Recorded ratified" ? "ratified" : "draft"}`}
                  >
                    <StatusLabel status={s.status} />
                  </span>
                  <span className="collection-label">
                    {s.collection === "current"
                      ? "0.2.0 working"
                      : "0.1.0 historical"}
                  </span>
                </div>
                <p>{s.summary}</p>
                <div className="card-bottom">
                  <span>{s.category}</span>
                  <Link to={`${s.href}#version-history`}>
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
              No standard versions match these filters. Try another collection,
              category, or status, or reset the filters.
            </p>
          )}
        </section>
      </main>
    </Layout>
  );
}
