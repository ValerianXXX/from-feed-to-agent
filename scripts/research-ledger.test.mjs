import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { digest, makeEvent, readEvents, summarize, validateCatalog } from './research-ledger.mjs';
import { appendEvent, prepareLedger, readLedger, verifyArtifact } from './research-store.mjs';

const catalog = JSON.parse(await fs.readFile(new URL('../public/rounds/2026-10-29/tasks.json', import.meta.url), 'utf8'));
const now = '2026-10-29T23:00:00.000Z';
const clone = value => structuredClone(value);
// Unit-test records only. These are never imported into a public observation ledger.
const sample = () => ({ id: 'fixture-wa-google', taskId: 'WA-I-01', surface: 'Google AI Mode', repetition: 1, synthetic: false,
  status: 'OBSERVED', querySubmitted: true, note: 'Unit test only: a structured answer and decision note are visible.',
  environment: { browser: 'Unit test', accountState: 'UNIT_TEST', model: null, productBuild: null },
  timing: { startedAt: now, finishedAt: '2026-10-29T23:00:01.000Z', firstUsefulMs: null }, interventions: [], cost: { usd: null, basis: 'UNAVAILABLE' },
  sources: catalog.sources.slice(0,2).map(s => ({ id:s.id, url:s.url, title:s.title, locator:s.locator, kind:'OFFICIAL', origin:'SURFACE' })),
  boundary: 'RESPONSE', answerVisible: true, deliverableVisible: true, artifact: null });
const coding = () => ({ coder:{ id:'coder-one', kind:'AGENT' }, codedAt:now, note:'Unit test coding only; not an observation.',
  facts: catalog.tasks[0].factIds.map(id => ({ id, verdict:'CORRECT', note:'Unit test fact checked against reference.', responseLocator:'Decision note, factual comparison', sourceIds:catalog.facts.find(f => f.id === id).sourceIds })),
  criteria: catalog.tasks[0].criteria.map(c => ({ id:c.id, verdict:'PASS', note:'Unit test requested criterion was present.' })) });
function build(row=sample(), code=coding()) {
  const events=[makeEvent(catalog,null,{type:'ROUND',roundId:catalog.roundId,collectorVersion:'unit-test'},now)];
  events.push(makeEvent(catalog,events.at(-1),{type:'OBSERVATION',observation:row},now));
  if(code) events.push(makeEvent(catalog,events.at(-1),{type:'CODING',observationId:row.id,coding:code},now));
  return events;
}
function add(events,payload) { return [...events,makeEvent(catalog,events.at(-1),payload,now)]; }
async function temp(t) { const root=await fs.mkdtemp(path.join(os.tmpdir(),'feed-ledger-test-')); t.after(()=>fs.rm(root,{recursive:true,force:true})); return root; }

