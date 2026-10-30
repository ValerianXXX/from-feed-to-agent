import { access, readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { extname, join, relative } from "node:path";

const root = new URL("../", import.meta.url);
const forbidden = [
  ["chatgpt", ".site"].join(""),
  ["git", ".chatgpt", "-team", ".site"].join(""),
  [".openai", "/hosting", ".json"].join(""),
  ["appg", "prj_"].join(""),
  ["appg", "ver_"].join(""),
  ["appg", "dep_"].join(""),
  ["xusihan", "615"].join(""),
  ["from-feed-to-agent", "-sihan-xu"].join(""),
  ["c:", "\\users\\"].join(""),
];
const textExtensions = new Set([".cjs", ".cff", ".css", ".csv", ".html", ".js", ".json", ".jsonl", ".md", ".mjs", ".ts", ".tsx", ".txt", ".yml", ".yaml"]);
const excluded = new Set([".git", "dist", "node_modules"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (excluded.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (textExtensions.has(extname(entry.name).toLowerCase()) || entry.name === "LICENSE") files.push(path);
  }
  return files;
}

const rootPath = decodeURIComponent(root.pathname).replace(/^\/(.:\/)/, "$1");
const failures = [];
for (const file of await walk(rootPath)) {
  const content = (await readFile(file, "utf8")).toLowerCase();
  for (const needle of forbidden) {
    if (content.includes(needle)) failures.push(`${relative(rootPath, file)} contains ${needle}`);
  }
}

const downloads = [
  "from_feed_to_agent_final_report_20260820.pptx",
  "from_feed_to_agent_final_report_20260820.pdf",
  "from_feed_to_agent_method_appendix_20260820.pdf",
  "from_feed_to_agent_final_analysis_20260820.xlsx",
  "from_feed_to_agent_linkedin_carousel_20260820.pptx",
  "from_feed_to_agent_linkedin_carousel_20260820.pdf",
  "from_feed_to_agent_public_data_20260820.zip",
];
for (const name of downloads) {
  try { await access(join(rootPath, "public", "downloads", name)); }
  catch { failures.push(`missing public/downloads/${name}`); }
}

const checksumLines = (await readFile(join(rootPath, "SHA256SUMS.txt"), "utf8"))
  .trim()
  .split(/\r?\n/);
const checksums = new Map(checksumLines.map((line) => {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  return match ? [match[2], match[1]] : [line, "INVALID"];
}));
for (const name of downloads) {
  const digest = createHash("sha256")
    .update(await readFile(join(rootPath, "public", "downloads", name)))
    .digest("hex");
  if (checksums.get(name) !== digest) failures.push(`SHA256SUMS.txt does not match ${name}`);
}
if (checksums.size !== downloads.length) failures.push(`SHA256SUMS.txt contains ${checksums.size} entries; expected ${downloads.length}`);

const expectedRows = {
  "study_a_observation_features_public.csv": 192,
  "study_a_metric_scores_long_public.csv": 3264,
  "study_a_validation_claim_checks_public.csv": 136,
  "study_a_coding_audit_results_public.csv": 48,
};
for (const [name, expected] of Object.entries(expectedRows)) {
  const content = await readFile(join(rootPath, "data", name), "utf8");
  const rows = content.trimEnd().split(/\r?\n/).length - 1;
  if (rows !== expected) failures.push(`data/${name} has ${rows} rows; expected ${expected}`);
}

const built = await readFile(join(rootPath, "dist", "index.html"), "utf8");
if (!built.includes("https://valerianxxx.github.io/from-feed-to-agent/")) failures.push("dist/index.html is missing the canonical GitHub Pages URL");
if (!built.includes("/from-feed-to-agent/assets/")) failures.push("dist/index.html is missing the repository base path");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ status: "PASS", downloads: downloads.length, checkedDataRows: Object.values(expectedRows).reduce((a, b) => a + b, 0) }));
