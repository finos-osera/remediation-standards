import test from "node:test";
import assert from "node:assert/strict";
import { buildCatalog, filterCatalog } from "../src/lib/catalog.mjs";
const spec = (id, overrides = {}) => ({
  id,
  slug: id.toLowerCase(),
  title: id,
  summary: "Test evidence",
  category: "Release",
  version: "0.1.0",
  status: "Ratified",
  sha256: "original",
  ...overrides,
});
const baseline = {
  pack: { included_standards: [{ id: "REL-001" }, { id: "REL-004" }] },
  standards: [
    spec("REL-001"),
    spec("REL-004"),
    spec("REL-007", { status: "Pre-Draft" }),
  ],
};
const current = [
  spec("REL-001", { status: "Draft", version: "0.2.0", sha256: "new" }),
  spec("REL-004", { sha256: "same-version-edit" }),
  spec("FEED-002", { category: "Feeds", status: "Draft" }),
];

test("0.1.0 ratified filter opens old definitions, excludes observe-only and new specs", () => {
  const rows = filterCatalog(buildCatalog(current, baseline), {
    collection: "0.1.0",
    status: "Recorded ratified",
  });
  assert.deepEqual(
    rows.map((s) => s.id),
    ["REL-001", "REL-004"],
  );
  assert.equal(rows[0].version, "0.1.0");
  assert.equal(rows[0].href, "/standards/0.1.0/rel-001/");
  assert.equal(
    filterCatalog(buildCatalog(current, baseline), {
      collection: "0.1.0",
      status: "Observe only",
    }).length,
    1,
  );
});
test("draft/category/search filters intersect and changed ratified labels are not inherited", () => {
  const rows = buildCatalog(current, baseline);
  assert.deepEqual(
    filterCatalog(rows, {
      status: "Draft",
      category: "Feeds",
      query: "  feed  ",
    }).map((s) => s.id),
    ["FEED-002"],
  );
  assert.equal(filterCatalog(rows, { status: "Recorded ratified" }).length, 0);
  assert.equal(
    filterCatalog(rows, { status: "Changed since ratification" })[0].id,
    "REL-004",
  );
  assert.equal(
    filterCatalog(rows, { collection: "0.1.0", status: "Draft" }).length,
    0,
  );
});
test("adding, renaming or removing working specs leaves historical catalog entries addressable", () => {
  const renamed = spec("REL-001", { slug: "new-name", status: "Draft" });
  const rows = buildCatalog(
    [renamed, spec("NEW-001", { status: "Draft" })],
    baseline,
  );
  assert.equal(
    rows.find((s) => s.collection === "current" && s.id === "REL-001").href,
    "/standards/new-name/",
  );
  assert.equal(
    rows.find((s) => s.collection === "0.1.0" && s.id === "REL-001").href,
    "/standards/0.1.0/rel-001/",
  );
  assert.ok(rows.some((s) => s.collection === "0.1.0" && s.id === "REL-004"));
  assert.equal(filterCatalog(rows, { collection: "All" }).length, 5);
});
