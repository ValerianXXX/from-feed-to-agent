# From Feed to Agent

[![Quality](https://github.com/ValerianXXX/from-feed-to-agent/actions/workflows/quality.yml/badge.svg)](https://github.com/ValerianXXX/from-feed-to-agent/actions/workflows/quality.yml)
[![Deploy GitHub Pages](https://github.com/ValerianXXX/from-feed-to-agent/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/ValerianXXX/from-feed-to-agent/actions/workflows/deploy-pages.yml)

**Independent product-strategy research on how people move from discovery feeds and reviews into AI-assisted decisions.**

Explore the interactive publication: **[valerianxxx.github.io/from-feed-to-agent](https://valerianxxx.github.io/from-feed-to-agent/)**

## Research in one view

The study compares four consumer-research surfaces across the same frozen task lattice. The central product opportunity is not another destination; it is an evidence handoff that carries intent, source origin, uncertainty, and proof between tools.

| Evidence layer | Scope |
|---|---:|
| Formal observations | 192 |
| Research surfaces | 4 |
| Collection rounds | 2 |
| Survey submissions preserved | 149 |
| Primary / expanded survey layers | 73 / 122 |
| Metric-state records | 3,264 |
| Named validation checks | 136 |
| Stratified coding-audit rows | 48 |

## What the evidence supports

- TikTok functioned as an origin-rich inspiration surface inside the captured search-page boundary.
- YouTube provided routes to deeper reviews, while the study did not watch or score video content.
- Google AI Mode offered source-linked synthesis but exposed generation-state reliability as a product concern.
- ChatGPT consistently produced structured initial answers in the captured account, browser, and time window.
- Survey preferences favored visible control over automatic cross-product handoff in both eligibility layers.

These are descriptive, task-scoped findings. They are not population estimates, causal claims, universal platform rankings, or evidence of product-market fit.

## Repository map

```text
data/                 Privacy-safe row-level and aggregate evidence
methodology/          Protocol, frozen method, limitations, and accessible appendix
public/downloads/     Report, workbook, appendix, social deck, and public-data bundle
src/                  Interactive publication source
.github/workflows/    Reproducible quality and GitHub Pages deployment
```

## Run locally

Requirements: Node.js 22+ and pnpm 11.19+.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Run the same checks used in continuous integration:

```bash
pnpm check
```

The check performs TypeScript validation, a production build, publication-trace scanning, download inventory checks, and row-count verification for the four principal public datasets.

## Public artifacts

- [Research report — PDF](https://valerianxxx.github.io/from-feed-to-agent/downloads/from_feed_to_agent_final_report_20260820.pdf)
- [Research report — editable PPTX](https://valerianxxx.github.io/from-feed-to-agent/downloads/from_feed_to_agent_final_report_20260820.pptx)
- [Method appendix — PDF](https://valerianxxx.github.io/from-feed-to-agent/downloads/from_feed_to_agent_method_appendix_20260820.pdf)
- [Auditable analysis workbook](https://valerianxxx.github.io/from-feed-to-agent/downloads/from_feed_to_agent_final_analysis_20260820.xlsx)
- [Editable social carousel](https://valerianxxx.github.io/from-feed-to-agent/downloads/from_feed_to_agent_linkedin_carousel_20260820.pptx)
- [Share-ready social carousel — PDF](https://valerianxxx.github.io/from-feed-to-agent/downloads/from_feed_to_agent_linkedin_carousel_20260820.pdf)
- [Privacy-safe public data bundle](https://valerianxxx.github.io/from-feed-to-agent/downloads/from_feed_to_agent_public_data_20260820.zip)

Verify any downloaded artifact against [`SHA256SUMS.txt`](SHA256SUMS.txt).

## Privacy and evidence boundary

The repository excludes participant-level survey responses, birth fields, exact response timestamps, account identifiers, raw logged-in browser captures, local file paths, and exact private-session prompts. Public rows are derived research outputs with explicit missing-state handling.

See [LIMITATIONS.md](methodology/LIMITATIONS.md), [RESEARCH_CHARTER.md](methodology/RESEARCH_CHARTER.md), and the [data dictionary](data/DATA_DICTIONARY.csv) before reusing or interpreting the results.

## NeedRadar method relationship

This research contributes origin-preserving evidence, claim-to-proof, verification-state, and consent patterns to the [NeedRadar evidence-to-execution ecosystem](https://github.com/ValerianXXX/needradar/blob/main/docs/ECOSYSTEM.md).

The relationship is method-level and metadata-only. NeedRadar must treat this publication as one research artifact rather than converting study rows or respondents into independent demand observations. See [`needradar-project.json`](needradar-project.json).

## Citation

Use the repository's [`CITATION.cff`](CITATION.cff) metadata or cite:

> Xu, S. (2026). *From Feed to Agent: The Evidence Handoff*. Independent product-strategy research. https://github.com/ValerianXXX/from-feed-to-agent

## Rights and contributions

Copyright © 2026 Sihan Xu. All rights reserved. Research corrections and reproducibility improvements are welcome through GitHub issues or pull requests; see [CONTRIBUTING.md](CONTRIBUTING.md).
