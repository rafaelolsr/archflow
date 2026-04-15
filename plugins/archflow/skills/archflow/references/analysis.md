# Codebase Analysis Guide

How to read a codebase and extract the architecture model
needed to generate an accurate diagram.

===================================================================
STEP 1 — MAP THE STRUCTURE
===================================================================

Run these first to get an overview without reading every file:

  bash: find . -type f \
        | grep -v node_modules | grep -v .git \
        | grep -v __pycache__ | grep -v .venv \
        | grep -v .pytest_cache | grep -v dist \
        | head -80

  bash: ls -la

Identify:
  → Entry points      main.py, index.ts, app.py, server.js, handler.py
  → Config files      *.yaml, *.toml, *.env.example, pyproject.toml
  → Key directories   agents/, pipelines/, models/, api/, services/,
                      orchestrators/, workers/, transforms/
  → Skip              tests/, __tests__/, *.test.*, *.spec.*

===================================================================
STEP 2 — READ KEY FILES
===================================================================

Read in this order — stop when you have enough to model the system:

  Priority 1 → Entry point(s)
  Priority 2 → Orchestration files (orchestrator, pipeline, router,
               agent, manager, coordinator, workflow)
  Priority 3 → Config/schema files that reveal system shape
  Priority 4 → Follow imports from Priority 1-2 as needed

Do NOT read every file. 5-10 files is usually enough.

For each file extract:
  → What does this component do?
  → What does it call / depend on?
  → What external services does it touch?
  → What data does it pass downstream?

===================================================================
STEP 3 — BUILD THE ARCHITECTURE MODEL
===================================================================

Organize findings into GROUPS, not flat layers. Real systems have
subsystems that contain related components — identify those groups.

  GROUPS (the spatial building blocks of the diagram)
  -------------------------------------------------------------------
  Identify 3-6 groups by asking: "which components share a runtime
  boundary, a subsystem name, or a logical concern?"

  Examples of groups:
    → "ReAct Loop Engine" containing: LLM call, parse, execute,
       track grounding, validate contracts
    → "Tool Ecosystem" containing: 11 tools in 5 categories
    → "Lambda Parsers" containing: ADF, MDI, TDDF, D256
    → "Grounding Ledger" containing: grounded sets, validation
    → "Evaluator Gate" containing: 8 criteria, retry logic

  For each group identify:
    → Group name and what boundary it represents
    → Internal components (what lives inside the group)
    → Internal layout: are items sequential (vertical stack),
       parallel (horizontal wrap), or categorized (grid)?
    → Which groups does it connect to? (the arrows between groups)

  HIERARCHY — assign each group a depth tier:
    → HERO: the core subsystem (1 per diagram, accent border + glow)
    → ELEVATED: important subsystems connected to the hero
    → DEFAULT: standard subsystems
    → RECESSED: storage, external services, secondary concerns

  COMPONENT DETAIL — for each component inside a group:
    → Name + actual function/class name (tag badge)
    → 1-line description of what it does
    → Sub-items if it has internal parts worth showing
    → Quantitative facts: counts, limits, timeouts

  FLOWS (4-8 phases for the animation)
  -------------------------------------------------------------------
    → What triggers the system? (the first phase)
    → What are the key steps of a typical request or job?
    → Which GROUP is active at each phase? (not individual components)
    → What data moves between groups at each step?
    → Include branching: loops, retries, conditional paths
    → What does the system return? (the last phase)

  FLOW SPINE — trace before listing phases:
    → Identify the primary data path from entry to exit. This is the
      "spine" — the single storyline a viewer follows to understand
      the system. Number groups in spine order; this becomes the
      phase sequence.
    → Verify reachability: every group must be reachable from entry
      by following arrows. If a group is disconnected, it's either
      missing an arrow or doesn't belong in the diagram.
    → Name entry and exit explicitly: these anchor the spine and
      become phase 0 (entry/trigger) and the final phase (output).
    → Map branches to parent spine groups: non-spine groups (storage,
      services, tools) connect to a specific spine group — this
      determines their phase timing. A branch phase appears right
      after its parent spine group, not appended at the end.

  PHASE LABELS
  -------------------------------------------------------------------
  Write plain-language labels referencing actual code concepts:

    Good: "orchestrator.py dispatches ReActLoop.run() to sub-agents..."
    Good: "VectorSearch returns top-3 chunks for context injection..."
    Bad:  "Processing step 2..."
    Bad:  "Component A calls Component B..."

===================================================================
STEP 3b — VERIFY COMPLETENESS (before generating any output)
===================================================================

Create an internal inventory of every architectural concern found:

  → Every distinct subsystem or component
  → Every data flow path (including branches and error paths)
  → Every external service integration
  → Every design decision or pattern worth calling out
  → State management concerns (what persists, what doesn't)
  → Safety/validation mechanisms (contracts, eval gates, etc.)

Map each item to an output section. If any item has no home,
create a section for it. Do not drop architectural concerns
because they don't fit a predefined template.

This step prevents the most common failure mode: producing a
polished output that covers only 60% of the architecture.

===================================================================
STEP 4 — DECIDE THE LAYOUT
===================================================================

See references/layouts.md for the full decision guide and HTML skeletons.

Quick decision:
  → Clear left-to-right request/response  → HORIZONTAL PIPELINE
  → Orchestrator spawning parallel agents → MULTI-AGENT HUB
  → ETL / medallion / staged transforms   → MEDALLION PIPELINE

Once you choose a layout shape, implement it as inline SVG.
Group containers become <rect class="group-box"> elements. Inter-group
flow becomes <path class="arrow-path"> elements with arrowhead markers.
See svg-exemplar.md for the structural pattern and sizing conventions.
