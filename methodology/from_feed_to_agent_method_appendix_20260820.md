# From Feed to Agent — Method Appendix

Author: Sihan Xu
Analysis date: 2026-08-20
Coding version: `study-a-coding-1.0-2026-08-20`

## 1. Study design

The formal benchmark used a frozen task lattice:

`3 categories × 4 journey stages × 2 tasks × 4 surfaces × 2 rounds = 192 observations`

The categories were headphones or earbuds, robot vacuums, and smartwatches or fitness wearables. The journey stages were inspire, compare, validate, and shortlist. Round 1 ran on August 17, 2026; Round 2 repeated the same lattice on August 20, 2026.

Twenty-four earlier observations were protocol pilots. They were excluded before formal analysis and retained only in internal lineage records.

## 2. Evidence boundaries

| Evidence family | Captured boundary | Included evidence | Explicit limit |
|---|---|---|---|
| TikTok and YouTube | Visible search-results page | Titles, captions, metadata, URLs, and visible modules | Videos were not watched |
| Google AI Mode and ChatGPT | Complete initial answer | Answer text, visible source labels or links, and generation state | No follow-up dialogue |
| Named validation tasks | Refreshed truth fields | Six specific product checks | Not broad recommendation accuracy |
| Consumer survey | Anonymous retrospective choices | 149 preserved submissions with primary and expanded eligibility layers | Not a probability sample |

The two evidence families were analyzed separately. Search-page coverage and generated-answer coverage were not converted into one cross-surface score.

## 3. Capture and acceptance

Each formal position passed five steps:

1. **Freeze** — use the exact query, surface, account context, and run position from the formal order.
2. **Capture** — save structured JSON plus mandatory visible DOM or text; screenshots are auxiliary.
3. **Hash** — calculate SHA-256 and preserve evidence paths in the structured record.
4. **Code** — apply the frozen criterion rubric and preserve missing or inapplicable states.
5. **QA** — run schema, evidence, hash, row-level, and round-level completeness checks.

A position entered the formal result only when its position, evidence, structured fields, hash, and QA state were complete. A documented access or generation failure remained a valid response state; it was not silently dropped or converted to a successful answer.

## 4. Response-state model

- `INITIAL_RESPONSE_GENERATED` — a complete initial answer appeared inside the captured agent boundary.
- `GENERATION_FAILED_WITH_FALLBACK` — the interface showed an explicit generation error and fallback results; those results were not recoded as an AI answer.
- `SEARCH_RESULTS_CAPTURED` — a visible TikTok or YouTube results page was captured.
- `NOT_APPLICABLE` — the metric did not belong to that evidence family.
- `MISSING` — the metric applied but could not be resolved from accepted evidence.

Google AI Mode generated 40 of 48 initial answers: 24 of 24 in Round 1 and 16 of 24 in Round 2. ChatGPT generated 48 of 48. These counts describe one account, browser, and time window; they are not platform-wide failure-rate estimates.

## 5. Named claim validation

Official truth fields were refreshed before each round. Only six named validation tasks entered the truth set.

| Public state | Stored state | Checks | Meaning |
|---|---|---:|---|
| Verified | `accurate` | 60 | The captured claim matched the refreshed truth field |
| Unclear / unsupported | `ambiguous` | 36 | The captured evidence did not support a confident verification |
| Not covered | `not_addressed` | 37 | The answer did not address the named check |
| Incorrect | `material_error` | 3 | The claim contradicted the refreshed truth field |

All three incorrect claims were narrow robot-vacuum overclaims in captured Google AI Mode answers. This truth set supports claim-level findings for the six named tasks, not a general accuracy rank for the four surfaces.

## 6. Survey layers

All 149 anonymous submissions are preserved in the private source workbook. Eligibility was frozen before analysis.

- **Primary layer, n=73** — current U.S. adult, consented, category-aligned, and researched a target consumer-electronics category in the prior 12 months.
- **Expanded sensitivity layer, n=122** — includes all 73 primary respondents plus 49 additional U.S. adults retained under broader eligibility.

The layers are nested, not additive. Isolated contradictory answers use item-level missingness instead of excluding the entire respondent wherever the estimand allows it.

For the handoff-control question, the primary / expanded shares were:

- approve each handoff: 41.1% / 40.2%;
- automatic handoff: 35.6% / 37.7%;
- no cross-product handoff: 23.3% / 22.1%.

The leading improvement request was direct links or citations to original sources: 34.7% primary and 32.2% expanded. These are descriptive convenience-sample signals, not U.S. population estimates.

## 7. Estimation and audit

Coverage is computed at observation level, aggregated to 24 frozen query clusters, and summarized by surface. Reported 95% intervals use 10,000 seeded bootstrap resamples of those query clusters (`seed = 20260820`). The intervals describe task-set variability inside this study, not consumer or platform populations.

A stratified 48-observation coding audit covered surfaces, categories, stages, and rounds. It checked stored evidence against the frozen protocol and recorded row-level findings. One coder performed the study and audit, so inter-rater reliability is unavailable; the audit supports protocol-consistency claims only.

## 8. Technical prioritization

The workbook retains a transparent heuristic:

`priority index = impact × evidence strength × feasibility ÷ trust risk`

Each input uses a 1–5 judgment scale. The index exposes assumptions for review; it is not a forecast of demand, adoption, revenue, willingness to pay, or product-market fit. Public product ordering therefore uses only **Build first** and **Build next** horizons.

## 9. Publication and lineage

The release separates three layers:

- **Public narrative** — site, report, presentation, and social carousel.
- **Technical evidence** — method appendix, analysis workbook, public row-level CSVs, data dictionary, and claim register.
- **Internal QA** — raw logged-in evidence, participant-level survey rows, account context, and detailed run records.

The lineage chain is `capture → SHA-256 → process → analyze → publish`. Public files contain 192 observation-feature rows, 3,264 metric-state rows, 136 validation checks, and 48 coding-audit rows. Participant-level survey rows, birth fields, timestamps, account identifiers, and raw logged-in evidence remain private.

## 10. Core interpretation limits

- No causal claim, population estimate, significance test, or cross-surface accuracy ranking.
- TikTok and YouTube findings apply only to captured visible search-page evidence.
- Google AI Mode and ChatGPT findings apply only to complete initial-answer boundaries.
- Only six named tasks were truth-checked; broad recommendation accuracy remains unmeasured.
- The product direction is evidence-backed concept work, not validated adoption, willingness to pay, or product-market fit.

## Reproducibility

Core scripts: `scripts/analyze_formal_study_a.py`, `scripts/finalize_coding_audit.py`, `scripts/export_survey_public_summary.py`, and `scripts/build_final_research_package.py`.

Survey source workbook SHA-256: `986f0c304ac6a1b955227f8dc5143e8bc14950ebd2c191f3e9586589c33a44a2`
Study A observation-feature SHA-256: `d6a8205e50391db7bc8fd6da3ec49db8400ad670498046f927caa526812b3612`
