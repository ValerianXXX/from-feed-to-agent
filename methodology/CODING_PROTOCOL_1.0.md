# Study A coding protocol 1.0

**Analysis date:** 2026-08-20
**Formal observations:** 192; 48 per platform, 96 per round
**Protocol calibration data:** retained internally and excluded before formal analysis
**Coder:** one rule-assisted coder; no inter-rater reliability is reported

## Unit and evidence boundary

The unit is one frozen query × platform × round observation. TikTok and YouTube are scored only from the first ten standard search-result titles, captions, metadata, direct item URLs, and visibly intervening modules preserved in the record. Videos were not watched. Google AI Mode and ChatGPT are scored from the complete visible initial-response boundary; follow-ups were not executed.

Every included observation must map to the frozen run order and retain its DOM/text transcript, SHA-256, structured record, and auxiliary screenshot. Weak output, an empty answer, or an observed error is not a rerun reason. Missing, not applicable, blocked, and scored states remain distinct.

## Operational response state

Each observation receives one state:

- `SEARCH_RESULTS_CAPTURED`: the frozen TikTok or YouTube search-result boundary is present.
- `INITIAL_RESPONSE_GENERATED`: the Google AI Mode or ChatGPT initial answer is present.
- `GENERATION_FAILED_WITH_FALLBACK_RESULTS`: Google AI Mode displayed fallback web results and an explicit generation failure. Fallback links remain evidence, but answer-dependent metrics are marked missing and are not inferred from result snippets.

## Metric families

Seventeen rubric states are emitted per observation: Outcome Quality (`OQ-01`–`OQ-06`), Decision Efficiency (`DE-01`–`DE-02`), Trust and Integrity (`TI-01`–`TI-04`), and Discovery Value (`DV-01`–`DV-05`). Each scored metric uses the published 1/3/5 anchors in `outputs/from-feed-to-agent_20260817/fieldwork/scoring_rubric.csv`, with 2 and 4 as intermediate anchor states.

Scores are paired with objective companions such as task-criterion coverage, hard-constraint coverage, relevant-result share, unique-brand ratio, HHI, normalized entropy, visible creator ratio, source-path proxy, commercial-disclosure rate, and marker counts. Marker-based companions are lexical proxies, not semantic ground truth.

## Conservative coding rules

1. Broad recommendation accuracy is `MISSING_TRUTH_SCOPE`; only the six frozen validation tasks receive claim-level adjudication against refreshed truth fields.
2. Google AI Mode generation failures are retained as outcomes. Relevance from fallback results is capped at 3; answer-dependent metrics are `MISSING`; an unmapped fallback link list cannot exceed 3 for source transparency.
3. ChatGPT source buttons preserve claim-adjacent publisher labels but not every destination URL in the structured record. Its `TI-01` score is therefore capped at 3 even when source-group coverage is complete.
4. Direct TikTok/YouTube items preserve an accessible item URL and visible origin identity. That supports source-path coding for the visible result claim only; it does not establish the authority or accuracy of the underlying video.
5. Search-result trade-off coverage is capped at 3 unless visible copy explicitly states who should choose or avoid each leading option. No unwatched content is credited.
6. Two frozen comparisons intentionally bound the option set to two approaches/brands. Showing both sides can reach the middle diversity anchor; respecting the task is not treated as poor diversity.
7. Validation truth states are `accurate`, `unsupported_or_ambiguous`, `material_error`, or `not_addressed`. A disclosed limitation is not coded as an error.
8. `DE-01` and `DE-02` are structurally not applicable because the run captured complete initial answers only. No cross-surface composite is reported; any three-family profile remains an explicitly post-hoc sensitivity analysis.

## Review and reproducibility

The rule-assisted pipeline is `scripts/analyze_formal_study_a.py`. It emits row-level scores, objective features, validation checks, platform/stage/category/round summaries, round-pair stability, and sensitivity scenarios with deterministic hashes.

A deterministic 25% stratified audit selected one observation from every platform × journey stage × category cell (48 observations). The audit examined the task, operational state, objective companions, score vector, and evidence excerpt; full transcripts were consulted for every flagged case. Six global rule corrections were applied and the full analysis was rerun. No row-level override was needed. Results are in `data/processed/study_a_coding_audit_results.csv`.

This audit improves internal consistency but does not create independent reliability. A second coder would still be required for inter-rater statistics.
