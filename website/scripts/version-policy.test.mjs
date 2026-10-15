import test from "node:test";
import assert from "node:assert/strict";
import { selectDefaultVersion } from "./version-policy.mjs";
import config from "../docusaurus.config.js";

test("default is newest available ratified pack, excluding drafts and unavailable snapshots", () => {
  const packs = [
    { id: "OSERA-SP-0.3.0", status: "Draft" },
    { id: "OSERA-SP-0.2.0", status: "Ratified" },
    { id: "OSERA-SP-0.1.0", status: "Ratified" },
  ];
  assert.equal(selectDefaultVersion(["0.3.0", "0.2.0", "0.1.0"], packs), "0.2.0");
  assert.equal(selectDefaultVersion(["0.3.0", "0.1.0"], packs), "0.1.0");
  assert.equal(selectDefaultVersion(["0.3.0"], packs), "current");
  assert.equal(selectDefaultVersion([], packs), "current");
});

test("navigation, catalog and search default to the same pack without moving existing URLs", () => {
  const docs = config.presets[0][1].docs;
  assert.equal(docs.lastVersion, "0.1.0");
  assert.equal(config.customFields.defaultCollection, docs.lastVersion);
  assert.equal(docs.versions.current.path, "");
  assert.equal(docs.versions["0.1.0"].path, "0.1.0");
  assert.deepEqual(config.customFields.searchCollections.map((v) => v.value), ["", "standards/"]);
  assert.match(config.customFields.searchCollections[1].label, /Next/);
});
