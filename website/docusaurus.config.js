const config = {
  title: "OSERA Remediation Standards",
  tagline: "Open standards. Clear evidence. Trusted patches.",
  url: "https://standards.osera.finos.org",
  baseUrl: "/",
  trailingSlash: true,
  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  markdown: {
    format: "md",
    hooks: { onBrokenMarkdownLinks: "throw", onBrokenMarkdownImages: "throw" },
  },
  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "standards",
          sidebarPath: "./sidebars.js",
          lastVersion: "current",
          versions: {
            current: { label: "0.2.0 · ✎ Draft", path: "", banner: "none" },
            "0.1.0": {
              label: "Pack 0.1.0",
              path: "0.1.0",
              banner: "none",
            },
          },
        },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      },
    ],
  ],
  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: "filename",
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: "/standards",
        language: "en",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: "right",
        searchResultLimits: 8,
        searchResultContextMaxLength: 100,
      },
    ],
  ],
  themeConfig: {
    colorMode: { defaultMode: "light", disableSwitch: true },
    navbar: {
      title: "Standards",
      logo: { alt: "OSERA", src: "assets/osera-horizontal-color.svg" },
      items: [
        { to: "/#standards", label: "Explore standards", position: "left" },
        { to: "/versions", label: "Version history", position: "left" },
        {
          label: "Guides",
          position: "left",
          items: [
            { to: "/standard-packs/", label: "Standard packs" },
            { to: "/lifecycle/", label: "Lifecycle" },
            { to: "/fitness/", label: "Fitness" },
            { to: "/examples/", label: "Examples" },
            { to: "/definitions/", label: "Definitions" },
            { to: "/governance/", label: "Governance" },
          ],
        },
        { to: "/catalog/", label: "Catalog", position: "left" },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownItemsAfter: [
            { to: "/versions", label: "All versions & release notes" },
          ],
        },
        {
          href: "https://github.com/finos-osera/remediation-standards",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright:
        "FINOS OSERA · Remediation Standards · Docusaurus feasibility prototype",
    },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
  },
};
export default config;
