"use client";

import { useState } from "react";
import { surveyLayers } from "./research-data";

type LayerKey = keyof typeof surveyLayers;

export function SurveyExplorer() {
  const [layer, setLayer] = useState<LayerKey>("strict");
  const survey = surveyLayers[layer];

  return (
    <div className="survey-explorer" aria-label="Interactive survey sensitivity explorer">
      <div className="survey-heading">
        <div>
          <p className="micro-label">Two transparent views of the same survey</p>
          <h3>The 122-person layer includes the 73-person primary group.</h3>
        </div>
        <div className="layer-switch" role="group" aria-label="Survey analysis layer">
          {(Object.keys(surveyLayers) as LayerKey[]).map((key) => (
            <button key={key} type="button" aria-pressed={layer === key} onClick={() => setLayer(key)}>
              {surveyLayers[key].label}<span>n={surveyLayers[key].n}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="layer-note">{survey.note}</p>
      <div className="survey-columns">
        <div>
          <p className="chart-kicker">Preferred control for carrying research context</p>
          <div className="survey-bars">
            {survey.handoff.map((item) => (
              <div className="survey-bar" key={item.label}>
                <span>{item.label}<small>{item.n} of {item.denominator}</small></span>
                <i><b style={{ width: `${item.value * 2}%` }} /></i>
                <strong>{item.value.toFixed(1)}%</strong>
              </div>
            ))}
          </div>
          <p className="signal-note"><strong>Stable signal:</strong> the ranking is unchanged in both layers.</p>
        </div>
        <div>
          <p className="chart-kicker">Most requested product improvements</p>
          <div className="survey-bars compact">
            {survey.improvements.map((item) => (
              <div className="survey-bar" key={item.label}>
                <span>{item.label}<small>{item.n} of {item.denominator}</small></span>
                <i><b style={{ width: `${item.value * 2.5}%` }} /></i>
                <strong>{item.value.toFixed(1)}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="survey-footnote">Anonymous convenience sample; descriptive and exploratory. Item denominators are shown because one invalid multi-select response was excluded only from the affected item.</p>
    </div>
  );
}
