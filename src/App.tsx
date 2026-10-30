import { HeroFlow } from "./HeroFlow";
import { ReliabilityPanel } from "./ReliabilityPanel";
import { ResearchExplorer } from "./ResearchExplorer";
import { SurveyExplorer } from "./SurveyExplorer";
import { ValidationPanel } from "./ValidationPanel";
import { ResearchRound } from "./ResearchRound";
import { OutcomeRound } from "./OutcomeRound";
import { platforms, roadmap } from "./research-data";

const fileUrl = (name: string) => `${import.meta.env.BASE_URL}downloads/${name}`;

const downloads = [
  ["Research report", "Editable presentation", "from_feed_to_agent_final_report_20260820.pptx"],
  ["Report PDF", "Share-ready report", "from_feed_to_agent_final_report_20260820.pdf"],
  ["Method appendix", "Definitions, protocol, and limits", "from_feed_to_agent_method_appendix_20260820.pdf"],
  ["Analysis workbook", "Auditable tables and formulas", "from_feed_to_agent_final_analysis_20260820.xlsx"],
  ["LinkedIn carousel", "Editable social deck", "from_feed_to_agent_linkedin_carousel_20260820.pptx"],
  ["Carousel PDF", "Share-ready social carousel", "from_feed_to_agent_linkedin_carousel_20260820.pdf"],
  ["Public data", "Redacted row-level and aggregate bundle", "from_feed_to_agent_public_data_20260820.zip"],
];

