# Public research data — From Feed to Agent

This bundle contains privacy-safe derived data for 192 accepted formal observations plus aggregate survey outputs.

## Start here

| File | Rows | Purpose |
|---|---:|---|
| `study_a_observation_features_public.csv` | 192 | One derived feature row per formal observation |
| `study_a_metric_scores_long_public.csv` | 3,264 | One explicit metric-state row per observation and frozen metric |
| `study_a_validation_claim_checks_public.csv` | 136 | Four-state results for six named claim-check tasks |
| `study_a_coding_audit_results_public.csv` | 48 | Stratified protocol-consistency audit |
| `survey_key_estimates.csv` | aggregate | Primary and expanded survey estimates with item-specific denominators |
| `DATA_DICTIONARY.csv` | 13 | Plain-language state and table definitions |

## Survey layers

The primary layer contains 73 respondents. The expanded sensitivity layer contains 122 respondents and **includes all 73 primary respondents** plus 49 additional respondents. The layers are nested, not additive. All 149 raw submissions remain preserved privately; participant-level rows are not included here.

## Privacy boundary

The bundle excludes birth fields, timestamps, respondent identifiers, account identifiers, raw logged-in evidence, exact prompts, local capture paths, and answer excerpts. Observation IDs identify frozen research tasks, not people.

## Interpretation

The data support surface-specific task-fit roles, operational response-state findings, and four-state results for six named validation tasks. They do not support causal or population inference, a platform-wide failure rate, or broad recommendation-accuracy ranking.
