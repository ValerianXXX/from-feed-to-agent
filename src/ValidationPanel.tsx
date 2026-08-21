import { platforms, validationTotals } from "./research-data";

const states = [
  { key: "verified", label: "Verified", description: "Matched the refreshed truth field", className: "verified" },
  { key: "unclear", label: "Unclear / unsupported", description: "Could not be verified from the captured evidence", className: "unclear" },
  { key: "notCovered", label: "Not covered", description: "The answer did not address the named check", className: "not-covered" },
  { key: "incorrect", label: "Incorrect", description: "Contradicted the refreshed truth field", className: "incorrect" },
] as const;

export function ValidationPanel() {
  const total = Object.values(validationTotals).reduce((sum, value) => sum + value, 0);
  return (
    <div className="validation-panel">
      <div className="validation-total" aria-label={`${total} named claim checks`}>
        <div className="donut" style={{ background: `conic-gradient(var(--verified) 0 ${(validationTotals.verified / total) * 100}%, var(--unclear) 0 ${((validationTotals.verified + validationTotals.unclear) / total) * 100}%, var(--not-covered) 0 ${((validationTotals.verified + validationTotals.unclear + validationTotals.notCovered) / total) * 100}%, var(--incorrect) 0 100%)` }}>
          <span><strong>{total}</strong><small>named checks</small></span>
        </div>
        <div className="state-key">
          {states.map((state) => (
            <div key={state.key}><i className={state.className} /><p><strong>{validationTotals[state.key]}</strong>{state.label}<small>{state.description}</small></p></div>
          ))}
        </div>
      </div>
      <div className="validation-by-surface">
        {platforms.map((platform) => {
          const n = Object.values(platform.validation).reduce((sum, value) => sum + value, 0);
          return (
            <div className="state-row" key={platform.id}>
              <strong>{platform.name}</strong>
              <div className="state-bar" aria-label={`${platform.name}, ${n} named checks`}>
                {states.map((state) => {
                  const value = platform.validation[state.key];
                  return value > 0 ? <span key={state.key} className={state.className} style={{ width: `${(value / n) * 100}%` }} title={`${value} ${state.label.toLowerCase()}`}>{value}</span> : null;
                })}
              </div>
              <small>n={n}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
