"use client";

import { useEffect, useMemo, useState } from "react";
import { platforms } from "./research-data";

type MetricKey = "coverage" | "roundOverlap" | "firstUsefulSeconds" | "generationRate";

const metricOptions: { key: MetricKey; label: string; unit: string; max: number; definition: string }[] = [
  { key: "coverage", label: "Scenario coverage", unit: "%", max: 100, definition: "How many frozen scenario criteria were visible in the captured boundary. This is not factual accuracy." },
  { key: "roundOverlap", label: "Round overlap", unit: "%", max: 60, definition: "How much the exact output repeated across rounds: URLs for search, tokens for generated answers." },
  { key: "firstUsefulSeconds", label: "First useful signal", unit: "s", max: 5, definition: "Time until the first useful visible signal appeared in the captured page state." },
  { key: "generationRate", label: "Answer generated", unit: "%", max: 100, definition: "Whether a complete initial answer appeared. This metric applies only to agent surfaces." },
];

function formatValue(value: number, unit: string) {
  return unit === "s" ? `${value.toFixed(value < 2 ? 2 : 1)}s` : `${value.toFixed(1)}%`;
}

export function ResearchExplorer() {
  const [metric, setMetric] = useState<MetricKey>("coverage");
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0].id);
  const metricMeta = useMemo(() => metricOptions.find((item) => item.key === metric)!, [metric]);
  const platform = platforms.find((item) => item.id === selectedPlatform)!;

  useEffect(() => {
    const selectFromHash = () => {
      const id = window.location.hash.replace("#evidence-", "");
      if (platforms.some((item) => item.id === id)) setSelectedPlatform(id);
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, []);

  return (
    <div className="explorer-shell" aria-label="Interactive research explorer">
      <div className="explorer-toolbar">
        <div className="metric-switch" role="group" aria-label="Research metric">
          {metricOptions.map((option) => (
            <button key={option.key} type="button" aria-pressed={metric === option.key} onClick={() => setMetric(option.key)}>
              {option.label}
            </button>
          ))}
        </div>
        <p className="metric-definition"><span>How to read it</span>{metricMeta.definition}</p>
      </div>

      <div className="metric-plot" role="list" aria-label={`${metricMeta.label} by surface`}>
        {platforms.map((item) => {
          const value = item[metric];
          const active = item.id === selectedPlatform;
          return (
            <button id={`evidence-${item.id}`} key={item.id} type="button" className={active ? "metric-row active" : "metric-row"} onClick={() => { setSelectedPlatform(item.id); window.history.replaceState(null, "", `#evidence-${item.id}`); }} aria-pressed={active}>
              <span className="metric-platform"><small>{item.verb}</small><strong>{item.name}</strong></span>
              {value === null ? (
                <span className="metric-na">Not applicable to search pages</span>
              ) : (
                <span className="metric-track" aria-label={`${item.name}: ${formatValue(value, metricMeta.unit)}`}>
                  <span className="metric-fill" style={{ width: `${Math.max(2, Math.min(100, (value / metricMeta.max) * 100))}%` }} />
                  <b>{formatValue(value, metricMeta.unit)}</b>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <article className={`platform-detail ${platform.family}`} aria-live="polite">
        <div className="platform-detail-heading">
          <p className="micro-label">Selected surface</p>
          <h3>{platform.role}</h3>
          <span>{platform.family === "agent" ? "Complete initial-answer boundary" : "Visible search-page boundary"}</span>
        </div>
        <div className="detail-grid">
          <p><strong>What it did well</strong>{platform.strength}</p>
          <p><strong>What to watch</strong>{platform.watchFor}</p>
          <p><strong>Best handoff</strong>{platform.handoff}</p>
        </div>
        <p className="provenance-note">{platform.provenanceNote}</p>
      </article>
    </div>
  );
}
