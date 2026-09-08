# /archflow-walkthrough

Analyze the current codebase and generate a step-by-step, rule-by-rule
data-flow walkthrough as a self-contained HTML page.

Walkthrough mode narrates ONE flow end to end: it shows how data is
ingested, then walks each pipeline stage block-by-block, animating a
concrete sample record as it changes — and annotating the exact
transformation rules that cause each change. Silver-layer rules are
shown explicitly (mask, cast, dedup, SCD2 merge, quarantine-on-fail),
not summarized.

Distinct from the other modes:
  - /archflow-diagram  → summary diagram (groups light up)
  - /archflow-slides   → presentation deck
  - /archflow-walkthrough → granular transformation trace (this)

Layered detail (progressive disclosure):
  - Analyst view  → a sample record morphs stage-by-stage (glanceable)
  - Engineer view → each rule expands to a card with its code reference

Autoplay AND scroll both drive the animation. The pipeline hero pins
while the record advances through each transition on scroll.

Output: ./architecture-walkthrough.html

Uses the archflow skill with the walkthrough workflow
(references/walkthrough.md).
