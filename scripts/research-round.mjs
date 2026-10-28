import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
const taskUrl = new URL("../public/rounds/2026-10-27/tasks.json", import.meta.url);
export const taskSet = JSON.parse(await fs.readFile(taskUrl, "utf8"));
export const taskHash = createHash("sha256").update(JSON.stringify(taskSet)).digest("hex");
const nullableCount = value => value === null || (Number.isSafeInteger(value) && value >= 0);
export function validate(row) {
  if (!taskSet.tasks.some(task => task.id === row.taskId) || !taskSet.surfaces.includes(row.surface) || row.repetition !== 1) throw new Error("Unknown frozen task/surface/repetition");
  if (!["OBSERVED", "BLOCKED", "NOT_RUN"].includes(row.status) || row.synthetic !== false) throw new Error("Real observations only; synthetic fixtures cannot become findings");
  if (typeof row.querySubmitted !== "boolean" || (row.status === "OBSERVED" && !row.querySubmitted)) throw new Error("Distinguish submitted queries from access preflight blocks");
  if (typeof row.note !== "string" || row.note.length < 20 || row.note.length > 4000) throw new Error("A bounded redacted observation note is required");
  if (typeof row.environment !== "object" || !row.environment?.browser || !row.environment?.accountState || !(row.environment.model === null || typeof row.environment.model === "string")) throw new Error("Record browser, account state and model (or null)");
  for (const key of ["answerClear", "sourcesFound", "taskCompleted", "artifactSaved"]) if (!(row[key] === null || typeof row[key] === "boolean")) throw new Error(`Invalid ${key}`);
  for (const key of ["factsCorrect", "factsChecked", "evidenceRetained", "humanInterventions", "elapsedMs"]) if (!nullableCount(row[key])) throw new Error(`Invalid ${key}`);
  if (!(row.costUsd === null || (Number.isFinite(row.costUsd) && row.costUsd >= 0))) throw new Error("Invalid cost");
  if (!Array.isArray(row.sources) || row.sources.length > 30 || row.sources.some(url => typeof url !== "string" || !/^https:\/\//.test(url))) throw new Error("Invalid public evidence links");
  if (row.startedAt !== null || row.finishedAt !== null) {
    const start = Date.parse(row.startedAt), finish = Date.parse(row.finishedAt);
    if (!Number.isFinite(start) || !Number.isFinite(finish) || finish < start) throw new Error("Invalid observation time order");
    if (row.elapsedMs !== null && row.elapsedMs !== finish - start) throw new Error("Elapsed observation time must match recorded endpoints");
  } else if (row.elapsedMs !== null) throw new Error("Timing requires both endpoints");
  if (row.factsCorrect !== null && (row.factsChecked === null || row.factsCorrect > row.factsChecked)) throw new Error("Invalid fact denominator");
  if (row.status !== "OBSERVED" && [row.answerClear, row.sourcesFound, row.taskCompleted, row.artifactSaved, row.factsCorrect, row.factsChecked].some(value => value !== null)) throw new Error("Unavailable is not a failed answer or completed task");
  if (row.taskCompleted === true && (!row.answerClear || !row.sourcesFound || !row.sources.length || row.factsChecked !== taskSet.tasks.find(task => task.id === row.taskId).requiredFacts.length || row.factsCorrect !== row.factsChecked)) throw new Error("Task completion requires complete checked facts and evidence");
  if (row.artifactSaved === true && !row.artifactReceipt) throw new Error("Saving requires an independently checked artifact receipt");
  return row;
}
export function summarize(run) {
  if (run.version !== taskSet.version || run.taskHash !== taskHash) throw new Error("Frozen task identity changed");
  const keys = new Set();
  for (const row of run.observations) { validate(row); const key = `${row.taskId}:${row.surface}:${row.repetition}`; if (keys.has(key)) throw new Error("Duplicate attempt"); keys.add(key); }
  return { version: run.version, historicalComparison: "NOT_DIRECTLY_COMPARABLE", planned: taskSet.tasks.length * taskSet.surfaces.length,
    recorded: run.observations.length, surfaces: taskSet.surfaces.map(surface => {
      const rows = run.observations.filter(row => row.surface === surface), seen = rows.filter(row => row.status === "OBSERVED");
      const outcome = name => ({ observed: seen.filter(row => row[name] !== null).length, yes: seen.filter(row => row[name] === true).length });
      return { surface, queriesSubmitted: rows.filter(row => row.querySubmitted).length, blocked: rows.filter(row => row.status === "BLOCKED").length,
        answer: outcome("answerClear"), discovery: outcome("sourcesFound"), task: outcome("taskCompleted"), saved: outcome("artifactSaved"),
        costUsd: rows.length && rows.every(row => row.costUsd !== null) ? rows.reduce((sum, row) => sum + row.costUsd, 0) : null };
    }) };
}
export const template = { taskId: taskSet.tasks[0].id, surface: taskSet.surfaces[0], repetition: 1, synthetic: false,
  status: "NOT_RUN", querySubmitted: false, note: "Prepared only; no observation collected.", environment: { browser: "Record visible browser", accountState: "UNKNOWN", model: null, productBuild: null },
  startedAt: null, finishedAt: null, answerClear: null, sourcesFound: null, taskCompleted: null, artifactSaved: null, artifactReceipt: null,
  factsCorrect: null, factsChecked: null, evidenceRetained: null, humanInterventions: null, elapsedMs: null, costUsd: null, sources: [] };
async function main() {
  const [action, target, input] = process.argv.slice(2);
  if (!target || !path.isAbsolute(target)) throw new Error("Use an absolute run path");
  if (action === "prepare") {
    await fs.writeFile(target, JSON.stringify({ version: taskSet.version, taskHash, preparedAt: new Date().toISOString(), observations: [] }, null, 2), { flag: "wx" });
    console.log(JSON.stringify(template, null, 2)); return;
  }
  const run = JSON.parse(await fs.readFile(target, "utf8")); summarize(run);
  if (action === "record") { const row = validate(JSON.parse(await fs.readFile(input, "utf8"))); run.observations.push(row); summarize(run); await fs.writeFile(target, JSON.stringify(run, null, 2)); }
  else if (action !== "summarize") throw new Error("Choose prepare, record or summarize");
  console.log(JSON.stringify(summarize(run), null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
