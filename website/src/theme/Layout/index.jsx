import React from "react";
import Layout from "@theme-original/Layout";
import { useHistory, useLocation } from "@docusaurus/router";
import FilterMenu from "../../components/FilterMenu";

export default function SiteLayout({ children, ...props }) {
  const location = useLocation();
  const history = useHistory();
  const searchPage = /^\/search\/?$/.test(location.pathname);
  const params = new URLSearchParams(location.search);
  const version = params.get("version") || "";
  return (
    <Layout {...props}>
      {searchPage && (
        <section
          className="container search-scope"
          aria-label="Search collection"
        >
          <FilterMenu
            label="Search collection"
            value={version}
            options={[
              { value: "", label: "0.2.0 · Working collection" },
              {
                value: "standards/0.1.0/",
                label: "0.1.0 · Historical collection",
              },
            ]}
            onChange={(value) => {
              const next = new URLSearchParams(location.search);
              if (value) next.set("version", value);
              else next.delete("version");
              history.replace({
                pathname: location.pathname,
                search: next.toString(),
              });
            }}
          />
          <p>
            Search titles, full standard text, requirements and checks, plus
            site pages. Historical 0.1.0 content remains an unconfirmed archive
            candidate.
          </p>
        </section>
      )}
      {children}
    </Layout>
  );
}
