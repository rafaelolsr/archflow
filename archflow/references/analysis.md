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

Organize findings into this structure before writing any HTML:

  LAYERS
  -------------------------------------------------------------------
    Input layer      → users, API clients, triggers, events, cron
    Orchestration    → routers, orchestrators, agents, managers
    Processing       → pipelines, chains, transformers, workers
    Storage/External → DBs, vector stores, APIs, LLMs, queues, caches
    Output           → responses, files, events, side effects

  FLOWS (4-8 phases for the animation)
  -------------------------------------------------------------------
    → What triggers the system? (the first phase)
    → What are the key steps of a typical request or job?
    → What data moves between which components at each step?
    → What external service is touched at each step?
    → What does the system return? (the last phase)

  PHASE LABELS
  -------------------------------------------------------------------
  Write plain-language labels referencing actual code concepts:

    Good: "orchestrator.py dispatches ReActLoop.run() to sub-agents..."
    Good: "VectorSearch returns top-3 chunks for context injection..."
    Bad:  "Processing step 2..."
    Bad:  "Component A calls Component B..."

===================================================================
STEP 4 — DECIDE THE LAYOUT
===================================================================

See references/layouts.md for the full decision guide and HTML skeletons.

Quick decision:
  → Clear left-to-right request/response  → HORIZONTAL PIPELINE
  → Orchestrator spawning parallel agents → MULTI-AGENT HUB
  → ETL / medallion / staged transforms   → MEDALLION PIPELINE