export default function Home() {
  return (
    <main id="top">
      <nav className="nav" aria-label="Primary navigation">
        <a className="wordmark" href="#top"><span>F/A</span><b>From Feed to Agent</b></a>
        <div className="nav-links">
          <a href="#new-round">New pilot</a>
          <a href="#findings">Findings</a>
          <a href="#evidence">Evidence</a>
          <a href="#survey">Survey</a>
          <a href="#strategy">Product</a>
          <a href="#method">Method</a>
        </div>
        <a className="nav-cta" href={fileUrl("from_feed_to_agent_final_report_20260820.pdf")}>Read report <span>↗</span></a>
      </nav>

      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Independent product strategy research · Consumer electronics</p>
          <h1>The missing product is the handoff.</h1>
          <p className="lede">Discovery surfaces reveal possibilities. Agents organize decisions. The opportunity between them is a portable evidence layer that keeps intent, origin, uncertainty, and proof together.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#findings">See what the research found</a>
            <a className="text-link" href={fileUrl("from_feed_to_agent_final_report_20260820.pdf")}>Open report <span aria-hidden="true">↗</span></a>
          </div>
          <p className="hero-note">U.S.-target desktop study · captured August 17–20, 2026</p>
        </div>
        <HeroFlow />
      </header>

      <section className="evidence-strip" aria-label="Research scale">
        <div><span>01</span><strong>192</strong><small>formal observations</small></div>
        <div><span>02</span><strong>4</strong><small>research surfaces</small></div>
        <div><span>03</span><strong>2</strong><small>collection rounds</small></div>
        <div><span>04</span><strong>149</strong><small>survey submissions</small></div>
      </section>

      <OutcomeRound />
      <ResearchRound />

      <section className="section thesis" id="findings">
        <div className="section-number">01</div>
        <div className="thesis-copy">
          <p className="eyebrow">Executive finding</p>
          <h2>Research tools are becoming more alike on the surface—and more different in the evidence they leave behind.</h2>
          <p className="section-intro">The four surfaces were strongest at different moments in the journey, which makes the handoff between them the more valuable design problem.</p>
        </div>
        <div className="role-constellation">
          <div className="handoff-core"><span>THE PRODUCT</span><strong>Evidence<br />handoff</strong><small>intent · origin · state · proof</small></div>
          {platforms.map((platform, index) => (
            <a key={platform.id} className={`role-card role-${index + 1}`} href={`#evidence-${platform.id}`} aria-label={`Open ${platform.name} evidence`}>
              <span className="role-card-index">{String(index + 1).padStart(2, "0")} · {platform.verb}</span>
              <h3>{platform.name}</h3>
              <p>{platform.role}</p>
              <span className="role-card-cta">View evidence <i aria-hidden="true">↘</i></span>
            </a>
          ))}
        </div>
        <p className="plain-boundary">Platform comparisons are reported inside their captured evidence boundaries.</p>
      </section>

      <section className="section explorer-section" id="evidence">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Interactive evidence</p>
            <h2>Change the question. The role changes with it.</h2>
          </div>
          <p>Choose a metric, then select a surface. Definitions stay next to the chart so coverage, overlap, timing, and generation state are not mistaken for one score.</p>
        </div>
        <ResearchExplorer />
      </section>

      <section className="section dark-section reliability-section">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Operational reliability</p>
            <h2>A fallback page is not an AI answer.</h2>
          </div>
          <p>Eight Google AI Mode tasks in Round 2 showed an explicit generation failure with fallback results. Those states stayed visible in the analysis.</p>
        </div>
        <ReliabilityPanel />
        <p className="section-footnote">Observed in one account, browser, and time window. This describes the captured generation states, not a platform-wide failure rate.</p>
      </section>

      <section className="section validation-section">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Claim-level validation</p>
            <h2>Missing, unclear, and wrong are different states.</h2>
          </div>
          <p>Across six named validation tasks, 136 claim checks were coded against refreshed truth fields. Hover or focus the segments for definitions.</p>
        </div>
        <ValidationPanel />
        <div className="validation-insight">
          <strong>3 incorrect claims</strong>
          <p>All three were narrow robot-vacuum overclaims in captured Google AI Mode answers. The remaining unresolved checks were either unclear/unsupported or not covered—not silently scored as wrong.</p>
        </div>
      </section>

      <section className="section survey-section" id="survey">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Consumer survey</p>
            <h2>Respondents favored control over what travels with them.</h2>
          </div>
          <p>The primary and expanded layers tell the same handoff story: approval-led control ranks first, automatic carry ranks second, and no carry ranks third.</p>
        </div>
        <SurveyExplorer />
      </section>

      <section className="section strategy-section" id="strategy">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Product direction</p>
            <h2>Build the bridge, not another destination.</h2>
          </div>
          <p>The research supports prototyping an evidence handoff. User adoption, willingness to pay, and product-market fit remain to be tested.</p>
        </div>

        <div className="architecture" aria-label="Evidence handoff architecture">
          <div className="architecture-source"><span>DISCOVER</span><b>Feeds + reviews</b><small>possibilities and origin</small></div>
          <div className="architecture-flow"><i /><i /><i /><span>portable evidence</span></div>
          <div className="architecture-core">
            <span>HANDOFF LAYER</span>
            <div><b>Intent</b><b>Origin</b><b>State</b><b>Proof</b></div>
          </div>
          <div className="architecture-flow"><i /><i /><i /><span>structured decision</span></div>
          <div className="architecture-source"><span>DECIDE</span><b>Agents + canvas</b><small>trade-offs and next actions</small></div>
        </div>

        <div className="roadmap-grid">
          <div className="roadmap-column first">
            <div className="roadmap-heading"><span>NOW</span><h3>Build first</h3><p>Core trust and control loop</p></div>
            {roadmap.first.map((item, index) => (
              <article key={item.name}><span>{String(index + 1).padStart(2, "0")}</span><div><h4>{item.name}</h4><p>{item.job}</p></div></article>
            ))}
          </div>
          <div className="roadmap-column next">
            <div className="roadmap-heading"><span>NEXT</span><h3>Build next</h3><p>Portability and provenance depth</p></div>
            {roadmap.next.map((item, index) => (
              <article key={item.name}><span>{String(index + 5).padStart(2, "0")}</span><div><h4>{item.name}</h4><p>{item.job}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section method-section" id="method">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Method and lineage</p>
            <h2>Enough detail to reproduce the logic—without turning the homepage into a lab notebook.</h2>
          </div>
          <a className="outline-button" href={fileUrl("from_feed_to_agent_method_appendix_20260820.pdf")}>Open method appendix <span>↗</span></a>
        </div>
        <div className="method-summary">
          <div><strong>3</strong><span>categories</span></div><i>×</i>
          <div><strong>4</strong><span>journey stages</span></div><i>×</i>
          <div><strong>2</strong><span>tasks</span></div><i>×</i>
          <div><strong>4</strong><span>surfaces</span></div><i>×</i>
          <div><strong>2</strong><span>rounds</span></div><i>=</i>
          <div className="method-total"><strong>192</strong><span>formal observations</span></div>
        </div>
        <div className="method-details">
          <details open>
            <summary>What was actually observed</summary>
            <p>TikTok and YouTube were coded from visible search-page text, metadata, links, and modules; videos were not watched. Google AI Mode and ChatGPT were coded from complete initial answers; follow-up dialogue was outside scope.</p>
          </details>
          <details>
            <summary>How truth and missing states were handled</summary>
            <p>Six named validation tasks were checked against refreshed official truth fields. Verified, unclear/unsupported, not covered, and incorrect were kept separate. Broad recommendation accuracy was not evaluated.</p>
          </details>
          <details>
            <summary>Survey and eligibility layers</summary>
            <p>All 149 anonymous submissions are preserved. The primary layer contains 73 respondents; the expanded sensitivity layer contains 122 and includes those 73. Results are descriptive, not population estimates.</p>
          </details>
          <details>
            <summary>Audit and public-data boundary</summary>
            <p>A stratified 48-observation coding audit checked protocol adherence. Public files exclude participant-level survey rows, account identifiers, exact prompts, local capture paths, and raw logged-in evidence.</p>
          </details>
        </div>
        <div className="source-row">
          <p>Official capability context</p>
          <a href="https://newsroom.tiktok.com/introducing-tiktok-shop/?lang=en">TikTok ↗</a>
          <a href="https://support.google.com/youtube/answer/12257682?hl=en">YouTube ↗</a>
          <a href="https://blog.google/products-and-platforms/products/search/ai-mode-search/">Google AI Mode ↗</a>
          <a href="https://openai.com/index/introducing-chatgpt-search/">ChatGPT search ↗</a>
        </div>
      </section>

      <section className="section download-section" id="downloads">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Public release</p>
            <h2>Read the story—or inspect every layer behind it.</h2>
          </div>
          <p>The package includes an editable report, method appendix, auditable workbook, social deck, and redacted public data.</p>
        </div>
        <div className="download-list">
          {downloads.map(([title, description, href], index) => (
            <a key={title} href={fileUrl(href)} download>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <small>{description}</small>
              <b aria-hidden="true">↓</b>
            </a>
          ))}
        </div>
        <div className="package-proof">
          <p><strong>192</strong> observation rows</p>
          <p><strong>3,264</strong> metric-state rows</p>
          <p><strong>136</strong> validation checks</p>
          <p><strong>48</strong> coding-audit rows</p>
        </div>
      </section>

      <footer>
        <div><span>F/A</span><p><strong>From Feed to Agent</strong><small>Independent product strategy research by Sihan Xu · 2026</small></p></div>
        <p><a href="https://github.com/ValerianXXX/from-feed-to-agent">Source and release history ↗</a></p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
