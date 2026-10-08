import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { convertLinks, historyState, parseStandard } from "./generate-docs.mjs";
const baseline = JSON.parse(
  fs.readFileSync(new URL("../baseline.json", import.meta.url)),
);
const historicalDir = new URL(
  "../versioned_docs/version-0.1.0/",
  import.meta.url,
);

test("recorded membership pins exact versions and checks; observe-only is not ratified", () => {
  assert.equal(baseline.pack.included_standards.length, 13);
  assert.equal(baseline.pack.observe_standards.length, 7);
  for (const m of baseline.pack.included_standards) {
    const s = baseline.standards.find((s) => s.id === m.id);
    assert.equal(s.version, m.version);
    const checks = s.data.requirements
      .flatMap((r) => r.checks || [])
      .map((c) => c.id);
    for (const c of m.checks) assert.ok(checks.includes(c), c);
  }
  assert.equal(
    historyState(
      baseline.standards.find((s) => s.id === "REL-007"),
      baseline,
    ).member,
    undefined,
  );
});
test("source hashes are reproducible and edits with unchanged versions are detected", () => {
  for (const s of baseline.standards)
    assert.equal(s.sha256, createHash("sha256").update(s.raw).digest("hex"));
  const old = baseline.standards.find((s) => s.id === "REL-004");
  const edited = parseStandard(
    `${old.slug}.md`,
    old.raw + "\nA substantive clarification.\n",
  );
  assert.equal(edited.version, old.version);
  assert.equal(historyState(edited, baseline).changed, true);
});
test("historical standard references stay historical and supporting sources use the pinned commit", () => {
  const link = convertLinks(
    "[test]({{ site.baseurl }}/standards/rel-001-test-provenance/) [guide](/lifecycle/)",
    baseline.standards,
    true,
  );
  assert.ok(link.includes("/standards/0.1.0/rel-001-test-provenance/"));
  assert.ok(
    link.includes(`/blob/${baseline.sourceCommit}/docs/lifecycle/index.md`),
  );
  assert.throws(
    () => convertLinks("[bad](/missing-source/)", baseline.standards, true),
    /Unresolved/,
  );
});
test("normal generation preserves historical source pages byte for byte", () => {
  const inventory = () =>
    Object.fromEntries(
      fs
        .readdirSync(historicalDir)
        .map((f) => [f, fs.readFileSync(new URL(f, historicalDir), "utf8")]),
    );
  const before = inventory();
  execFileSync(process.execPath, [
    new URL("./generate-docs.mjs", import.meta.url).pathname,
  ]);
  assert.deepEqual(inventory(), before);
  const draft = fs.readFileSync(
    new URL("../docs/rel-001-test-provenance.md", import.meta.url),
    "utf8",
  );
  const old = before["rel-001-test-provenance.md"];
  assert.match(draft, /Standard 0\.2\.0/);
  assert.match(old, /Standard 0\.1\.0/);
  assert.match(draft, /This working copy has moved on/);
  assert.doesNotMatch(old, /REL-001\.REQ-002/);
  assert.throws(
    () =>
      execFileSync(
        process.execPath,
        [
          new URL("./generate-docs.mjs", import.meta.url).pathname,
          "--snapshot",
        ],
        { stdio: "pipe" },
      ),
    /Refusing to replace/,
  );
});
