# Study A1 Method Freeze 1.0

**Freeze date:** 2026-08-17
**Version:** `1.0-frozen-2026-08-17`
**Formal target:** 192 observations
**Pilot contribution:** zero

## Frozen design

- Twenty-four exact tasks, balanced across three categories and four journey stages.
- Four surfaces: TikTok Search, YouTube Search, Google AI Mode, and ChatGPT.
- Two independent rounds of 96 observations, with Round 2 starting at least 72 hours after Round 1.
- Deterministic SHA-256 query order per round using seed `from-feed-to-agent-1.0`.
- A four-position Latin rotation keeps the four surfaces for an intent close in time while balancing platform position.
- TikTok and YouTube receive fixed concise search translations and use the first 10 standard-item boundary.
- Google AI Mode and ChatGPT receive the exact full intent and use the complete initial-answer boundary.
- Mandatory full DOM/transcript and SHA-256; screenshot auxiliary.
- Missing, blocked, excluded, and N/A states are never converted to zero.

## Frozen files

The exact SHA-256 values are stored in `METHOD_FREEZE_HASHES.csv`. Any later edit changes the method version and requires a decision-log entry before affected observations can be compared with this frozen sample.

## Formal eligibility

An observation is eligible only if it matches a row in `FORMAL_RUN_ORDER.csv`, uses the exact frozen input, records the actual account and feature state, saves mandatory DOM evidence and its hash, and has no unresolved protocol deviation. Weak or undesirable platform output is never a rerun reason.
