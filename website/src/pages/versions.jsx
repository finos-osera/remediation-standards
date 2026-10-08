import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
const repo = "https://github.com/finos-osera/remediation-standards";
export default function Versions() {
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
          still needs confirmation. The asterisk in “0.1.0 · Ratified*” refers
          to that distinction. No official release tag or GitHub Release was
          found during this exploration.
        </div>
        <section className="release-row">
          <div>
            <span className="status-pill draft">Working draft</span>
            <h2>0.2.0</h2>
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
              </a>{" "}
              · <a href={`${repo}/issues/83`}>Release requirements #83</a>
            </p>
          </div>
        </section>
        <section className="release-row">
          <div>
            <span className="status-pill ratified">Recorded ratified</span>
            <h2>0.1.0</h2>
            <p>September 10, 2026</p>
            <small>Archive candidate</small>
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
              The historical reader uses the exact source from ratification PR
              #51. Later draft changes, including REL-001 0.2.0, are excluded.
            </p>
            <Link
              className="button button--secondary"
              to="/standards/0.1.0/overview/"
            >
              Browse historical collection
            </Link>
            <p className="release-links">
              <a href={`${repo}/issues/12`}>Ratification record</a> ·{" "}
              <a href={`${repo}/pull/51`}>Baseline PR #51</a> ·{" "}
              <a href={`${repo}/tree/51e0afebeb789c266efe3a6802fa59fbb3d8e999`}>
                Source snapshot
              </a>
            </p>
            <p>
              <strong>Release notes:</strong> publication pending. Once the
              baseline is confirmed, the intended tag is{" "}
              <code>OSERA-SP-0.1.0</code>. This prototype does not create or
              link to a nonexistent release.
            </p>
          </div>
        </section>
        <section className="next-step">
          <h2>From versioned reading to permanent releases</h2>
          <p>
            Docusaurus provides the collection selector, sidebars, and
            matching-page navigation. The immutable manifests, downloadable
            archives, checksums, protected tags, and GitHub Release publication
            proposed in <a href={`${repo}/pull/84`}>PR #84</a> remain a separate
            layer.
          </p>
          <p>
            These historical reading pages are rebuilt with the site theme. They
            are not the immutable conformance artifact described in issue #83.
          </p>
        </section>
      </main>
    </Layout>
  );
}
