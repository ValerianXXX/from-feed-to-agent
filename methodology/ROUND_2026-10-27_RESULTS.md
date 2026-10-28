# Pilot results - October 27, 2026 (America/New_York)

| Surface | Submitted queries | Usable observations | Clear answer | Bounded artifact completed | Saved handoff |
| --- | ---: | ---: | ---: | ---: | ---: |
| ChatGPT | 1 | 0 | Unobserved | Unobserved | Unobserved |
| Google AI Mode | 2 | 2 | 2 | 1 | 0 |
| YouTube search | 2 | 2 | 0 | 0 | 0 |
| TikTok search | 0 | 0 | Unobserved | Unobserved | Unobserved |

This is a descriptive pilot, not an overall accuracy rate or comparison with August. Five queries were actually submitted. The second ChatGPT task and both TikTok tasks were withheld after shared access blockers. Their records do not imply independent query failures.

Google's first answer supplied the requested table, correct values for five predefined facts and working Apple/Sony source links. Extra shopping prices and general warranty wording were not audited; scoped completion is not endorsement of those extras. Its second answer got three required core facts right but added an unsupported IPX0 classification for the case. Completion was conservatively withheld: absence of a stated rating does not establish a specific tested rating. The actual manufacturer manual was opened from the result.

YouTube produced relevant video links in both searches. No video was opened or watched; discovering a possible source is not an authoritative claim check or completed comparison. Some results exposed sponsored or commission labels. The pilot does not score video content.

ChatGPT's visible model selection was Instant, with the underlying model/build undisclosed. An existing authorized account and an unpersonalized temporary chat were used. The first submission returned `cloudflare_challenge`; no model output was available and no retry/bypass was attempted. TikTok's Skip entry led to a birthday form; no personal details were entered. Google and YouTube were visibly signed out. These environment differences prevent platform-wide conclusions.

Observation windows were 15.51/45.14 seconds for Google's two cases, 10.24/10.35 seconds for YouTube and 15.71 seconds to observe ChatGPT's block. These include collection overhead and are not measured inference latency. First-useful latency, actual billing and maintenance cost remain unmeasured. No follow-up repair prompts were used; source inspection happened outside the initial-response timing. One coder performed the fact checks; independent coding review remains open.

## Reproduce and extend

Use the frozen tasks and collector described in [the protocol](ROUND_2026-10-27.md). The runner rejects duplicate attempts, changed task identities, invented elapsed times, synthetic success records and success without evidence. It does not authenticate human coding. Run `pnpm check` for collector regressions plus the original publication checks. All 192 historical observations, 136 historical claim checks and seven download checksums are retained.

Remaining requirements for a full next round: restore permitted platform access; agree on model/account controls; run the entire 24-task lattice and repeated rounds; collect independent coding and actual export/handoff attempts. Do not replace blocked observations with simulated answers.

## Deployment and rollback

Local browser acceptance passed at the normal desktop viewport and a 390-pixel mobile viewport: the new section renders without horizontal overflow, the surface selector distinguishes unobserved access blocks from observed zero outcomes, retained-source links are available, and the frozen-task link opens the correct JSON. TypeScript, production build, all original publication checks and three collector contract tests pass. This verifies the local Web UI, not a published deployment.

No site publication was performed. After review and explicit approval, merge the approved static-publication change and run the existing GitHub Pages workflow. No database migration or external account configuration is required. Roll back by deploying the previous approved commit; preserve the dated new data as a research record rather than rewriting the historical study.
