import fs from "node:fs";
const standards = JSON.parse(
  fs.readFileSync(new URL("./src/data/current.json", import.meta.url)),
);
export default {
  standards: [
    "overview",
    ...[...new Set(standards.map((s) => s.category))].map((category) => ({
      type: "category",
      label: category,
      items: standards
        .filter((s) => s.category === category)
        .map((s) => s.slug),
    })),
  ],
};
