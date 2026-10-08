import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import matter from "gray-matter";
import YAML from "yaml";
import { buildCatalog } from "../src/lib/catalog.mjs";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const site = path.join(root, "website");
const repo = "https://github.com/finos-osera/remediation-standards";
const baselineCommit = "51e0afebeb789c266efe3a6802fa59fbb3d8e999";
const hash = (text) => createHash("sha256").update(text).digest("hex");
const write = (file, text) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
};
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" });

const sourceFileCache = new Map();
function sourceFiles(historical) {
  if (!sourceFileCache.has(historical)) {
    const baselineFile = path.join(site, "baseline.json");
    const files =
      historical && fs.existsSync(baselineFile)
        ? JSON.parse(fs.readFileSync(baselineFile)).sourceFiles
        : (historical
            ? git("ls-tree", "-r", "--name-only", baselineCommit, "docs")
            : git("ls-files", "docs")
          )
            .trim()
            .split("\n");
    sourceFileCache.set(historical, new Set(files));
  }
  return sourceFileCache.get(historical);
}

export function parseStandard(file, raw) {
  const { data, content } = matter(raw);
  return {
    id: data.standard_id,
    slug: path.basename(file, ".md"),
    title: data.title,
    version: data["standard-version"],
    status: data["doc-status"],
    category: data.category,
    summary: data.summary,
    sequence: data.sequence,
    sha256: hash(raw),
    data,
    content,
    raw,
  };
}

