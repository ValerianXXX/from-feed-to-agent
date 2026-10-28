import test from "node:test";
import assert from "node:assert/strict";
import { template, validate, summarize, taskSet, taskHash } from "./research-round.mjs";
const run = rows => ({ version: taskSet.version, taskHash, observations: rows });
test("missing observations and cost stay unmeasured", () => {
  const result = summarize(run([template])); assert.equal(result.recorded, 1); assert.equal(result.surfaces[0].task.observed, 0); assert.equal(result.surfaces[0].costUsd, null);
});
test("synthetic success, incomplete facts, duplicate attempts and invented timing fail", () => {
  assert.throws(() => validate({ ...template, synthetic: true }));
  assert.throws(() => validate({ ...template, taskCompleted: true }));
  assert.throws(() => summarize(run([template, template])));
  assert.throws(() => validate({ ...template, elapsedMs: 100 }));
  assert.throws(() => summarize({ ...run([]), taskHash: "changed" }));
});
test("discovery, complete answers and saved artifacts remain separate", () => {
  const row = { ...template, status: "OBSERVED", querySubmitted: true, answerClear: true, sourcesFound: true, taskCompleted: true, artifactSaved: false,
    factsCorrect: 5, factsChecked: 5, evidenceRetained: 2, sources: ["https://support.apple.com/en-us/105046", "https://helpguide.sony.net/"] };
  const result = summarize(run([row])); assert.equal(result.surfaces[0].task.yes, 1); assert.equal(result.surfaces[0].saved.yes, 0);
  assert.throws(() => validate({ ...row, artifactSaved: true }));
});
