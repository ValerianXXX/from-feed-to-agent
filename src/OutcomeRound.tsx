import { useState } from 'react';
import rawSummary from '../public/rounds/2026-10-29/summary.json';
import catalog from '../public/rounds/2026-10-29/tasks.json';

type Measure = { measured: number; yes: number };
type Observation = {
  observationId: string; taskId: string; surface: string; status: string; note: string;
  environment: { browser: string; accountState: string; model: string | null; productBuild: string | null };
  answer: boolean | null; discovery: boolean | null; completion: boolean | null; export: boolean | null;
  evidenceSources: number | null; facts: Record<string, number> | null; independentReview: boolean;
  disagreement: boolean; adjudicated: boolean; elapsedMs: number | null; interventions: number | null; costUsd: number | null;
  captureWindowWithinLimit?: boolean | null;
  artifact: { path: string; sha256: string; bytes: number; mediaType: string } | null;
  sources: { id: string; url: string; title: string; origin: string }[];
};
type Summary = {
  planned: number; recorded: number; unrecorded: number; catalogTasks: number; pilotTasks: number; catalogHash: string;
  surfaces: { surface: string; submitted: number; observed: number; blocked: number; notRun: number; unrecorded: number; answer: Measure; discovery: Measure; completion: Measure; export: Measure; independentReviews: number; disagreements: number; captureWindowExceeded: number }[];
  observations: Observation[];
};
const summary = rawSummary as Summary;
const measure = (value: Measure) => value.measured ? `${value.yes} / ${value.measured} assessed` : 'Not assessed';
const outcome = (value: boolean | null) => value === null ? 'Not assessed' : value ? 'Yes' : 'No';
const base = `${import.meta.env.BASE_URL}rounds/2026-10-29/`;

export function OutcomeRound() {
  const [surface, setSurface] = useState('Google AI Mode');
  const [taskId, setTaskId] = useState('all');
  const metrics = summary.surfaces.find(row => row.surface === surface)!;
  const rows = summary.observations.filter(row => row.surface === surface && (taskId === 'all' || row.taskId === taskId));
  return <section className="section round-section" id="new-round" aria-labelledby="outcome-round-title">
    <div className="section-heading split-heading"><div><p className="eyebrow">Outcome ledger · October 29, 2026</p><h2 id="outcome-round-title">A saved file still needs correct facts and usable evidence.</h2></div>
      <p>{summary.catalogTasks} newly authored tasks preserve the historical category and stage structure. This pilot selects {summary.pilotTasks} tasks across four surfaces: {summary.planned} planned slots, {summary.recorded} recorded, {summary.unrecorded} still unrecorded. It is not a platform ranking.</p></div>
    <div className="round-filter"><label htmlFor="outcome-surface">Research surface</label><select id="outcome-surface" value={surface} onChange={event => setSurface(event.target.value)}>{summary.surfaces.map(row => <option key={row.surface}>{row.surface}</option>)}</select>
      <label htmlFor="outcome-task">Task</label><select id="outcome-task" value={taskId} onChange={event => setTaskId(event.target.value)}><option value="all">All six pilot tasks</option>{catalog.tasks.filter(t => t.pilot).map(task => <option key={task.id} value={task.id}>{task.id} · {task.stage}</option>)}</select></div>
    <dl className="round-metrics" aria-label="All pilot tasks for selected surface">
      <div><dt>Visible answer</dt><dd>{measure(metrics.answer)}</dd></div>
      <div><dt>Source discovery</dt><dd>{measure(metrics.discovery)}</dd></div>
      <div><dt>Frozen task + evidence gate</dt><dd>{measure(metrics.completion)}</dd></div>
      <div><dt>Verified file export</dt><dd>{measure(metrics.export)}</dd></div>
    </dl>
    <p>{metrics.submitted} queries submitted · {metrics.observed} observations · {metrics.blocked} access-blocked slots · {metrics.notRun + metrics.unrecorded} not run or unrecorded · {metrics.captureWindowExceeded} late captures. Metrics above cover all six tasks for this surface; the task filter only changes the detail list.</p>
    <p className="plain-boundary">Completion uses every frozen fact and criterion plus the exact official references in the frozen catalog. Other official links remain visible but do not satisfy this conservative evidence gate. Researcher reference checks never count as platform discovery. Export verifies a saved file, not its correctness. Cost remains unknown where no attributable receipt exists.</p>
    <div className="round-observations">{rows.map(row => <article key={row.observationId}>
      <p className="eyebrow">{row.taskId} · {row.status}</p><p>{row.note}</p>
      <p>Task and evidence gate: <strong>{outcome(row.completion)}</strong> · File exported: <strong>{outcome(row.export)}</strong></p>
      {row.facts && <p className="round-meta">Frozen facts: {row.facts.CORRECT} correct · {row.facts.INCORRECT} incorrect · {row.facts.MISSING} missing · {row.facts.UNCHECKABLE} uncheckable · {row.facts.UNSCORED} unscored.</p>}
      <p className="round-meta">{row.elapsedMs === null ? 'Timing unmeasured' : `${(row.elapsedMs / 1000).toFixed(2)} s observation window`} · {row.interventions === null ? 'Interventions unmeasured' : `${row.interventions} extra operator actions`} · {row.environment.model || 'Model/build undisclosed'}</p>
      {row.captureWindowWithinLimit === false && <p className="plain-boundary">Protocol deviation: capture exceeded 120 seconds. Content can be inspected, but completion within the time limit is unconfirmed. This window is not model-only latency.</p>}
      {row.artifact && <p><a className="text-link" href={`${base}${row.artifact.path}`} download>Download observed decision note</a> · {row.artifact.bytes} bytes. This unedited research artifact may contain the errors described above; it is not a verified purchase or installation recommendation.</p>}
      <details><summary>Inspect source provenance and review state</summary>
        <p>{row.independentReview ? 'Independent second coding recorded.' : 'No independent second-coder review.'} {row.disagreement ? (row.adjudicated ? 'Disagreement retained with adjudication.' : 'Unresolved disagreement; completion withheld.') : 'No recorded coding disagreement.'}</p>
        <p className="round-meta">{row.environment.browser} · {row.environment.accountState}</p>
        {row.sources.length ? <ul>{row.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> · {source.origin === 'SURFACE' ? 'visible on surface' : 'researcher reference check'}</li>)}</ul> : <p>No source links were observed.</p>}
      </details>
    </article>)}</div>
    {!rows.length && <p role="status">No recorded observation for this selection. Prepared tasks are not research results.</p>}
    <details className="round-catalog"><summary>Inspect the frozen 24-task catalog</summary><ul>{catalog.tasks.map(task => <li key={task.id}><details><summary>{task.id} · {task.category} · {task.stage}{task.pilot ? ' · pilot' : ' · not sampled'}</summary><p>{task.prompt}</p></details></li>)}</ul></details>
    <div className="hero-actions"><a className="text-link" href={`${base}tasks.json`}>Frozen catalog ↗</a><a className="text-link" href={`${base}ledger.jsonl`}>Observation and coding ledger ↗</a><a className="text-link" href={`${base}summary.json`}>Derived metrics ↗</a></div>
    <p className="section-footnote">New public prompts, one round, session-specific access, search-page-only video observations and undisclosed model builds limit comparison. The historical August study and October 27 pilot below retain their original results.</p>
  </section>;
}
