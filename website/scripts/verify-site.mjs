import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { pageSources } from "./generate-pages.mjs";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const build = path.join(root, "website/build");
for (const { data, file } of pageSources())
  assert.ok(
    fs.existsSync(path.join(build, data.permalink, "index.html")),
    `Missing page from ${file}`,
  );
for (const directory of ["catalog", "schemas", "assets"]) {
  const walk = (dir) =>
    fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((entry) =>
        entry.isDirectory()
          ? walk(path.join(dir, entry.name))
          : [path.join(dir, entry.name)],
      );
  for (const file of walk(path.join(root, "docs", directory))) {
    const relative = path.relative(path.join(root, "docs"), file);
    assert.deepEqual(
      fs.readFileSync(path.join(build, relative)),
      fs.readFileSync(file),
      `Changed or missing download: ${relative}`,
    );
  }
}
for (const { data } of pageSources())
  assert.ok(
    fs
      .readFileSync(path.join(build, data.permalink, "index.html"), "utf8")
      .includes("<h1"),
    `Missing visible title at ${data.permalink}`,
  );
const packs = fs.readFileSync(
  path.join(build, "standard-packs/index.html"),
  "utf8",
);
assert.ok(
  packs.includes("/standards/0.1.0/rel-001-test-provenance/"),
  "Pack must link to historical REL-001",
);
assert.ok(
  !packs.includes('href="/standards/rel-001-test-provenance/"'),
  "Pack must not link to working REL-001",
);
assert.ok(!packs.includes("&lt;tr"), "Pack table rows must not render as code");
const home = fs.readFileSync(path.join(build, "index.html"), "utf8");
assert.ok(
  home.includes("Community repo") &&
    home.includes("osera-horizontal-white.svg"),
  "Missing community footer",
);
assert.ok(
  !home.includes('href="/feeds/"'),
  "Feeds must stay out of homepage navigation",
);
console.log(
  "Verified shared page routes, unchanged catalog/schema/assets downloads, historical pack links and footer.",
);
