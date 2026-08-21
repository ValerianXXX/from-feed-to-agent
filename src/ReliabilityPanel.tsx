function Tiles({ generated, failures, label }: { generated: number; failures: number; label: string }) {
  return (
    <div className="tile-set" aria-label={`${label}: ${generated} generated, ${failures} generation failures`}>
      {Array.from({ length: 48 }, (_, index) => {
        const failed = index >= generated && index < generated + failures;
        return <span key={index} className={failed ? "tile failed" : "tile generated"} title={failed ? "Generation failed; fallback results visible" : "Initial answer generated"} />;
      })}
    </div>
  );
}

export function ReliabilityPanel() {
  return (
    <div className="reliability-panel">
      <div className="reliability-main">
        <div className="reliability-row">
          <div><span>Google AI Mode</span><strong>40 / 48</strong></div>
          <Tiles generated={40} failures={8} label="Google AI Mode" />
          <p><b>Round 1 · 24/24</b><b>Round 2 · 16/24</b></p>
        </div>
        <div className="reliability-row">
          <div><span>ChatGPT</span><strong>48 / 48</strong></div>
          <Tiles generated={48} failures={0} label="ChatGPT" />
          <p><b>Round 1 · 24/24</b><b>Round 2 · 24/24</b></p>
        </div>
      </div>
      <div className="reliability-legend">
        <span><i className="generated" />Initial answer generated</span>
        <span><i className="failed" />Generation failed; fallback results visible</span>
      </div>
    </div>
  );
}
