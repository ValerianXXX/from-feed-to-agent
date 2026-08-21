"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    label: "Intent",
    note: "Budget, ecosystem, exclusions",
    kicker: "Capture",
    headline: "Write the decision before searching.",
    stat: "6 constraints locked",
    panel: "Intent passport",
    meta: "Approval on",
    rows: [["Budget ceiling", "≤ $400", "locked"], ["Phone ecosystem", "iPhone", "locked"], ["Pet-waste risk", "exclude", "alert"]],
    footer: "Shared only after approval",
  },
  {
    label: "Origin",
    note: "Creator, channel, source link",
    kicker: "Preserve",
    headline: "Keep every source attached.",
    stat: "4 origins retained",
    panel: "Origin ledger",
    meta: "Direct routes",
    rows: [["Creator review", "creator", "source"], ["Depth review", "channel", "source"], ["Product page", "direct link", "source"]],
    footer: "Creator · channel · date · URL",
  },
  {
    label: "Verify",
    note: "State, date, uncertainty",
    kicker: "Check",
    headline: "Separate known from uncertain.",
    stat: "3 claim states",
    panel: "Verification queue",
    meta: "1 open",
    rows: [["Battery life", "verified", "verified"], ["Pet-waste claim", "unclear", "alert"], ["Current price", "dated Aug 20", "dated"]],
    footer: "State · source · checked date",
  },
  {
    label: "Decide",
    note: "Trade-offs remain visible",
    kicker: "Compare",
    headline: "Make the trade-offs inspectable.",
    stat: "3 options compared",
    panel: "Decision canvas",
    meta: "3 open questions",
    rows: [["Battery life", "verified", "verified"], ["Pet-waste claim", "verify", "alert"], ["Budget fit", "$349", "dated"]],
    footer: "4 sources · origin preserved",
  },
] as const;

export function HeroFlow() {
  const [stage, setStage] = useState(0);
  const [manual, setManual] = useState(false);
  const scene = steps[stage];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || manual) return;
    const timer = window.setInterval(() => setStage((current) => (current + 1) % steps.length), 2600);
    return () => window.clearInterval(timer);
  }, [manual]);

  return (
    <div className="hero-flow" data-stage={stage} aria-label="Interactive illustration of evidence moving from scattered research into a decision canvas">
      <div className="flow-topline"><span>LIVE CONCEPT</span><b>Evidence handoff</b><i>01—04</i></div>
      <div className="flow-stage">
        <div className="fragment-cloud" aria-hidden="true">
          <span className="fragment f1">Budget &lt; $400</span>
          <span className="fragment f2">creator review</span>
          <span className="fragment f3">avoid pet waste</span>
          <span className="fragment f4">source · Aug 20</span>
          <span className="fragment f5">works with iPhone</span>
          <span className="fragment f6">sponsored?</span>
        </div>
        <div className="flow-rail" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="proof-node" aria-hidden="true">
          <span className="proof-ring" />
          <b>{String(stage + 1).padStart(2, "0")}</b>
          <small>{scene.label}</small>
        </div>
        <div className="stage-story" key={`story-${stage}`} aria-live="polite">
          <span>{scene.kicker}</span>
          <strong>{scene.headline}</strong>
          <small>{scene.stat}</small>
        </div>
        <div className={`decision-preview preview-stage-${stage}`} key={`panel-${stage}`} aria-hidden="true">
          <div className="preview-head"><span>{scene.panel}</span><i>{scene.meta}</i></div>
          {scene.rows.map(([label, value, tone]) => (
            <div className={`preview-row ${tone}`} key={label}><b>{label}</b><span>{value}</span></div>
          ))}
          <div className="preview-source">{scene.footer}</div>
        </div>
      </div>
      <div className="flow-controls" role="group" aria-label="Evidence handoff stage">
        {steps.map((step, index) => (
          <button key={step.label} type="button" aria-pressed={stage === index} onClick={() => { setManual(true); setStage(index); }}>
            <span>{String(index + 1).padStart(2, "0")}</span><b>{step.label}</b><small>{step.note}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
