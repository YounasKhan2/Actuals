# Actuals

Technology research publication for evidence-backed comparisons, reviews, guides, and open-source alternatives.

## Architecture

Actuals separates three concerns:

1. **Research corpus** — sources, evidence, vendor facts, findings, themes and product relationships.
2. **Editorial content** — articles have immutable numbered revisions composed from ordered typed blocks.
3. **Publication state** — an article controls lifecycle and points to the revision that is publicly published.

Rewriting an article therefore does not overwrite its evidence corpus, and different article kinds can compose different block sequences without requiring a bespoke database model.

## Current engineering milestone

`feat/core-content-research-engine` establishes the domain contract that the future Editorial Studio and public renderers will use.

The previous Railway/Render research work is not part of this branch; content comes after the system.
