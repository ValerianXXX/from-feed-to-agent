import { useState } from "react";
import summary from "../public/rounds/2026-10-27/summary.json";
import run from "../public/rounds/2026-10-27/observations.json";

export function ResearchRound() {
  const [surface, setSurface] = useState("Google AI Mode");
  const metrics = summary.surfaces.find(row => row.surface === surface)!;
  const observations = run.observations.filter(row => row.surface === surface);
  const outcome = (value: { observed: number; yes: number }) => value.observed ? `${value.yes} / ${value.observed} observed` : "Not observed";
  return <section className="section round-section" id="round-2026-10-27" aria-labelledby="round-title">
    <div className="section-heading split-heading"><div><p className="eyebrow">New evidence · October 27, 2026</p><h2 id="round-title">An answer, a source and a completed task are different outcomes.</h2></div>
      <p>A small new pilot: 8 planned tasks across four surfaces, 5 submitted queries and 4 usable observations. Two new prompts cover two historical task cells. This is not a repeat of the full August study or a platform ranking.</p></div>
    <div className="round-filter"><label htmlFor="round-surface">Inspect a surface</label><select id="round-surface" value={surface} onChange={event => setSurface(event.target.value)}>{summary.surfaces.map(row => <option key={row.surface}>{row.surface}</option>)}</select></div>
    <dl className="round-metrics">
      <div><dt>Clear answer</dt><dd>{outcome(metrics.answer)}</dd></div><div><dt>Relevant sources found</dt><dd>{outcome(metrics.discovery)}</dd></div>
      <div><dt>Bounded task complete</dt><dd>{outcome(metrics.task)}</dd></div><div><dt>Saved handoff</dt><dd>{outcome(metrics.saved)}</dd></div>
    </dl>
    <p>{metrics.queriesSubmitted} queries submitted · {metrics.blocked} planned tasks blocked by access · attributable cost not measured. Observed wall time includes collection overhead.</p>
    <div className="round-observations">{observations.map(row => <article key={row.taskId}><p className="eyebrow">{row.taskId} · {row.status}</p><p>{row.note}</p>
      <p className="round-meta">{row.elapsedMs === null ? "Timing not measured" : `${(row.elapsedMs / 1000).toFixed(2)} s observation window`} · {row.environment.model || "Model/version undisclosed"}</p>
      {row.sources.length > 0 && <ul>{row.sources.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noreferrer">Retained source {index + 1}</a></li>)}</ul>}
    </article>)}</div>
    <p className="plain-boundary">Google's validation answer added an unsupported case rating. YouTube was inspected only as a search page. ChatGPT hit a browser verification challenge; TikTok required age entry. Unavailable tasks are not counted as wrong answers. No platform produced a saved handoff in this pilot.</p>
    <div className="hero-actions"><a className="text-link" href={`${import.meta.env.BASE_URL}rounds/2026-10-27/tasks.json`}>Frozen tasks ↗</a><a className="text-link" href={`${import.meta.env.BASE_URL}rounds/2026-10-27/observations.json`}>Redacted observations ↗</a></div>
    <p className="section-footnote">One coder, one round, new public prompts, different account states and undisclosed model builds. Required-fact checks do not certify unrequested shopping prices or warranty statements. Historical results below remain unchanged.</p>
  </section>;
}
