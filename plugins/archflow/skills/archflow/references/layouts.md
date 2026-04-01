# Layout Reference

Conceptual layout guide for animated architecture diagrams.
Choose a layout based on the system's shape, then compose the HTML
to match. See `templates/` for working examples — treat them as
inspiration, not rigid skeletons.

===================================================================
CORE PRINCIPLE — HIERARCHICAL SPATIAL COMPOSITION
===================================================================

Real systems are not flat sequences of boxes. They have grouped
subsystems, nested internals, fan-out/fan-in, and parallel paths.
Diagrams must reflect this structure spatially.

THE ANTI-PATTERN (avoid this):

```
  [A] → [B] → [C] → [D] → [E] → [F] → [G]
```

A flat row of boxes connected by arrows. This layout:
  - Shows sequence but hides structure
  - Makes every component look equally important
  - Cannot represent parallel paths or grouping
  - Becomes unreadable past 5-6 nodes

THE GOAL:

```
  ┌─────────────┐     ┌──── GROUP B ─────────┐     ┌── GROUP C ──┐
  │ [Source]     │     │  [Parser 1]          │     │  [Bronze]   │
  │   detail     │ ──> │  [Parser 2]   ──>    │ ──> │    ↓        │
  │   sub-info   │     │  [Parser 3]          │     │  [Silver]   │
  └─────────────┘     │  [+ N more types]    │     │    ↓        │
                       └──────────────────────┘     │  [Gold]     │
                                                     └─────────────┘
```

Grouped containers that:
  - Wrap related components into labeled regions
  - Show horizontal flow BETWEEN groups (left → right)
  - Show internal structure WITHIN groups (vertical stacks, grids)
  - Use depth tiers to signal hierarchy level

===================================================================
GROUP CONTAINERS
===================================================================

A group container is a bordered/backgrounded region that wraps
related components. It replaces the flat "row of boxes" pattern.

CSS pattern:

  .group {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    position: relative;
  }
  .group-label {
    position: absolute; top: -10px; left: 16px;
    background: var(--bg); padding: 0 8px;
    font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 2px;
    text-transform: uppercase;
  }

When to create a group:
  → 2+ components share a runtime boundary (same process, service)
  → Components form a subsystem with a name (e.g., "ReAct Loop",
    "Lambda Parsers", "Lakeflow DLT", "Tool Ecosystem")
  → A component has internal sub-steps worth showing

Depth tiers for groups:
  → HERO:     accent-tinted border + subtle glow. Use for the
              primary subsystem (orchestrator, core loop)
  → ELEVATED: slightly lighter surface, subtle box-shadow
  → DEFAULT:  standard surface + border
  → RECESSED: darker surface, inset shadow. Use for storage,
              external services, secondary concerns

===================================================================
NESTING — COMPONENTS INSIDE GROUPS
===================================================================

Components inside a group use internal layout:

  VERTICAL STACK — for sequential internal steps
    flex-direction: column; gap: 6px;
    Use when: steps happen in order (Bronze → Silver → Gold)

  HORIZONTAL WRAP — for parallel/peer items
    display: flex; flex-wrap: wrap; gap: 6px;
    Use when: items are peers (11 tools, 4 parsers, 6 contracts)

  GRID — for categorized items
    display: grid; grid-template-columns: repeat(auto-fill, minmax(140px,1fr));
    Use when: items have categories (tools by type, entities by layer)

Components inside groups are SMALLER than top-level components:
  → Reduced padding (8-10px vs 14px)
  → Smaller font (8-9px vs 10px for labels)
  → Dashed borders for optional/conditional items

===================================================================
HORIZONTAL FLOW BETWEEN GROUPS
===================================================================

The PRIMARY flow direction is LEFT → RIGHT between groups.
Arrow connectors sit between groups, not between individual
components inside groups.

```
  [Group A] ──arrow──> [Group B] ──arrow──> [Group C]
```

Each group handles its own internal layout. The top-level layout
only cares about arranging groups horizontally with arrows between.

For systems that don't fit in one horizontal row:

  TWO-ROW FLOW:
  ```
    [Group A] ──> [Group B] ──> [Group C]
                                    |
    [Group F] <── [Group E] <── [Group D]
  ```

  TREE / FAN-OUT:
  ```
                  ┌──> [Group B]
    [Group A] ──>├──> [Group C]  ──> [Group E]
                  └──> [Group D]
  ```

===================================================================
LAYOUT A — HORIZONTAL PIPELINE (with groups)
===================================================================

Use when:
  - API services, RAG systems, request/response flows
  - Data has a clear left-to-right path
  - External services feed into one processing layer

Shape (grouped):

```
  ┌── INPUT ──┐     ┌── ORCHESTRATION ────────┐     ┌── OUTPUT ──┐
  │ [User]    │     │ [Router]               │     │ [Response] │
  │  query     │ ──> │ [Processor]            │ ──> │  formatted │
  │  context   │     │ [Validator]            │     └────────────┘
  └────────────┘     │   ↓ calls              │
                      │ ┌─ SERVICES ─────────┐│
                      │ │ DB · API · Cache   ││
                      │ └────────────────────┘│
                      └────────────────────────┘
```