test('catalog preserves 24 historical cells, six pilot tasks and 24 surface slots',()=>{
  validateCatalog(catalog); assert.equal(new Set(catalog.tasks.map(t=>t.historicalCell)).size,24);
  assert.deepEqual(catalog.pilotTaskIds.map(id=>id.slice(0,2)).sort(),['RV','RV','SW','SW','WA','WA']);
});
test('changed tasks or a hash-chain edit invalidate prior records',()=>{
  const events=build(); const changed=clone(catalog); changed.tasks[0].prompt+=' Changed.';
  assert.throws(()=>readEvents(events,changed),/catalog changed/);
  events[1].payload.observation.note='Modified after capture without preserving the event.';
  assert.throws(()=>readEvents(events,catalog),/hash chain/);
});
test('clear answer, correct task and export are separate outcomes',()=>{
  const result=summarize(build(),catalog), row=result.observations[0];
  assert.equal(row.answer,true); assert.equal(row.completion,true); assert.equal(row.export,false);
  assert.equal(result.surfaces[1].completion.yes,1); assert.equal(result.surfaces[1].completion.measured,1); assert.equal(result.unrecorded,23);
});
test('uncoded observations and missing cost remain unknown',()=>{
  const result=summarize(build(sample(),null),catalog);
  assert.equal(result.observations[0].completion,null); assert.equal(result.surfaces[1].costUsd,null);
  assert.equal(result.surfaces[1].completion.measured,0);
});
test('analyst reference checks cannot become platform discovery or retained evidence',()=>{
  const row=sample(); row.sources.forEach(s=>s.origin='REFERENCE_CHECK');
  const result=summarize(build(row),catalog).observations[0];
  assert.equal(result.facts.CORRECT,4); assert.equal(result.discovery,false); assert.equal(result.evidenceSources,0); assert.equal(result.completion,false);
});
for (const verdict of ['INCORRECT','MISSING','UNCHECKABLE','UNSCORED']) test(`${verdict} fact withholds completion`,()=>{
  const code=coding(); code.facts[0].verdict=verdict;
  assert.equal(summarize(build(sample(),code),catalog).observations[0].completion,false);
});
test('incomplete or duplicated fact vectors cannot shrink the denominator',()=>{
  for (const mutate of [c=>c.facts.pop(),c=>c.facts.push(clone(c.facts[0]))]) { const code=coding(); mutate(code); assert.throws(()=>readEvents(build(sample(),code),catalog),/every frozen fact/); }
});
test('a successful fact needs retained official evidence and a response location',()=>{
  const code=coding(); code.facts[0].sourceIds=[];
  assert.throws(()=>readEvents(build(sample(),code),catalog),/official evidence/);
  const absent=coding(); absent.facts[0].responseLocator=null;
  assert.throws(()=>readEvents(build(sample(),absent),catalog),/response location/);
});
test('hand-entered completion counters and duplicate evidence are rejected',()=>{
  const row=sample(); row.taskCompleted=true; assert.throws(()=>readEvents(build(row),catalog),/derived/);
  const duplicate=sample(); duplicate.sources.push({...duplicate.sources[0],id:'copy'});
  assert.throws(()=>readEvents(build(duplicate),catalog),/duplicated source/);
});
test('a truthy export marker cannot stand in for a saved artifact',()=>{
  const row=sample(); row.artifact=true; assert.throws(()=>readEvents(build(row),catalog),/file receipt/);
});
test('repeated attempts and synthetic research outcomes are rejected',()=>{
  const events=build(); assert.throws(()=>readEvents(add(events,{type:'OBSERVATION',observation:sample()}),catalog),/already recorded/);
  const row=sample(); row.synthetic=true; assert.throws(()=>readEvents(build(row),catalog),/identity/);
});
test('blocked or unrun slots never count as wrong answers',()=>{
  const row={...sample(),status:'BLOCKED',querySubmitted:false,answerVisible:null,deliverableVisible:null,boundary:null,sources:[],accessReference:'Visible access preflight challenge recorded in note.'};
  const result=summarize(build(row,null),catalog); assert.equal(result.surfaces[1].blocked,1); assert.equal(result.surfaces[1].completion.measured,0);
  row.answerVisible=false; assert.throws(()=>readEvents(build(row,null),catalog),/Unavailable/);
});
test('video search retains discovery without inventing video facts',()=>{
  const row={...sample(),surface:'YouTube Search',boundary:'SEARCH_PAGE',answerVisible:false,deliverableVisible:false};
  const code=coding(); code.facts.forEach(f=>f.verdict='UNSCORED'); code.criteria.forEach(c=>c.verdict='UNASSESSED');
  assert.equal(summarize(build(row,code),catalog).observations[0].discovery,true);
  assert.throws(()=>readEvents(build(row,coding()),catalog),/Search results/);
});
test('timing cannot run backwards and subscription cost is not zero',()=>{
  const row=sample(); row.timing.finishedAt='2026-10-29T22:59:59.000Z'; assert.throws(()=>readEvents(build(row),catalog),/timing/);
  const cost=sample(); cost.cost={usd:0,basis:'SUBSCRIPTION'}; assert.throws(()=>readEvents(build(cost),catalog),/Unknown cost/);
});
test('a late capture remains visible as a protocol deviation without inventing model latency',()=>{
  const row=sample(); row.timing.finishedAt='2026-10-29T23:02:15.000Z';
  const result=summarize(build(row),catalog);
  assert.equal(result.observations[0].completion,true); assert.equal(result.observations[0].captureWindowWithinLimit,false); assert.equal(result.surfaces[1].captureWindowExceeded,1);
});
test('second coding preserves disagreement without silently selecting a winner',()=>{
  const second=coding(); second.coder={id:'coder-two',kind:'INDEPENDENT_HUMAN'}; second.facts[0].verdict='INCORRECT';
  const events=add(build(),{type:'CODING',observationId:sample().id,coding:second});
  let row=summarize(events,catalog).observations[0]; assert.equal(row.disagreement,true); assert.equal(row.completion,null); assert.equal(row.independentReview,true);
  const resolved=add(events,{type:'ADJUDICATION',observationId:sample().id,supersedesCoderIds:['coder-one','coder-two'],reason:'Unit test resolver checked the retained source and original wording.',coding:coding()});
  row=summarize(resolved,catalog).observations[0]; assert.equal(row.completion,true); assert.equal(row.disagreement,true); assert.equal(row.adjudicated,true);
});
test('the same coder cannot impersonate an independent second review',()=>{
  const second=coding(); second.coder.kind='INDEPENDENT_HUMAN';
  assert.throws(()=>readEvents(add(build(),{type:'CODING',observationId:sample().id,coding:second}),catalog),/already recorded/);
});
test('file receipt verifies bytes, hash and local containment',async t=>{
  const root=await temp(t); await fs.mkdir(path.join(root,'artifacts')); const content=Buffer.from('A unit-test platform artifact.');
  const receipt={path:'artifacts/note.txt',sha256:createHash('sha256').update(content).digest('hex'),bytes:content.length,mediaType:'text/plain',provenance:'PLATFORM_EXPORT',savedAt:now};
  await fs.writeFile(path.join(root,receipt.path),content); await verifyArtifact(root,receipt);
  await assert.rejects(verifyArtifact(root,{...receipt,path:'../note.txt'}),/receipt/);
  await fs.writeFile(path.join(root,receipt.path),Buffer.alloc(content.length,65)); await assert.rejects(verifyArtifact(root,receipt),/hash mismatch/);
});
test('exclusive append retains original bytes and refuses a concurrent writer',async t=>{
  const root=await temp(t), file=path.join(root,'ledger.jsonl'); await prepareLedger(file,catalog);
  const before=await fs.readFile(file,'utf8'); await appendEvent(file,catalog,{type:'OBSERVATION',observation:sample()});
  assert.ok((await fs.readFile(file,'utf8')).startsWith(before)); assert.equal((await readLedger(file,catalog)).length,2);
  await fs.writeFile(`${file}.lock`,'other collector');
  await assert.rejects(appendEvent(file,catalog,{type:'CODING',observationId:sample().id,coding:coding()}),/locked/);
  assert.equal(await fs.readFile(`${file}.lock`,'utf8'),'other collector');
});
test('a failed append leaves the ledger intact; interrupted tails stay visible',async t=>{
  const root=await temp(t), file=path.join(root,'ledger.jsonl'); await prepareLedger(file,catalog); const before=await fs.readFile(file);
  await assert.rejects(appendEvent(file,catalog,{type:'UNKNOWN'})); assert.deepEqual(await fs.readFile(file),before);
  await fs.appendFile(file,'{"partial":'); await assert.rejects(readLedger(file,catalog),/Interrupted ledger tail/);
  assert.ok((await fs.readFile(file,'utf8')).endsWith('{"partial":'));
});
test('collector refuses to overwrite an existing round',async t=>{
  const root=await temp(t), file=path.join(root,'ledger.jsonl'); await prepareLedger(file,catalog);
  await assert.rejects(prepareLedger(file,catalog),{code:'EEXIST'});
});
test('canonical catalog identity ignores object-key order but not array order',()=>{
  assert.equal(digest({b:2,a:1}),digest({a:1,b:2})); assert.notEqual(digest([1,2]),digest([2,1]));
});
