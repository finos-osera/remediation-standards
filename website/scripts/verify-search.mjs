import fs from "node:fs";
import assert from "node:assert/strict";
const site = new URL("../", import.meta.url);
const catalog = JSON.parse(
  fs.readFileSync(new URL("src/data/catalog.json", site)),
);
for (const [collection, directory] of [
  ["current", "build/"],
  ["0.1.0", "build/standards/0.1.0/"],
]) {
  const root = new URL(directory, site);
  const file = fs
    .readdirSync(root)
    .find((name) => /^search-index-.*\.json$/.test(name));
  assert.ok(file, `Missing search index for ${collection}`);
  const indexes = JSON.parse(fs.readFileSync(new URL(file, root)));
  const documents = indexes.flatMap((index) => index.documents);
  const urls = new Set(documents.map((doc) => doc.u));
  for (const standard of catalog.filter((s) => s.collection === collection)) {
    assert.ok(
      urls.has(standard.href),
      `Search omits ${collection} ${standard.id}`,
    );
  }
  assert.ok(
    documents.some((doc) => doc.t.includes("REL-001.REQ-001")),
    "Structured requirements must be searchable",
  );
  if (collection === "current")
    assert.ok(
      urls.has("/versions/"),
      "Version history page must be searchable",
    );
  console.log(
    `Verified complete ${collection} search inventory and requirement text.`,
  );
}
