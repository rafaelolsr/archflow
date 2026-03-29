# Layout Reference

Conceptual layout guide for animated architecture diagrams.
Choose a layout based on the system's shape, then compose the HTML
to match. See `templates/` for working examples — treat them as
inspiration, not rigid skeletons.

---

## Layout A — Horizontal Pipeline

Use when:
  - API services, RAG systems, request/response flows
  - Data has a clear left-to-right path: receive -> process -> return
  - External services feed into one processing layer

Shape:

```
  [Input] ──> [Orchestrator] ──> [Processor] ──> [Output]
                    |                  |
              ┌─────┴──────────────────┴─────┐
              │  DB  ·  VectorDB  ·  Cache   │
              └──────────────────────────────┘
```

Composition principles:
  - Top row: flex container with component cards separated by arrow columns
  - Vertical connectors drop from top-row cards to a shared service strip
  - Storage strip spans the width beneath the connected components
  - Bidirectional arrows (request/response) stack two arrow-wraps
    inside a single arrow-col

Density guidance:
  - 4-7 components fit comfortably in a single horizontal row
  - If the pipeline exceeds 7 nodes, split into two stacked rows
    or switch to a vertical pipeline variant (column layout, centered,
    max-width ~480px — simpler alignment, no flex-mirroring needed)

---

## Layout B — Multi-Agent Hub

Use when:
  - Orchestrator spawns parallel workers or sub-agents
  - ReAct loops, multi-agent systems, fan-out / fan-in patterns
  - Agents share a common service layer (LLM, tools, DB)

Shape:

```
       [User] ──> [Orchestrator]
                   |   |   |
                 [A1] [A2] [A3]
                   |   |   |
              ┌────┴───┴───┴────┐
              │ LLM · VecDB · Tools │
              └─────────────────┘
```

Composition principles:
  - Entry pair (user + orchestrator) sits in its own top row
  - Agent cards form an equal-width flex row (flex:1, shared gap)
  - Vertical connector rows MUST mirror the exact flex structure
    of the row they connect — same gap, same flex:1 children
  - Shared services strip spans the full agent-row width

Density guidance:
  - 2-4 agents: single flex row works well
  - 5-8 agents: use a multi-column grid (2 rows of cards)
  - 8+ agents or complex hierarchies: radial/orbit layout or
    nested groups where each group is its own mini-hub

---

## Layout C — Medallion Pipeline

Use when:
  - ETL / ELT systems, Databricks, Delta Live Tables
  - Staged data transformations (Bronze -> Silver -> Gold)
  - Each stage has its own storage tier

Shape:

```
  [Source] ──> [Bronze] ──> [Silver] ──> [Gold]
                  |             |            |
              [Raw Store]  [Delta Tbl]  [Semantic / BI]
```

Composition principles:
  - Identical structure to Horizontal Pipeline, but each component
    has a dedicated storage node directly beneath it (1:1 mapping)
  - Vertical connectors align per-stage, not to a shared strip
  - Arrow labels describe the data transformation at each hop
    (e.g., "raw events ->", "cleaned ->", "aggregated ->")

Density guidance:
  - 3-5 stages fit one horizontal row
  - 6+ stages or stages with sub-steps: use vertical stacking
    with inline expansion cards for each stage's internals

---

## Vertical Connector Alignment

The single most common visual bug in generated diagrams is
misaligned vertical connectors. One rule prevents it:

**The connector row must replicate the flex structure of the row
it connects to.**

Equal-width rows (e.g., agent cards with flex:1 and gap:12px):
  - Connector row uses the same flex:1 children and gap:12px
  - Each child centers a vert-line element

Mixed-width rows (e.g., component + arrow-col alternating):
  - Connector row replicates each slot's min-width or flex value
  - Arrow-col slots become empty spacers with matching flex/max-width

Vertical (column) layouts are simpler — vert-lines center
automatically via the parent's align-items:center. No mirroring
needed unless the flow branches into a horizontal sub-row.

Never:
  - Use fixed px gaps to align with flex:1 cards
  - Use justify-content:flex-end with padding to eyeball alignment
  - Omit gap from connector rows when the adjacent row has gap

---

## Composition Rules

Vary visual density across the report so no two adjacent sections
feel the same:

  - **Full-width**: hero diagram, key metrics banner
  - **Split-panel**: two-column compare (e.g., before/after, pros/cons)
  - **Grid**: 3-4 concept cards or entity summaries
  - **Single-column**: narrative text, detailed explanations

The architecture diagram is the HERO section. Give it maximum
visual weight — full width, generous padding, animated arrows,
gradient backgrounds. Surrounding sections should be lighter
so the diagram commands attention.

### Diagram density quick-reference

| System shape                        | Recommended layout                        |
|-------------------------------------|-------------------------------------------|
| 4-7 linear layers                   | Horizontal flow-row (compact, one viewport) |
| 8+ layers or nested sub-components  | Vertical stack with inline expansion cards  |
| Hub-spoke with 2-4 agents           | Single agent flex row beneath orchestrator  |
| Hub-spoke with 5+ agents            | Multi-column grid or radial/orbit layout    |
| Staged transforms (ETL/medallion)   | Horizontal pipeline with per-stage storage  |

---

## Templates Reference

The `templates/` directory contains working HTML examples for each
layout. Use them to understand the CSS class vocabulary (component,
arrow-col, arrow-line, shimmer, vert-line, storage-pipeline, etc.)
and the phase-engine ID conventions (litComponent, litArrow,
litStorage target elements by ID regardless of layout direction).

Templates are EXAMPLES of how to implement these concepts — not
rigid structures to copy verbatim. Adapt the shape, density, and
component count to fit the specific system being diagrammed.
