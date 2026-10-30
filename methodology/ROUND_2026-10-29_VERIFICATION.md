# Outcome-ledger verification, October 29, 2026

This record validates the collector and local publication. It does not establish consumer-platform reliability, customer adoption or independent human acceptance.

## Before and after

The previous branch at `cdf5dbc26809420242362d7e86e9a48d546749af` passed its existing checks and three collector tests. Additional probes found that its V1 format could accept a truthy export marker without a file, an evidence count exceeding retained links, and duplicated source links. Those are integrity gaps; they are not fabricated research observations or evidence that earlier findings were wrong.

The V2 modules separate validation/derived metrics, filesystem persistence and the command-line collector. They require file bytes and hashes, full frozen fact vectors and source origins; reject duplicate attempts; preserve independent coding disagreements; and detect edited chains, changed catalogs, concurrent writes and partial tails. The original V1 reader, tests and dated records remain intact. No new runtime dependencies were added.

## Milestone checks

- `pnpm check`: PASS. TypeScript, Vite production build, 28 tests (25 V2 and three preserved V1), seven historical release artifacts and 3,640 public data rows validated; no skips or failures.
- `check-round-ledger.mjs`: PASS. Recomputed metrics match the published summary; 24 recorded slots and all three platform-export receipts validate.
- Catalog SHA-256: `5a5c603fcd5131e901964ccb82bff68a4180032aee92030bc8a559303c035841`.
- Ledger head: `0e4732d50cb3972c331d07d0f9110acd14aebb012d76a557f726e8c5d90c6f10`.
- No changes to August data, historical downloads, their SHA256SUMS, or October 27 observations/tasks.

## Actual browser checks

The built site was served on loopback and inspected in the Codex in-app browser at the desktop default viewport (1,265 px screenshot width) and a 390 × 844 CSS-pixel override (375 px content width after the scrollbar). This is browser-based user simulation, not a physical-phone or independent-person test.

Surface and task filters changed the detail list while preserving the explicitly labeled six-task aggregate. TikTok showed six blocked slots and no assessed answer denominator. YouTube retained discovery and four unscored facts for the selected task. ChatGPT's late capture was visibly flagged. Source details and the 24-entry catalog opened with Enter. The narrow layout had equal client and scroll widths, with readable wrapping and no horizontal overflow. No browser console errors were observed.

Two visible download links were activated. The Google RV-I-01 download had 2,166 bytes and SHA-256 `e59051ef57a892d3216c3aa61b64783f523079daece663ac5e7d043d6c5da447`; ChatGPT SW-I-01 had 2,351 bytes and SHA-256 `f564dff70519214f7b999a12966dba868f9127aefb28d9e41424c20fca99bdc0`, both matching the retained receipts. The warning about unedited research artifacts remained beside each download.

Two automation locators needed correction: native accessibility exposed a details summary as a button while the DOM interface exposed it as generic; the desktop navigation link is intentionally absent on the narrow layout. Keyboard activation by visible summary text and direct filter use succeeded. A batched anchor click did not move the captured viewport immediately; an actual scroll established the inspected view. These observations are not hidden test passes or claims of native-device coverage.

## Remaining limits and rollback

No independent second coder, physical-device acceptance or precise inference latency/cost receipt is available. Research-method limitations and two late captures are in the [results](ROUND_2026-10-29_RESULTS.md). Source-equivalence review belongs to a separately frozen follow-up, not a post-hoc score increase.

This change is a static publication and local collector: no server schema migration, production connection or release occurred. Review the stacked draft PR after its base. If publication is later approved and must be rolled back, restore the previous reviewed static commit; retain the dated ledger and artifacts in Git. Never repair a damaged ledger by dropping failed rows or truncating its tail.
