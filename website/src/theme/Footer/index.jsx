import React from "react";
import Link from "@docusaurus/Link";
export default function Footer() {
  return (
    <footer className="osera-footer">
      <div className="container osera-footer-grid">
        <div>
          <Link to="https://osera.finos.org" aria-label="OSERA homepage">
            <img
              className="osera-footer-logo"
              src="/assets/osera-horizontal-white.svg"
              alt="OSERA"
            />
          </Link>
          <strong>Remediation Standards</strong>
          <p>
            Versioned remediation standards for FINOS OSERA participants, patch
            providers, and enterprise consumers.
          </p>
        </div>
        <nav aria-label="Community links">
          <a href="https://osera.finos.org">osera.finos.org</a>
          <a href="https://github.com/finos-osera/community">Community repo</a>
          <a href="https://github.com/finos-osera">Patch repositories</a>
        </nav>
      </div>
    </footer>
  );
}