// Keep standard references inside the selected collection. Supporting material is
// explicitly linked to its source revision until a full Jekyll migration is agreed.
export function convertLinks(content, standards, historical) {
  const ref = historical ? baselineCommit : "main";
  return content
    .replace(/\{\{\s*site\.baseurl\s*\}\}/g, "")
    .replace(
      /(!?\[[^\]]*\])\(([^\s)]+)([^)]*)\)/g,
      (all, label, href, tail) => {
        if (/^(https?:|mailto:|#)/.test(href)) return all;
        const match = href.match(
          /(?:^|\/)standards\/([^/#.]+)(?:\.md)?\/?(#[^ ]*)?$/,
        );
        if (match && standards.some((s) => s.slug === match[1])) {
          return `${label}(/standards/${historical ? "0.1.0/" : ""}${match[1]}/${match[2] || ""})`;
        }
        const clean = href.replace(/^(\.\.\/)+/, "").replace(/^\//, "");
        const [pathname, anchor] = clean.split("#");
        const stem = pathname.replace(/\/$/, "");
        const candidates = [stem, `${stem}.md`, `${stem}/index.md`];
        const files = sourceFiles(historical);
        const target = candidates.find((p) => files.has(`docs/${p}`));
        if (!target)
          throw new Error(`Unresolved supporting reference: ${href}`);
        if (!historical) {
          const permalink = target.endsWith(".md")
            ? matter(fs.readFileSync(path.join(root, "docs", target), "utf8"))
                .data.permalink
            : "/" + target;
          if (permalink)
            return `${label}(${permalink}${anchor ? "#" + anchor : ""}${tail})`;
        }
        return `${label}(${repo}/blob/${ref}/docs/${target}${anchor ? "#" + anchor : ""}${tail})`;
      },
    );
}

export function historyState(standard, baseline) {
  const old = baseline.standards.find((s) => s.id === standard.id);
  const member = baseline.pack.included_standards.find(
    (s) => s.id === standard.id,
  );
  return {
    old,
    member,
    changed: Boolean(old && old.sha256 !== standard.sha256),
  };
}

function currentRelationships(s, standards) {
  const downloads = `[Working YAML](/catalog/standards/${s.id}.yaml) · [Working JSON](/catalog/standards/${s.id}.json)`;
  if (!s.data.extends) return downloads;
  const relationships = YAML.parse(
    fs.readFileSync(
      path.join(root, "docs/_data/profile_relationships.yml"),
      "utf8",
    ),
  );
  const relationship = relationships[s.id];
  const parent = standards.find((candidate) => candidate.id === s.data.extends);
  if (!relationship || !parent)
    throw new Error(`Missing profile relationship for ${s.id}`);
  const cell = (value) =>
    String(value ?? "—")
      .replace(/\|/g, "\\|")
      .replace(/\n/g, " ");
  return (
    downloads +
    `\n\n## Relationship to parent\n\nThis profile extends [${parent.id}](/standards/${parent.slug}/) version ${relationship.parent_version}. The tables below are generated from current parent/profile metadata.\n\n` +
    ["requirements", "checks"]
      .map(
        (kind) =>
          `### ${kind[0].toUpperCase() + kind.slice(1)}\n\n| Parent item | Treatment | Effective item | What changes or remains |\n| --- | --- | --- | --- |\n` +
          relationship[kind]
            .map(
              (item) =>
                `| ${cell(item.parent_item)} | ${cell(item.treatment)} | ${cell(item.effective_item)} | ${cell(item.explanation)} |`,
            )
            .join("\n"),
      )
      .join("\n\n")
  );
}

function render(s, standards, baseline, historical) {
  const { old, member, changed } = historyState(s, baseline);
  const recorded = member && old;
  const status = historical
    ? member
      ? "Recorded ratified · archive candidate"
      : "Observe only · not ratified"
    : "Working copy · unratified collection";
  const history = historical
    ? "This page preserves the proposed historical source. [Open the central version register](/versions/) for current history and publication status."
    : `${changed ? "**This working copy has moved on.** Source content differs from the historical baseline, even if its displayed version is unchanged.\n\n" : ""}${recorded ? `Latest recorded ratified version: **${member.version}**, in OSERA-SP-0.1.0 on September 10, 2026. [Read the preserved text](/standards/0.1.0/${old.slug}/). **No confirmed official archive is published.**` : "No recorded ratified version in the available pack history. Observe-mode membership does not confer ratification."}\n\n| Collection | Standard version | Status | Evidence |\n| --- | --- | --- | --- |\n| 0.2.0 working collection | ${s.version} | Working copy; source status: ${s.status} | [Current source](${repo}/blob/main/docs/_standards/${s.slug}.md) |\n${old ? `| [OSERA-SP-0.1.0](/standards/0.1.0/${old.slug}/) | ${old.version} | ${member ? "Recorded ratified; archive candidate" : "Observe only; not ratified"} | [Ratification record](${baseline.pack.issue}) · [Baseline PR #51](${repo}/pull/51) |` : ""}`;
  const converted = convertLinks(s.content, standards, historical);
  if (/\{%|\{\{/.test(converted))
    throw new Error(`Unconverted Liquid in ${s.id}`);
  return `---\n${YAML.stringify({ id: s.slug, title: `${s.id} · ${s.title}`, sidebar_label: `${s.id} · ${s.title}`, sidebar_position: s.sequence || 999, description: s.summary })}---\n\n:::${historical ? "info" : "warning"}[${status}]\n\n**Standard ${s.version}** · ${s.category}. ${historical ? "OSERA-SP-0.1.0 was ratified on September 10, 2026; this reconstruction awaits baseline confirmation." : "0.2.0 is the proposed next collection, not the version of every standard. Source status labels and predecessor dates do not approve working-copy changes."}\n\n${!historical && recorded ? `[Read recorded ratified ${member.version}](/standards/0.1.0/${old.slug}/) · ` : ""}[Version history](#version-history) · [All versions & release notes](/versions/)\n\n:::\n\n${s.summary}\n\n${historical ? "" : currentRelationships(s, standards)}\n\n${converted}\n\n## Version history\n\n${history}\n\n## Structured requirements and checks\n\nThese definitions come from this page's source front matter. Profile inheritance remains defined by the referenced parent; these are local definitions, not a resolved conformance catalog.\n\n\`\`\`yaml\n${YAML.stringify(s.data)}\`\`\`\n\n## Source provenance\n\n[${historical ? "Historical source at " + baselineCommit.slice(0, 7) : "Working source"}](${repo}/blob/${historical ? baselineCommit : "main"}/docs/_standards/${s.slug}.md) · Source SHA-256: \`${s.sha256}\`.\n\nSupporting guidance links point to ${historical ? "the same historical Git revision" : "the current site guidance"}; this prototype is not a self-contained release archive.\n`;
}

function overview(standards, baseline, historical) {
  const prefix = `/standards/${historical ? "0.1.0/" : ""}`;
  return `---\nid: overview\ntitle: ${historical ? "0.1.0 · Recorded ratified pack" : "0.2.0 · Working draft collection"}\nsidebar_position: 0\n---\n\n${historical ? "Ratified September 10, 2026. Historical baseline candidate from PR #51; not a confirmed official archive. Observe-only standards remain unratified." : "A proposed next collection for review. Individual standard versions and maturity vary; no 0.2.0 pack is ratified by this prototype."}\n\n[Version history and release notes](/versions/)\n\n| Standard | Version | ${historical ? "Pack role" : "Source status"} |\n| --- | --- | --- |\n${standards.map((s) => `| [${s.id} · ${s.title}](${prefix}${s.slug}/) | ${s.version} | ${historical ? baseline.pack.included_standards.find((m) => m.id === s.id)?.role || "Observe only · not ratified" : s.status} |`).join("\n")}\n`;
}

export function generate() {
  const baselineFile = path.join(site, "baseline.json");
  if (process.argv.includes("--snapshot")) {
    if (fs.existsSync(baselineFile))
      throw new Error(
        "Refusing to replace an existing baseline. Review a new version separately.",
      );
    const files = git(
      "ls-tree",
      "-r",
      "--name-only",
      baselineCommit,
      "docs/_standards",
    )
      .trim()
      .split("\n");
    const standards = files.map((file) =>
      parseStandard(file, git("show", `${baselineCommit}:${file}`)),
    );
    const pack = YAML.parse(
      git("show", `${baselineCommit}:docs/_data/standard_packs.yml`),
    )[0];
    for (const member of [
      ...pack.included_standards,
      ...pack.observe_standards,
    ]) {
      const s = standards.find((s) => s.id === member.id);
      if (!s || s.version !== member.version)
        throw new Error(`Baseline version mismatch: ${member.id}`);
      const checks = s.data.requirements
        .flatMap((r) => r.checks || [])
        .map((c) => c.id);
      for (const check of member.checks || [])
        if (!checks.includes(check)) throw new Error(`Missing check ${check}`);
    }
    const baseline = {
      sourceCommit: baselineCommit,
      confirmation: "unconfirmed",
      sourceFiles: [...sourceFiles(true)],
      pack,
      standards,
    };
    write(baselineFile, JSON.stringify(baseline, null, 2) + "\n");
    for (const s of standards)
      write(
        path.join(site, "versioned_docs/version-0.1.0", `${s.slug}.md`),
        render(s, standards, baseline, true),
      );
    write(
      path.join(site, "versioned_docs/version-0.1.0/overview.md"),
      overview(standards, baseline, true),
    );
  }
  const baseline = JSON.parse(fs.readFileSync(baselineFile));
  const standards = fs
    .readdirSync(path.join(root, "docs/_standards"))
    .filter((f) => f.endsWith(".md"))
    .map((f) =>
      parseStandard(
        f,
        fs.readFileSync(path.join(root, "docs/_standards", f), "utf8"),
      ),
    )
    .sort((a, b) => a.sequence - b.sequence);
  fs.rmSync(path.join(site, "docs"), { recursive: true, force: true });
  for (const s of standards)
    write(
      path.join(site, "docs", `${s.slug}.md`),
      render(s, standards, baseline, false),
    );
  write(
    path.join(site, "docs/overview.md"),
    overview(standards, baseline, false),
  );
  write(
    path.join(site, "src/data/current.json"),
    JSON.stringify(
      standards.map(({ raw, content, data, ...s }) => ({
        ...s,
        changed: historyState(s, baseline).changed,
      })),
      null,
      2,
    ) + "\n",
  );
  write(
    path.join(site, "src/data/catalog.json"),
    JSON.stringify(buildCatalog(standards, baseline), null, 2) + "\n",
  );
  console.log(
    `Prepared ${standards.length} working standards; historical pages left unchanged.`,
  );
}
if (process.argv[1] === fileURLToPath(import.meta.url)) generate();
