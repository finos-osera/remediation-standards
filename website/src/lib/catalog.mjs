// Publication status comes from pack membership and source identity, not version
// numbers or inherited ratification metadata on an evolving working document.
export function buildCatalog(current, baseline) {
  const members = new Set(baseline.pack.included_standards.map((s) => s.id));
  const oldById = new Map(baseline.standards.map((s) => [s.id, s]));
  const entry = (s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    category: s.category,
    version: s.version,
    sourceStatus: s.status,
  });
  return [
    ...current.map((s) => {
      const old = oldById.get(s.id);
      const changed = Boolean(old && old.sha256 !== s.sha256);
      const recorded = members.has(s.id);
      const status =
        s.status !== "Ratified"
          ? s.status
          : recorded && !changed
            ? "Recorded ratified"
            : recorded
              ? "Changed since ratification"
              : "Unconfirmed ratification";
      return {
        ...entry(s),
        collection: "current",
        status,
        changed,
        href: `/standards/${s.slug}/`,
      };
    }),
    ...baseline.standards.map((s) => ({
      ...entry(s),
      collection: "0.1.0",
      status: members.has(s.id) ? "Recorded ratified" : "Observe only",
      changed: false,
      href: `/standards/0.1.0/${s.slug}/`,
    })),
  ];
}

export function filterCatalog(
  rows,
  { query = "", category = "All", status = "All", collection = "current" } = {},
) {
  const term = query.trim().toLowerCase();
  return rows.filter(
    (s) =>
      (collection === "All" || s.collection === collection) &&
      (category === "All" || s.category === category) &&
      (status === "All" || s.status === status) &&
      `${s.id} ${s.title} ${s.summary}`.toLowerCase().includes(term),
  );
}
