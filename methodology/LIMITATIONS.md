# Limitations

This file is maintained throughout the project. Items remain limitations even if their operational impact is mitigated.

## Design limitations

- The project compares observable consumer interfaces, not underlying models or ranking systems.
- Active-query results do not estimate the value of passive feeds. Feed-native inspiration is analyzed separately.
- A 24-task benchmark is broad enough for patterned comparison but too small for universal platform rankings.
- Product categories are deliberately narrow; findings should not be generalized to travel, finance, health, or low-consideration shopping.
- Recommendation tasks do not have a unique correct answer. Accuracy checks cover verifiable claims, while fit and diversity use transparent rubrics.

## Access and reproducibility limitations

- Results can vary by account history, subscription, locale, experiment assignment, app version, inventory, and time.
- TikTok Research API is restricted to qualifying, approved researchers and is not assumed available.
- TikTok Research API search data, when available, may use archived rather than current online data and therefore would not reproduce a live ranked UI.
- YouTube Data API results can support structured metadata collection but do not necessarily reproduce every personalized UI module or experiment.
- Google AI Mode and ChatGPT can generate non-deterministic answers even under the same task.
- Eight of 24 Google AI Mode Round 2 tasks in this captured session returned fallback web results plus an explicit generation failure. This is a formal observed reliability signal for the run, not a population failure-rate estimate.
- One YouTube observation preserved a mixed state in which the query and sponsored module updated while the first ten standard video results remained from the prior task. It is retained as an observed anomaly and sensitivity exclusion.
- Screenshot and transcript retention may be limited by platform terms, personal account privacy, or interface behavior.

## Fieldwork limitations

- Study B uses an anonymous convenience sample and is not nationally representative. The public analysis preserves 149 raw rows, uses a strict primary layer of 73, and an expanded sensitivity layer of 122.
- Participants who volunteer for an AI and shopping study may be more digitally engaged than the wider population.
- The current Study B design is a short retrospective choice survey rather than audio, video, screen recording, live observation, or a written task trace. It cannot validate exact timing, navigation order, unreported behavior, or the factual accuracy of remembered steps.
- Fixed choices reduce burden and missing prose but constrain nuance, can force an imperfect nearest option, and do not support participant quotations.
- Brand familiarity, account history, prior subscriptions, and the researcher's own-network recruitment can influence self-reported behavior.
- If the study is unpaid, volunteer and relationship bias may be stronger and must be disclosed in public reporting.
- If no qualified second coder is available, the study will disclose a single-coder limitation and will not report invented reliability statistics.
- One rule-assisted coder completed the scoring and 48-row stratified audit. The audit improves internal consistency but cannot establish inter-rater reliability.

## Evidence limitations

- Official platform announcements are primary evidence for product launches and stated design intent, but not independent evidence of consumer impact.
- Manufacturer specifications are authoritative for stated features and warranty terms but do not establish subjective performance.
- Prices, promotions, stock, eligibility, and rollout status are volatile; every use requires an access date.
- Search snippets are discovery aids only. Claims must link to an opened source or captured interface observation.
- TikTok and YouTube conclusions apply only to the captured search-page boundary. Videos were not watched, so title/caption/metadata evidence cannot establish underlying video depth or accuracy.
- Only six named validation tasks were truth-checked. Broad recommendation accuracy is reported as missing truth scope rather than silently assumed.
- ChatGPT source-button labels were preserved beside claims, but the structured formal record did not retain every destination URL; its source transparency score is conservatively capped.

## Strategic limitations

- Product opportunities are outside-in hypotheses based on public evidence.
- Platform feasibility, economics, model quality, policy constraints, and data readiness cannot be established without internal data.
- No recommendation should be phrased as an internal roadmap mandate.

## Publication limitations

- Public authorization does not include raw logged-in transcripts, screenshots, account identifiers, participant-level survey records, birth fields, or exact response timestamps.
- Final public claims must be rechecked against current product behavior immediately before publication.
- Publication can accurately establish an evidence-backed portfolio study; it cannot establish product-market fit, platform-wide performance, internal feasibility, or consumer population demand.
