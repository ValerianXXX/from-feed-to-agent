import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { digest, summarize } from './research-ledger.mjs';
import { readLedger, verifyArtifacts } from './research-store.mjs';

const directory = new URL('../public/rounds/2026-10-29/', import.meta.url);
const catalog = JSON.parse(await fs.readFile(new URL('tasks.json', directory), 'utf8'));
const file = fileURLToPath(new URL('ledger.jsonl', directory));
const events = await readLedger(file, catalog);
await verifyArtifacts(file, events);
const expected = summarize(events, catalog);
const published = JSON.parse(await fs.readFile(new URL('summary.json', directory), 'utf8'));
if (digest(expected) !== digest(published)) throw new Error('Published round metrics are stale or differ from the validated ledger');
console.log(JSON.stringify({ status:'PASS', catalogHash: digest(catalog), ledgerHead: events.at(-1).hash, recorded:expected.recorded, artifactsChecked:expected.observations.filter(r=>r.export).length }));