Key difference from flat pipeline: the orchestration group
CONTAINS its service dependencies as a nested sub-group,
rather than having services float below as a separate row.

---

## Layout B — Multi-Agent Hub (with groups)

Use when:
  - Orchestrator spawns parallel workers or sub-agents
  - ReAct loops, multi-agent systems, fan-out / fan-in patterns

Shape (grouped):

```
  ┌── ENTRY ──┐     ┌═══ REACT LOOP (hero border) ═══════════════┐
  │ [User]    │     │                                              │
  │  NL query │ ──> │ [Prompt Assembly]                           │
  └───────────┘     │   assemble_prompt()                          │
                     │   ┌─ PROMPT SECTIONS ─────────────────┐     │
                     │   │ BASE · FORMAT · PATTERNS · EXAMPLES│     │
                     │   └───────────────────────────────────┘     │
                     │                                              │
                     │ [ReAct Engine] ←──────────────────────┐     │
                     │   _run_loop()  HARD_MAX=20            │     │
                     │   ┌─ ITERATION ──────────────────┐    │     │
                     │   │ LLM Call · Parse · Execute    │    │     │
                     │   │ Track Grounding · Validate    │    │     │
                     │   └──────────────────────────────┘    │     │
                     │                                 loop──┘     │
                     │ ┌─ TOOL ECOSYSTEM (11 tools) ──────────┐   │
                     │ │ Search · Explore · Schema · DAX · Q  │   │
                     │ └──────────────────────────────────────┘   │
                     └═════════════════════════════════════════════┘
                                        |
                     ┌── GROUNDING ─────────────────────┐
                     │ [Ledger]    grounded_tables: set  │
                     │  anti-hallucination    columns    │
                     │  entity verification   measures   │
                     └──────────────────────────────────┘
                                        |
                     ┌── QUALITY GATE ──────────────────┐
                     │ [Evaluator] 8 criteria           │
                     │  6 HARD · 2 SOFT                 │
                     │  _force_final_answer() on fail   │
                     └──────────────────────────────────┘
```

The ReAct loop is the HERO group (accent border, glow).
Tools, prompt sections, and iteration steps are nested groups
inside it. The grounding ledger and evaluator are separate
groups below, connected by vertical arrows.

---

## Layout C — Medallion Pipeline (with groups)

Use when:
  - ETL / ELT systems, Databricks, Delta Live Tables
  - Staged data transformations with distinct processors per stage

Shape (grouped):

```
  ┌── SOURCE ────┐     ┌── PARSERS ──────────┐     ┌── LAKEFLOW DLT ──┐
  │ [TSYS Files] │     │ [ADF]  5-level      │     │ [Bronze]          │
  │  Fixed-Width │     │ [MDI]  PII masking   │     │  39 streaming     │
  │  COBOL       │ ──> │ [TDDF] dual-sign    │ ──> │     ↓             │
  │              │     │ [D256] overpunch     │     │ [Silver]          │
  │  SFTP Daily  │     │                      │     │  7 quality tables │
  └──────────────┘     │ + 32 new file types  │     │     ↓             │
                        └──────────────────────┘     │ [Gold]           │
                                                      │  4 materialized  │
                                                      └──────────────────┘
```

Each stage is a GROUP containing its internal components stacked
vertically. The arrow flow is between groups, not between
individual components. Internal components show detail (counts,
types, descriptions) that a flat node could not fit.

---

## Component Detail Cards

Inside a group, each component can show structured detail:

```
  ┌─────────────────────────────────────────────────────┐
  │ 🔄  ReAct Loop Engine   [_run_loop()]  [MAX=20]    │
  │                                                      │
  │  Each iteration: LLM Call → Parse JSON → Execute     │
  │  Tools → Track Grounding → Validate Contracts        │
  │                                                      │
  │  ┌──────────┐ ┌──────────┐ ┌───────────┐           │
  │  │ LLM Call │ │ Parse    │ │ Execute   │  ...       │
  │  │ GPT-5.2  │ │ Response │ │ Tools     │           │
  │  └──────────┘ └──────────┘ └───────────┘           │
  └─────────────────────────────────────────────────────┘
```

Structure:
  → Icon + Name + Tag badges (inline, top row)
  → Description paragraph (1-2 lines)
  → Internal sub-items as small wrapped cards (optional)

This is how the visual-explainer achieves information density:
each component card is a mini-layout with icon, title, tags,
description, AND nested sub-items — not just a label in a box.

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

| System shape                        | Recommended layout                          |
|-------------------------------------|---------------------------------------------|
| 4-7 linear layers                   | 3-4 groups flowing horizontally             |
| 8+ layers or nested sub-components  | Groups with internal vertical stacks        |
| Hub-spoke with 2-4 agents           | Hub group + agent cards inside              |
| Hub-spoke with 5+ agents            | Hub group + agent grid inside               |
| Staged transforms (ETL/medallion)   | Stage groups flowing left → right           |
| Complex system (loops, eval gates)  | Hero group (core loop) + satellite groups   |

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

**Important**: Templates show flat layouts for simplicity. In
practice, ALWAYS apply the hierarchical grouping principles above.
Group related components into containers. Nest sub-items inside
component cards. Use depth tiers to signal hierarchy. The flat
template patterns are building blocks — the grouped composition
is the goal.
