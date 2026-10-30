import { createHash } from 'node:crypto';

export const SCHEMA = 'FEED_OUTCOME_LEDGER_V2';
const fail = message => { throw new Error(message); };
const obj = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const string = (value, min = 1, max = 4000) => typeof value === 'string' && value.trim().length >= min && value.length <= max;
const count = value => Number.isSafeInteger(value) && value >= 0;
const sha = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const iso = value => typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const unique = values => new Set(values).size === values.length;
const equalSet = (a, b) => a.length === b.length && unique(a) && a.every(x => b.includes(x));
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (obj(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  if (value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return JSON.stringify(value);
  return fail('Non-JSON value');
}
export const digest = value => createHash('sha256').update(canonical(value)).digest('hex');
export function publicUrl(value) {
  if (!string(value, 1, 2048)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port && url.hostname.includes('.') && !/^(localhost|127\.|10\.|192\.168\.|169\.254\.)/.test(url.hostname);
  } catch { return false; }
}
export function validateCatalog(catalog) {
  if (!obj(catalog) || catalog.schema !== 'FEED_TASK_CATALOG_V2' || catalog.historicalComparison !== 'NOT_DIRECTLY_COMPARABLE' || !/^\d{4}-\d{2}-\d{2}$/.test(catalog.roundId)) fail('Invalid catalog');
  if (!Array.isArray(catalog.tasks) || catalog.tasks.length !== 24 || !unique(catalog.tasks.map(t => t.id))) fail('Expected 24 distinct task cells');
  if (!Array.isArray(catalog.sources) || !catalog.sources.length || !unique(catalog.sources.map(s => s.id)) || catalog.sources.some(s => !string(s.id) || !publicUrl(s.url) || !string(s.locator))) fail('Invalid source catalog');
  if (!Array.isArray(catalog.facts) || !unique(catalog.facts.map(f => f.id)) || catalog.facts.some(f => !string(f.statement) || !Array.isArray(f.sourceIds) || !f.sourceIds.length || !unique(f.sourceIds) || f.sourceIds.some(id => !catalog.sources.some(s => s.id === id)))) fail('Invalid fact catalog');
  for (const task of catalog.tasks) {
    if (!/^(WA|RV|SW)-(I|C|V|S)-0[12]$/.test(task.id) || task.id !== task.historicalCell || task.promptOrigin !== 'NEW_PUBLIC_PROMPT' || !string(task.prompt, 50) || !Array.isArray(task.factIds) || !task.factIds.length || !unique(task.factIds) || task.factIds.some(id => !catalog.facts.some(f => f.id === id)) || !Array.isArray(task.criteria) || !task.criteria.length || !unique(task.criteria.map(c => c.id)) || task.criteria.some(c => !string(c.id) || !string(c.description))) fail('Invalid frozen task');
  }
  if (!Array.isArray(catalog.pilotTaskIds) || catalog.pilotTaskIds.length !== 6 || !unique(catalog.pilotTaskIds) || catalog.pilotTaskIds.some(id => !catalog.tasks.find(t => t.id === id)?.pilot)) fail('Invalid pilot selection');
  if (!equalSet(catalog.surfaces, ['ChatGPT', 'Google AI Mode', 'YouTube Search', 'TikTok Search']) || catalog.pilot?.plannedSlots !== 24 || catalog.pilot.repetitions !== 1 || catalog.pilot.maxSubmittedQueries !== 24) fail('Invalid pilot scope');
  return catalog;
}
export function validateReceipt(receipt) {
  if (!obj(receipt) || !/^artifacts\/[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$/.test(receipt.path) || !sha(receipt.sha256) || !count(receipt.bytes) || receipt.bytes < 1 || receipt.bytes > 2_000_000 || !['text/plain','text/markdown','application/pdf','application/json'].includes(receipt.mediaType) || receipt.provenance !== 'PLATFORM_EXPORT' || !iso(receipt.savedAt)) fail('A real platform export needs a bounded file receipt');
}
function validateObservation(row, catalog) {
  if (!obj(row) || !string(row.id, 1, 100) || !/^[A-Za-z0-9-]+$/.test(row.id) || row.synthetic !== false || !catalog.pilotTaskIds.includes(row.taskId) || !catalog.surfaces.includes(row.surface) || row.repetition !== 1 || !['OBSERVED','BLOCKED','NOT_RUN'].includes(row.status)) fail('Invalid observation identity');
  if (typeof row.querySubmitted !== 'boolean' || !string(row.note, 20) || !obj(row.environment) || !string(row.environment.browser) || !string(row.environment.accountState) || !['model','productBuild'].every(key => row.environment[key] === null || string(row.environment[key]))) fail('Observation environment or redacted note missing');
  if (!obj(row.timing) || !((row.timing.startedAt === null && row.timing.finishedAt === null) || (iso(row.timing.startedAt) && iso(row.timing.finishedAt) && Date.parse(row.timing.finishedAt) >= Date.parse(row.timing.startedAt)))) fail('Invalid timing endpoints');
  const elapsed = row.timing.startedAt === null ? null : Date.parse(row.timing.finishedAt) - Date.parse(row.timing.startedAt);
  if (!(row.timing.firstUsefulMs === null || (count(row.timing.firstUsefulMs) && elapsed !== null && row.timing.firstUsefulMs <= elapsed))) fail('Invalid first-useful latency');
  if (!(row.interventions === null || (Array.isArray(row.interventions) && row.interventions.length <= 30 && row.interventions.every(i => string(i, 3, 500))))) fail('Invalid intervention record');
  if (!obj(row.cost) || !(row.cost.usd === null || (Number.isFinite(row.cost.usd) && row.cost.usd >= 0)) || (row.cost.usd === null ? row.cost.basis !== 'UNAVAILABLE' : row.cost.basis !== 'ATTRIBUTABLE_ACCOUNT_RECEIPT' || !string(row.cost.receipt, 10, 200))) fail('Unknown cost is not zero or an estimate');
  if (!Array.isArray(row.sources) || row.sources.length > 30 || !unique(row.sources.map(s => s.id)) || !unique(row.sources.map(s => new URL(s.url).href)) || row.sources.some(s => !string(s.id) || !publicUrl(s.url) || !string(s.title) || !string(s.locator) || !['OFFICIAL','DISCOVERY'].includes(s.kind) || !['SURFACE','REFERENCE_CHECK'].includes(s.origin))) fail('Invalid or duplicated source references');
  if (row.sources.some(s => s.kind === 'OFFICIAL' && !catalog.sources.some(known => known.url === s.url))) fail('Official sources must match the frozen truth catalog');
  if (row.artifact !== null) validateReceipt(row.artifact);
  const unavailable = row.status !== 'OBSERVED';
  if (unavailable) {
    if (row.answerVisible !== null || row.deliverableVisible !== null || row.sources.length || row.artifact !== null || row.boundary !== null) fail('Unavailable observation cannot carry observed outcomes');
    if (row.status === 'NOT_RUN' && row.querySubmitted) fail('A submitted attempt cannot be NOT_RUN');
    if (row.status === 'BLOCKED' && !string(row.accessReference, 10)) fail('A block needs an observed access reference');
  } else {
    if (!row.querySubmitted || typeof row.answerVisible !== 'boolean' || typeof row.deliverableVisible !== 'boolean' || !['RESPONSE','SEARCH_PAGE'].includes(row.boundary)) fail('Missing observed response boundary');
    if (row.boundary === 'SEARCH_PAGE' && (row.answerVisible || row.deliverableVisible || row.artifact !== null)) fail('Search-page discovery cannot claim an answer or export');
    if ((row.surface === 'YouTube Search' || row.surface === 'TikTok Search') && row.boundary !== 'SEARCH_PAGE') fail('Do not silently widen video-search scope');
    if (row.artifact !== null && !row.deliverableVisible) fail('Export needs a visible deliverable');
  }
  // Reject outcome flags that would bypass per-fact coding.
  if (['taskCompleted','factsCorrect','factsChecked','evidenceRetained','artifactSaved'].some(key => key in row)) fail('Outcomes are derived, not entered');
  return row;
}
function validateCoding(code, observation, catalog) {
  if (!obj(code) || observation.status !== 'OBSERVED' || !obj(code.coder) || !/^[A-Za-z0-9-]{3,60}$/.test(code.coder.id) || !['AGENT','INDEPENDENT_HUMAN'].includes(code.coder.kind) || !iso(code.codedAt) || !string(code.note, 10)) fail('Invalid coder or unavailable observation');
  const task = catalog.tasks.find(t => t.id === observation.taskId);
  if (!Array.isArray(code.facts) || !equalSet(code.facts.map(f => f.id), task.factIds) || !Array.isArray(code.criteria) || !equalSet(code.criteria.map(c => c.id), task.criteria.map(c => c.id))) fail('Coding must include every frozen fact and criterion exactly once');
  for (const fact of code.facts) {
    if (!['CORRECT','INCORRECT','MISSING','UNCHECKABLE','UNSCORED'].includes(fact.verdict) || !string(fact.note, 10) || !Array.isArray(fact.sourceIds) || !unique(fact.sourceIds) || fact.sourceIds.some(id => !observation.sources.some(s => s.id === id))) fail('Invalid fact verdict or source reference');
    if (fact.verdict === 'CORRECT' || fact.verdict === 'INCORRECT') {
      const expected = catalog.facts.find(f => f.id === fact.id).sourceIds.map(id => catalog.sources.find(s => s.id === id).url);
      const retained = fact.sourceIds.map(id => observation.sources.find(s => s.id === id)).filter(s => s.kind === 'OFFICIAL').map(s => s.url);
      if (expected.some(url => !retained.includes(url)) || !string(fact.responseLocator, 5, 1000)) fail('Checked facts need official evidence and a response location');
    } else if (!(fact.responseLocator === null || string(fact.responseLocator, 5, 1000))) fail('Invalid response location');
    if (observation.boundary === 'SEARCH_PAGE' && fact.verdict !== 'UNSCORED') fail('Search results do not establish video facts');
  }
  for (const criterion of code.criteria) if (!['PASS','FAIL','UNASSESSED'].includes(criterion.verdict) || !string(criterion.note, 10) || (criterion.verdict === 'PASS' && !observation.deliverableVisible) || (observation.boundary === 'SEARCH_PAGE' && criterion.verdict !== 'UNASSESSED')) fail('Invalid deliverable criterion');
  return code;
}
export function makeEvent(catalog, previous, payload, recordedAt = new Date().toISOString()) {
  const content = { schema: SCHEMA, catalogHash: digest(catalog), sequence: previous ? previous.sequence + 1 : 0, previousHash: previous?.hash ?? null, recordedAt, payload };
  return { ...content, hash: digest(content) };
}
export function readEvents(events, catalog) {
  validateCatalog(catalog);
  if (!Array.isArray(events) || events.length > 500 || !events.length) fail('Missing or oversized ledger');
  const state = { observations: [], codings: [], adjudications: [] };
  const slots = new Set();
  let previous;
  for (const event of events) {
    const { hash, ...content } = event;
    if (event.schema !== SCHEMA || event.catalogHash !== digest(catalog) || event.sequence !== (previous ? previous.sequence + 1 : 0) || event.previousHash !== (previous?.hash ?? null) || !iso(event.recordedAt) || hash !== digest(content)) fail('Ledger hash chain or frozen catalog changed');
    const payload = event.payload;
    if (!obj(payload)) fail('Invalid ledger event');
    if (!previous) {
      if (payload.type !== 'ROUND' || payload.roundId !== catalog.roundId || !string(payload.collectorVersion)) fail('First event must open the frozen round');
    } else if (payload.type === 'OBSERVATION') {
      const row = validateObservation(payload.observation, catalog), key = `${row.taskId}:${row.surface}:${row.repetition}`;
      if (slots.has(key) || state.observations.some(o => o.id === row.id)) fail('Attempt already recorded; never replace an initial attempt');
      slots.add(key); state.observations.push(row);
    } else if (payload.type === 'CODING') {
      const row = state.observations.find(o => o.id === payload.observationId);
      if (!row) fail('Unknown observation');
      validateCoding(payload.coding, row, catalog);
      if (state.codings.some(c => c.observationId === row.id && c.coding.coder.id === payload.coding.coder.id)) fail('Coder already recorded; use an explicit adjudication for corrections');
      if (state.codings.some(c => c.coding.coder.id === payload.coding.coder.id && c.coding.coder.kind !== payload.coding.coder.kind)) fail('Coder identity cannot change roles');
      state.codings.push(payload);
    } else if (payload.type === 'ADJUDICATION') {
      const row = state.observations.find(o => o.id === payload.observationId);
      const codes = state.codings.filter(c => c.observationId === payload.observationId);
      if (!row || codes.length < 1 || !string(payload.reason, 20) || !Array.isArray(payload.supersedesCoderIds) || !equalSet(payload.supersedesCoderIds, codes.map(c => c.coding.coder.id)) || state.adjudications.some(a => a.observationId === row.id)) fail('Invalid adjudication; preserve original codings and explain the resolution');
      validateCoding(payload.coding, row, catalog);
      state.adjudications.push(payload);
    } else fail('Unknown event type');
    previous = event;
  }
  return state;
}
function verdicts(code) { return code.facts.map(f => `${f.id}:${f.verdict}`).sort().concat(code.criteria.map(c => `${c.id}:${c.verdict}`).sort()).join('|'); }
function outcome(row, state, catalog) {
  const codes = state.codings.filter(c => c.observationId === row.id).map(c => c.coding);
  const conflict = new Set(codes.map(verdicts)).size > 1;
  const adjudication = state.adjudications.find(a => a.observationId === row.id);
  const code = adjudication?.coding ?? (conflict ? null : codes[0] ?? null);
  const unavailable = row.status !== 'OBSERVED';
  const surfaceOfficial = new Set(row.sources.filter(s => s.kind === 'OFFICIAL' && s.origin === 'SURFACE').map(s => s.url));
  const supports = code?.facts.every(f => catalog.facts.find(g => g.id === f.id).sourceIds.every(id => surfaceOfficial.has(catalog.sources.find(s => s.id === id).url)));
  const completed = code ? row.answerVisible && row.deliverableVisible && supports && code.facts.every(f => f.verdict === 'CORRECT') && code.criteria.every(c => c.verdict === 'PASS') : null;
  const independentlyCoded = codes.some(c => c.coder.kind === 'INDEPENDENT_HUMAN') && new Set(codes.map(c => c.coder.id)).size >= 2;
  const elapsedMs = row.timing.startedAt === null ? null : Date.parse(row.timing.finishedAt) - Date.parse(row.timing.startedAt);
  return { observationId: row.id, taskId: row.taskId, surface: row.surface, status: row.status, note: row.note, environment: row.environment,
    answer: unavailable ? null : row.answerVisible, discovery: unavailable ? null : row.sources.some(s => s.origin === 'SURFACE'),
    completion: unavailable ? null : completed, export: unavailable ? null : row.artifact !== null,
    evidenceSources: unavailable ? null : surfaceOfficial.size,
    facts: code ? Object.fromEntries(['CORRECT','INCORRECT','MISSING','UNCHECKABLE','UNSCORED'].map(v => [v, code.facts.filter(f => f.verdict === v).length])) : null,
    independentReview: independentlyCoded, disagreement: conflict, adjudicated: Boolean(adjudication),
    elapsedMs, captureWindowWithinLimit: elapsedMs === null || unavailable ? null : elapsedMs <= catalog.pilot.maxPerAttemptSeconds * 1000,
    interventions: row.interventions?.length ?? null, costUsd: row.cost.usd, sources: row.sources, artifact: row.artifact };
}
export function summarize(events, catalog) {
  const state = readEvents(events, catalog);
  const rows = state.observations.map(row => outcome(row, state, catalog));
  return { schema: SCHEMA, roundId: catalog.roundId, catalogHash: digest(catalog), ledgerHead: events.at(-1).hash,
    historicalComparison: catalog.historicalComparison, catalogTasks: catalog.tasks.length, pilotTasks: catalog.pilotTaskIds.length, planned: catalog.pilot.plannedSlots,
    recorded: rows.length, unrecorded: catalog.pilot.plannedSlots - rows.length,
    surfaces: catalog.surfaces.map(surface => {
      const selected = rows.filter(row => row.surface === surface);
      const raw = state.observations.filter(row => row.surface === surface);
      const measure = key => ({ measured: selected.filter(r => r[key] !== null).length, yes: selected.filter(r => r[key] === true).length });
      return { surface, planned: catalog.pilotTaskIds.length, recorded: selected.length, submitted: raw.filter(r => r.querySubmitted).length,
        observed: selected.filter(r => r.status === 'OBSERVED').length, blocked: selected.filter(r => r.status === 'BLOCKED').length,
        notRun: selected.filter(r => r.status === 'NOT_RUN').length, unrecorded: catalog.pilotTaskIds.length - selected.length,
        answer: measure('answer'), discovery: measure('discovery'), completion: measure('completion'), export: measure('export'),
        disagreements: selected.filter(r => r.disagreement).length, independentReviews: selected.filter(r => r.independentReview).length,
        captureWindowExceeded: selected.filter(r => r.captureWindowWithinLimit === false).length,
        costUsd: selected.length === catalog.pilotTaskIds.length && selected.every(r => r.costUsd !== null) ? selected.reduce((n,r) => n + r.costUsd, 0) : null };
    }), observations: rows };
}
