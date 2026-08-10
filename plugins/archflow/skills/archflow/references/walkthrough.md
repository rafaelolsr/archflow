# Walkthrough Mode

The granular, rule-by-rule data-flow explainer. Where diagram mode
summarizes a system at the group level ("Silver layer is active"),
walkthrough mode narrates ONE flow at the step level: how data is
ingested, and how a concrete record CHANGES as each transformation
rule fires on its way to the end base.

This doc defines the one new primitive walkthrough mode adds — the
RULE-ANNOTATED TRANSITION — and how to compose it. Everything else
(SVG groups, phase engine, design system, print/dark-fidelity) is
inherited unchanged from the other modes.

This is a BUILDING-BLOCK guide, not a template to copy verbatim.
Compose fresh CSS per project.

===================================================================
WHEN TO USE
===================================================================

Use walkthrough mode when the ask is "explain every step" / "show
how data moves and transforms," especially for:

  → ETL / ELT / medallion (Bronze → Silver → Gold) pipelines
  → Ingestion + staged transformation systems
  → Any flow where the RULES that change data matter as much as the
    boxes the data passes through

If the ask is "give me an overview diagram," use diagram mode instead.
Walkthrough mode is deliberately heavier: it trades breadth for depth
on a single spine.

===================================================================
DESIGN PRINCIPLES (research-grounded)
===================================================================

These are drawn from data-lineage and data-viz UX research. They are
ADDITIVE to archflow's existing design system — they do not replace
the tight palette or typography rules.

  1. STOPLIGHT STATUS IS INTUITIVE ACROSS ALL VIEWERS.
     Every rule chip carries a status color, layered ON TOP of the
     project palette (not replacing accents):
       green   → clean pass / value transformed successfully
       yellow  → coerced / masked / defaulted (data changed to conform)
       red     → rejected / quarantined / failed expectation
     Use full-strength status only on the chip's dot + left border.
     Keep chip backgrounds at 8-12% tint, like all archflow accents.

  2. PROGRESSIVE DISCLOSURE BY PERSONA.
     Two layers, always both present:
       ANALYST layer  → the record morph. Glanceable. Always visible.
       ENGINEER layer → per-rule detail cards (code ref, expression,
                        expectation). COLLAPSED by default; expand on
                        click. Never force engineer detail on a reader
                        who only wants the shape of the flow.

  3. ONE TRANSITION IN FOCUS AT A TIME.
     Don't render all stage-to-stage transitions expanded at once
     (overcrowding). The pinned hero shows the full pipeline; the
     ACTIVE transition (the gap currently being explained) is the
     only one with its rule chips and morph expanded. Advancing —
     by scroll or autoplay — moves focus to the next transition.

  4. FIELD-LEVEL DIFF: SHOW WHAT CHANGED AND WHY.
     In the record morph, highlight ONLY the fields the active
     transition changes (before → after). Dim unchanged fields.
     Each changed field links to the rule that changed it (shared
     accent/number, or a connector line).

  5. NAME THE INGESTION MECHANISM EXPLICITLY.
     The head of the pipeline is not just "Source." State HOW data
     lands: SFTP batch drop, CDC stream, Kafka/Event Hub, API poll,
     file watch. This is the single most common omission in overview
     diagrams and the request calls it out directly.

===================================================================
THE PRIMITIVE — RULE-ANNOTATED TRANSITION
===================================================================

A transition is the gap between two consecutive stage groups (e.g.
Bronze → Silver). In walkthrough mode this gap is an ACTIVE SURFACE,
not just an arrow. It carries three stacked layers:

  ┌─ TRANSITION: Bronze → Silver ────────────────────────────────┐
  │                                                              │
  │  RECORD MORPH  (analyst layer, always visible)               │
  │    before: { acct:"0000123456", ssn:"123-45-6789", ... }     │
  │              ↓  (changed fields highlighted, others dimmed)   │
  │    after:  { acct_id:123456, ssn_masked:"***-**-6789", ... } │
  │                                                              │
  │  RULE CHIPS  (stoplight status, one per rule that fires)      │
  │    ● cast_fixed_width   green    ● mask_pii   yellow          │
  │    ● scd2_merge         green    ● reject_null_ts   red       │
  │                                                              │
  │  ENGINEER CARDS  (collapsed; expand a chip to reveal)         │
  │    ┌ mask_pii ──────────────────────────────────────┐        │
  │    │ ssn "123-45-6789" → "***-**-6789"               │        │
  │    │ rule: keep last4, mask rest                     │        │
  │    │ code: dlt/silver.sql:mask_ssn()                 │        │
  │    └─────────────────────────────────────────────────┘        │
  └──────────────────────────────────────────────────────────────┘

