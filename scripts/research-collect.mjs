import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { summarize, validateCatalog } from './research-ledger.mjs';
import { appendEvent, prepareLedger, readLedger, verifyArtifacts } from './research-store.mjs';

export async function main(args = process.argv.slice(2)) {
  const [action, catalogFile, ledgerFile, payloadFile] = args;
  if (!['prepare','append','summarize'].includes(action) || !catalogFile || !ledgerFile) throw new Error('Usage: research-collect.mjs prepare|append|summarize catalog.json ledger.jsonl [event.json]');
  const catalog = validateCatalog(JSON.parse(await fs.readFile(catalogFile, 'utf8')));
  let events;
  if (action === 'prepare') events = await prepareLedger(ledgerFile, catalog);
  else if (action === 'append') {
    if (!payloadFile || (await fs.stat(payloadFile)).size > 100_000) throw new Error('Provide a bounded event JSON file');
    events = await appendEvent(ledgerFile, catalog, JSON.parse(await fs.readFile(payloadFile, 'utf8')));
  } else events = await readLedger(ledgerFile, catalog);
  await verifyArtifacts(ledgerFile, events);
  return summarize(events, catalog);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().then(result => console.log(JSON.stringify(result, null, 2))).catch(error => { console.error(error.message); process.exitCode = 1; });
