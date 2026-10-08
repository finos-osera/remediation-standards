import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import YAML from "yaml";
import { Liquid } from "liquidjs";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const site = path.join(root, "website");
const write = (file, text) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
};
export function pageSources() {
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      if (entry.name.startsWith("_") || entry.name.startsWith(".")) return [];
      const file = path.join(dir, entry.name);
      return entry.isDirectory()
        ? walk(file)
        : file.endsWith(".md")
          ? [file]
          : [];
    });
  return walk(path.join(root, "docs"))
    .filter((file) => file !== path.join(root, "docs/index.md"))
    .map((file) => ({ file, ...matter(fs.readFileSync(file, "utf8")) }));
}
export async function generatePages() {
  const baseline = JSON.parse(
    fs.readFileSync(path.join(site, "baseline.json")),
  );
  const pages = pageSources();
  const routes = new Set(["/", "/versions/", "/catalog/"]);
  const outputsFile = path.join(site, ".generated-pages.json");
  if (fs.existsSync(outputsFile))
    for (const file of JSON.parse(fs.readFileSync(outputsFile)))
      fs.rmSync(path.join(site, "src/pages", file), { force: true });
  const outputFiles = [];
  const inventory = [];
  const engine = new Liquid({ strictFilters: true, strictVariables: false });
  engine.registerFilter("slugify", (text) =>
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"),
  );
  engine.registerFilter("markdownify", (text) => text); // These template insertions are already Markdown.
  for (const { file, data, content } of pages) {
    const route = data.permalink;
    if (!route || !/^\/[a-z0-9/-]+\/$/.test(route) || routes.has(route))
      throw new Error(`Missing, unsafe or duplicate permalink in ${file}`);
    routes.add(route);
    let body = content.replace(/\{\{\s*site\.baseurl\s*\}\}/g, "");
    if (route === "/standard-packs/") {
      const packs = YAML.parse(
        fs.readFileSync(
          path.join(root, "docs/_data/standard_packs.yml"),
          "utf8",
        ),
      );
      // A ratified pack must never send readers to a later working definition.
      if (packs.some((p) => p.id !== baseline.pack.id))
        throw new Error(
          "Add manifest-backed routing for the new pack before publishing its table.",
        );
      for (const member of [
        ...packs[0].included_standards,
        ...packs[0].observe_standards,
      ]) {
        if (
          !baseline.standards.some(
            (s) => s.id === member.id && s.version === member.version,
          )
        )
          throw new Error(`Missing historical pack member ${member.id}`);
      }
      body = await engine.parseAndRender(body, {
        site: {
          baseurl: "",
          data: { standard_packs: packs },
          standards: baseline.standards.map((s) => ({
            standard_id: s.id,
            url: `/standards/0.1.0/${s.slug}/`,
          })),
        },
      });
      body = body.replace(
        /(?<!0\.1\.0)\/standards\/(?!0\.1\.0\/)([a-z0-9-]+)\//g,
        "/standards/0.1.0/$1/",
      );
      body =
        ":::info[Historical archive status]\nThe 0.1.0 ratification is recorded; its reconstructed baseline awaits confirmation. Membership links below open the historical copy. The catalog downloads are the existing mutable working catalogs, not an immutable release bundle.\n:::\n\n" +
        body;
    }
    // Liquid leaves blank, indented control-tag lines inside HTML tables.
    // Normalize only those tables so Markdown does not turn rows into code blocks.
    body = body.replace(/<table>[\s\S]*?<\/table>/g, (table) =>
      table
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n"),
    );
    if (/\{%|\{\{/.test(body)) throw new Error(`Unconverted Liquid in ${file}`);
    if (route === "/feeds/")
      body =
        ":::note[Feed documentation]\nThis page describes feed formats and illustrative examples. It is not a live feed directory; Feeds is omitted from navigation while a usable service is unavailable.\n:::\n\n" +
        body;
    const out = `${route.slice(1)}index.md`;
    write(
      path.join(site, "src/pages", out),
      `---\n${YAML.stringify({ title: data.title, description: data.title, slug: route })}---\n\n# ${data.title}\n\n${body}`,
    );
    outputFiles.push(out);
    inventory.push({ source: path.relative(root, file), route });
  }
  const catalog = "catalog/index.md";
  write(
    path.join(site, "src/pages", catalog),
    "---\ntitle: Machine-readable catalog\nslug: /catalog/\n---\n\n# Machine-readable catalog\n\nThese **mutable working catalogs** are generated from the current specification sources. They do not substitute for an immutable ratified release.\n\n- [Complete YAML catalog](/catalog/osera-standards.yaml)\n- [Complete JSON catalog](/catalog/osera-standards.json)\n- [0.1.0 pack metadata (working catalog)](/catalog/packs/OSERA-SP-0.1.0.json)\n- [Standards format schema](/schemas/osera-standard-frontmatter-0.1.0.schema.json)\n- [Pack format schema](/schemas/osera-standard-pack-0.1.0.schema.json)\n\n[Browse standards](/#standards) · [Version history](/versions/)\n",
  );
  outputFiles.push(catalog);
  for (const dir of ["catalog", "schemas", "assets"]) {
    fs.rmSync(path.join(site, "static", dir), { recursive: true, force: true });
    fs.cpSync(path.join(root, "docs", dir), path.join(site, "static", dir), {
      recursive: true,
    });
  }
  write(outputsFile, JSON.stringify(outputFiles));
  write(
    path.join(site, "src/data/pages.json"),
    JSON.stringify(inventory, null, 2) + "\n",
  );
  console.log(
    `Prepared ${pages.length} shared pages at their existing URLs, plus catalog downloads.`,
  );
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await generatePages();
