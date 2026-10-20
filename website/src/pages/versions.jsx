import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import StatusLabel from "../components/StatusLabel";
import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
const repo = "https://github.com/finos-osera/remediation-standards";
export default function Versions() {
  const { siteConfig } = useDocusaurusContext();
  const isLatestPack = siteConfig.customFields.defaultCollection === "0.1.0";
  return (
    <Layout
      title="Version history"
      description="Recorded ratification, draft collections and release publication status."
    >
      <main className="container history-page">
        <p className="eyebrow">A CLEAR RECORD OF CHANGE</p>
        <h1>Version history</h1>
        <p className="history-intro">
          Choose the collection you need. Each standard retains its own ID and
          version; a pack groups the exact definitions used together.
        </p>
        <div className="history-notice">
          <strong>Ratification and archive publication are separate.</strong>{" "}
          The 0.1.0 decision is recorded, but the reconstructed source baseline
          still needs verification. Each standard shows its own approval status.
        </div>
        <section className="release-row">
          <div>
            <span className="status-pill draft">
              <StatusLabel status="Working draft" />
            </span>
            <h2>Next · Working draft</h2>
            <p>Next collection · not ratified</p>
          </div>
          <div>
            <h3>Develop the next set of standards</h3>
            <p>
              Current source documents include proposed extensions and new
              standards. This view does not define approved pack membership or
              confer approval on inherited source labels.
            </p>
            <Link className="button button--primary" to="/standards/overview/">
              Browse working collection
            </Link>
            <p className="release-links">
              <a
                href={`${repo}/compare/51e0afebeb789c266efe3a6802fa59fbb3d8e999...main`}
              >
                Compare source changes
              </a>
            </p>
          </div>
        </section>
        <section className="release-row">
          <div>
            <span className="status-pill ratified">
              <StatusLabel status="Recorded ratified" />
            </span>
            <h2>0.1.0</h2>
            <p>September 10, 2026</p>
          </div>
          <div>
            <h3>The first remediation standards pack</h3>
            <p>
              13 included standards establish the initial requirements for
              repository conventions, source provenance, release evidence,
              artifact hygiene, and feeds. Seven additional standards are
              observe-only and remain unratified.
            </p>
            <p>
              This collection preserves the source recorded at ratification;
              snapshot verification is pending. Later draft changes, including
              REL-001 0.2.0, are excluded.
            </p>
            <Link
              className="button button--secondary"
              to="/standards/0.1.0/overview/"
            >
              {isLatestPack ? "Browse collection" : "Browse historical collection"}
            </Link>
            <p className="release-links">
              <a href={`${repo}/issues/12`}>Ratification record</a> ·{" "}
              <a href={`${repo}/tree/51e0afebeb789c266efe3a6802fa59fbb3d8e999`}>
                Source snapshot
              </a>
            </p>
            <p>
              <strong>Release downloads:</strong> not yet published. The{" "}
              <Link to="/catalog/">YAML and JSON catalogs</Link> track the
              working standards; they are not downloads of this pack.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
