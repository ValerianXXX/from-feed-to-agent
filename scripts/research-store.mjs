import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { makeEvent, readEvents, validateReceipt } from './research-ledger.mjs';

const MAX_LEDGER_BYTES = 4_000_000;
export async function readLedger(file, catalog) {
  const info = await fs.lstat(file);
  if (!info.isFile() || info.isSymbolicLink() || info.size > MAX_LEDGER_BYTES) throw new Error('Invalid ledger file');
  const source = await fs.readFile(file, 'utf8');
  if (!source.endsWith('\n')) throw new Error('Interrupted ledger tail; preserve the file for recovery, do not truncate');
  const lines = source.slice(0, -1).split('\n');
  const events = lines.map(line => JSON.parse(line));
  readEvents(events, catalog);
  return events;
}
export async function verifyArtifact(root, receipt) {
  validateReceipt(receipt);
  const base = await fs.realpath(root), candidate = path.resolve(base, receipt.path);
  const parent = await fs.realpath(path.dirname(candidate));
  if (parent !== path.join(base, 'artifacts')) throw new Error('Artifact directory must stay inside the ledger directory');
  const info = await fs.lstat(candidate);
  if (!info.isFile() || info.isSymbolicLink() || info.size !== receipt.bytes) throw new Error('Artifact missing, replaced or not a regular file');
  const contents = await fs.readFile(candidate);
  if (createHash('sha256').update(contents).digest('hex') !== receipt.sha256) throw new Error('Artifact hash mismatch');
}
export async function verifyArtifacts(file, events) {
  for (const event of events) if (event.payload.type === 'OBSERVATION' && event.payload.observation.artifact !== null) await verifyArtifact(path.dirname(file), event.payload.observation.artifact);
}
export async function prepareLedger(file, catalog) {
  const event = makeEvent(catalog, null, { type: 'ROUND', roundId: catalog.roundId, collectorVersion: '2.0.0' });
  readEvents([event], catalog);
  const handle = await fs.open(file, 'wx', 0o600);
  try { await handle.writeFile(`${JSON.stringify(event)}\n`); await handle.sync(); } finally { await handle.close(); }
  return [event];
}
export async function appendEvent(file, catalog, payload) {
  // Exclusive writer lock. Never remove somebody else's stale or active lock.
  const lockPath = `${file}.lock`;
  let lock;
  try { lock = await fs.open(lockPath, 'wx', 0o600); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('Ledger locked; inspect the owning collector before manual recovery'); throw error; }
  try {
    await lock.writeFile(JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }));
    const events = await readLedger(file, catalog), event = makeEvent(catalog, events.at(-1), payload);
    const candidate = [...events, event];
    readEvents(candidate, catalog);
    await verifyArtifacts(file, candidate);
    const line = `${JSON.stringify(event)}\n`;
    if ((await fs.stat(file)).size + Buffer.byteLength(line) > MAX_LEDGER_BYTES) throw new Error('Ledger size limit reached');
    const handle = await fs.open(file, 'a');
    try { await handle.writeFile(line); await handle.sync(); } finally { await handle.close(); }
    return candidate;
  } finally { await lock.close(); await fs.unlink(lockPath); }
}