STRUCTURE (adapt; don't copy verbatim):

  The pipeline hero is an inline SVG (as in every mode): stage groups
  as <rect class="group-box">, arrows between them. The transition
  overlay is an HTML layer positioned over the active arrow gap — OR,
  for simpler builds, a full-width HTML block BELOW the pinned SVG
  that swaps content as focus advances. Prefer the below-the-SVG block
  when SVG-overlay positioning would be fragile.

  Record morph:
    - Two record renderings (before / after) as mono key:value lists.
    - Changed keys get a status-tinted background + the rule's number
      badge. Unchanged keys get opacity ~0.4.
    - Animate the diff: on transition activation, cross-fade before→
      after, or slide the changed values in. Respect reduced-motion.

  Rule chips:
    - One chip per rule the transition applies. Dot + left border in
      the stoplight status color. Label = the actual rule/function
      name from code (mask_ssn, cast_amount, dedup_on_acct).
    - Chips are the click targets that expand engineer cards.

  Engineer cards (collapsed by default):
    - before→after for the specific field(s) the rule touches
    - the rule expression in plain language
    - code reference (file:symbol) — REQUIRED, resolved from analysis
    - for red/reject rules: what happens to the row (quarantine table,
      dropped, dead-letter)

===================================================================
THE SPINE IS THE TRANSFORMATION
===================================================================

In diagram mode the spine is the subsystems. In walkthrough mode the
spine is the RECORD'S JOURNEY. Phases map to transitions, not groups:

  Phase 0  INGEST     — how the record lands (mechanism named)
  Phase 1  → Bronze   — raw landing; metadata columns added
  Phase 2  → Silver   — the rule-heavy transition (mask/cast/dedup/
                        SCD2/expectations). Usually the HERO transition.
  Phase 3  → Gold     — aggregation / conforming to the end base
  Phase N  OUTPUT     — the record as it lands in the consumption model

The Silver transition is almost always the hero — it carries the most
rules and is the one the request explicitly wants shown in full. Give
it the most chips and the richest engineer cards. Do not collapse
Silver into "cleansing happens here."

===================================================================
DRIVER — AUTOPLAY + SCROLL (both)
===================================================================

Walkthrough mode advances focus through transitions two ways, sharing
ONE state (the active transition index). Reuse the existing phase
engine; add scroll as a second input to the same setActive(i).

  AUTOPLAY (inherited): the phase engine ticks through transitions on
  a timer, as in diagram mode. Pause on hover / on user scroll.

  SCROLL (new): pin the pipeline hero (position: sticky) while a
  column of transition "steps" scrolls past. Each step is an
  IntersectionObserver sentinel; when it enters the viewport center,
  call setActive(itsIndex). This is the scrollytelling "pinned graphic
  + scroll-driven state" pattern.

    - Use IntersectionObserver (rootMargin to trigger at center), not
      scroll math. One observer, one sentinel per transition.
    - Scrolling and autoplay write the same active index — never two
      sources of truth. User scroll cancels autoplay (set a flag).
    - prefers-reduced-motion: disable autoplay AND the morph animation;
      scroll still advances (instant state swaps, no interpolation).
    - Keyboard: ↑/↓ or ←/→ step active index for accessibility.

  If sticky-pin is not viable for a given layout, fall back to
  autoplay-only with clickable transition tabs. Autoplay is the
  floor; scroll-pin is the enhancement.

===================================================================
COMPLETENESS — THE CARDINAL RULE (hard constraint)
===================================================================

Walkthrough mode's whole purpose is to omit nothing. Before building:

  1. Every pipeline STAGE present as a group (no stage skipped).
  2. Every TRANSITION between stages present and reachable on the
     spine (ingest → bronze → silver → gold → output).
  3. Every extracted RULE rendered as a chip with a status and a
     resolved code reference. If analysis found 9 silver rules, show
     9 chips — do not summarize to "cleansing."
  4. The ingestion MECHANISM named at the head.
  5. No silent truncation. If you cap chips for space, say so visibly
     ("+3 more rules") and keep them reachable — never drop silently.

If a rule was requested but could not be derived from code, it must
appear as a GAP (see analysis.md STEP 3c), not vanish.

===================================================================
PRINT / PDF
===================================================================

Inherit references/print.md. Walkthrough-specific freeze behavior:

  - The beforeprint composite must expand ALL transitions (every
    rule chip visible, every engineer card open) and set the record
    morph to its FINAL (output) state — the reader of a PDF cannot
    scroll or click, so nothing may stay collapsed.
  - Un-pin the sticky hero for print (position: static) so it does
    not overlap following content.
  - Same strategy choice as other modes: light-on-paper default;
    dark-fidelity (print.md §4b) for screen-consumed PDFs, with a
    *.dark-print.html variant for headless rendering.

===================================================================
DO-NOTS
===================================================================

  → Do NOT alter or replace diagram/architecture mode. Walkthrough is
    additive.
  → Do NOT summarize the silver layer. Its rules are the point.
  → Do NOT invent transformation rules. Only render rules derived
    from code or confirmed by the user (analysis.md STEP 3c). Unknown
    rules are GAPS, shown as such.
  → Do NOT let status color become the primary accent — it layers on
    top of the project palette, it does not replace it.
  → Do NOT render every transition expanded at once — one in focus.
