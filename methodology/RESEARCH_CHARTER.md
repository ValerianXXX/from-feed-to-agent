# Research Charter

**Project:** From Feed to Agent
**Author:** Sihan Xu
**Method version:** 1.0-frozen-2026-08-17
**Last updated:** 2026-08-20
**Preregistration status:** FROZEN FOR STUDY A; SURVEY ANALYSIS PLAN DOCUMENTED RETROSPECTIVELY

## Core question

Which consumer discovery tasks are best served by feeds, conventional search, or AI agents - and where should content-led platforms orchestrate the handoff between them?

## Scope

- Market: United States
- Categories: wireless audio, robot vacuums, smart wearables
- Platforms: TikTok, YouTube, Google Search/AI Mode, and ChatGPT
- Journey stages: inspiration, comparison, validation, and shortlist formation
- Study window: observations collected in 2026, with each session timestamped in EDT and UTC
- Report language: American English

## Exclusions

- Internal platform CTR, conversion, retention, revenue, or ranking data
- Reverse engineering of recommendation algorithms
- Checkout completion, repurchase, or long-term product satisfaction
- Nationally representative or causal claims from this exploratory sample
- Confidential data, unauthorized personal data, login bypass, CAPTCHA bypass, or large-scale scraping

## Unit of analysis

### Study A1 - Active-query task observation

One task executed on one platform in one round. Planned sample: 24 tasks x 4 platforms x 2 rounds = 192 observations.

The platform entry points are:

- TikTok Search
- YouTube Search
- Google AI Mode, with conventional Google Search captured as a contextual comparator when AI Mode is unavailable or as specified by protocol
- ChatGPT's current consumer chat/search or product-research surface, recorded exactly as displayed

### Study A2 - Feed-supported inspiration session

One time-boxed feed session on TikTok or YouTube after a standardized, disclosed seeding procedure. A2 is analyzed separately and never inserted as a row in the four-platform A1 ranking.

### Study B - Retrospective structured choice survey

One eligible U.S. adult reporting the most recent time they seriously researched one target consumer-electronics category. The author-selected current configuration uses a 5–7 minute, choice-only Google Form with no participant prose, name, email, audio, video, or screen recording.

The completed dataset contains 149 preserved raw rows. The strict primary layer contains 73 consented current-U.S.-adult, recent-research, target-category-aligned responses. The expanded sensitivity layer contains 122 consented current-U.S.-adult recent-research responses and retains a documented screener/focus mismatch. Results are descriptive convenience-sample signals only.

## Fair-comparison principle

A feed is a passive or semi-passive recommendation interface, while search and agent surfaces are active-query interfaces. The study therefore separates three estimands:

1. **Task output quality under active intent:** Study A1.
2. **Feed-native inspiration value under controlled exposure:** Study A2.
3. **Participant-reported source choice and handoff behavior:** Study B. The current written design does not claim recorded behavioral observation.

No statement such as "feeds are better than agents" is permitted unless the statement names the specific task, protocol, observed sample, and metric.

## Study A1 protocol controls

- U.S. locale and English language.
- Device, browser/app version, account state, subscription tier, personalization state, and login state recorded for every observation.
- The same task intent is translated only enough to fit the platform's input conventions; all translations are retained.
- A fresh conversation is used for each ChatGPT task unless the task explicitly measures follow-up constraint retention.
- Google AI Mode tasks start in a fresh AI Mode thread where available.
- TikTok and YouTube results are captured from their search entry points. Passive feed content is excluded from A1.
- Results are captured before scoring. Coders do not rewrite platform output.
- Round 2 occurs on a different day or after at least 72 hours, subject to feature access.
- Formal metrics cannot be altered after the method is frozen merely because a ranking is inconvenient.

## Pilot and freeze gate

Before formal collection:

1. Pilot six tasks: one inspiration and one non-inspiration task per category, balanced across comparison, validation, and shortlist stages.
2. Test all four A1 platforms.
3. Review floor/ceiling effects, ambiguous rubric anchors, impossible truth checks, and timekeeping burden.
4. Document every change in `DECISION_LOG.md`.
5. Freeze `query_library.csv`, rubrics, platform protocol, product truth sheet version, and analysis plan with hashes and a timestamp.

Pilot rows are labeled `pilot` and excluded from formal findings.

## Planned measurement families

### Outcome quality

Relevance, factual accuracy, constraint satisfaction, product fit, result diversity, and coverage of important trade-offs.

### Decision efficiency

Time to first useful information, steps to shortlist, follow-up efficiency, constraint retention, platform exit, and task ease.

### Trust and integrity

Source transparency, creator attribution, commercial disclosure, uncertainty communication, unsupported claim rate, and verification behavior.

### Discovery value

Context richness, social proof, serendipity, personalization, scenario fit, and viewpoint diversity.

## Scoring principles

- Subjective items use an explicit 1, 3, and 5 anchored rubric with boundary rules.
- Missing means the item should have been observable but was not captured.
- N/A means the construct is structurally irrelevant to that task or surface; it is not converted to zero.
- Factual accuracy is checked only against versioned truth-sheet fields or cited primary evidence.
- No four-family cross-surface composite is reported because both Decision Efficiency metrics are structurally N/A in the completed single-turn run. Post-hoc observable-family profiles are sensitivity checks only.
- Sensitivity analysis tests alternate weights, leave-one-category-out, leave-one-platform-out, and outlier influence.

## Study B sample and safeguards

- Completed raw responses: 149; strict primary layer n=73; expanded sensitivity layer n=122.
- Eligibility: recent consumer-electronics purchase or serious comparison in the prior 12 months.
- Convenience sampling is disclosed and no national representativeness is claimed.
- Choice-based participant consent is required before inclusion; the survey collects no participant prose and therefore supports no participant quotations.
- Birth month/day and exact submission time are restricted matching fields, removed before analysis and public export.
- Category coverage is sought where practical, but the convenience sample does not support representative quotas.
- Responses describe remembered source use and preferences; no platform is required and no live task is observed.
- No audio, video, screen recording, public screenshot, name, or email is part of the current configuration.

## Analysis stance

The work is exploratory and descriptive. Counts, rates, medians, interquartile ranges, distributions, cross-tabs, diversity metrics, and transparent sensitivity checks are preferred. Statistical significance is not a completion requirement and will not be presented when the sample cannot defend it.

## Claims policy

Each consequential report claim must be entered in `data/processed/claim_register.csv` with supporting evidence, counterevidence, confidence, permitted wording, and prohibited overstatement. Observations, interpretations, and product hypotheses are labeled separately.
