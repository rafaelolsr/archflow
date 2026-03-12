# Layout Reference

Three layout recipes. Pick one based on the system shape,
then use the HTML skeleton as your starting point.

===================================================================
LAYOUT A — HORIZONTAL PIPELINE
===================================================================

Use when:
  → API services, RAG systems, request/response flows
  → Data has a clear left-to-right path: receive → process → return
  → External services feed into one processing layer

Visual shape:

  [Input] → arrows → [Orchestrator] → arrows → [Processor] → arrows → [Output]
                             ↕ vertical connectors
                     [Storage Row: DB | VectorDB | LLM | Cache]

HTML skeleton:

  <!-- MAIN ROW -->
  <div style="display:flex;align-items:center;width:100%;max-width:1000px;">
    <div class="component" id="c-input">...</div>
    <div class="arrow-col">
      <div class="arrow-wrap">
        <div class="arrow-line" id="arr-1"><div class="shimmer"></div></div>
        <div class="arrow-lbl">tokens →</div>
      </div>
      <div class="arrow-wrap">
        <div class="arrow-lbl above">← response</div>
        <div class="arrow-line" id="arr-1b"></div>
      </div>
    </div>
    <div class="component" id="c-orch">...</div>
    <div class="arrow-col">...</div>
    <div class="component" id="c-proc">...</div>
    <div class="arrow-col">...</div>
    <div class="component" id="c-output">...</div>
  </div>

  <!-- VERTICAL CONNECTORS -->
  <div style="display:flex;width:100%;max-width:1000px;margin-top:0;">
    <div style="min-width:[match input card width];"></div>
    <div style="flex:1;"></div>
    <div style="display:flex;flex-direction:column;align-items:center;min-width:[match orch card width];">
      <div class="vert-line" id="vl-orch" style="height:24px;"></div>
    </div>
    <div style="flex:1;"></div>
    <div style="display:flex;flex-direction:column;align-items:center;min-width:[match proc card width];">
      <div class="vert-line" id="vl-proc" style="height:24px;"></div>
    </div>
    <div style="flex:1;"></div>
    <div style="min-width:[match output card width];"></div>
  </div>

  <!-- STORAGE ROW -->
  <div style="display:flex;align-items:flex-start;width:100%;max-width:1000px;">
    <div style="min-width:[match input card width];"></div>
    <div class="storage-pipeline" style="margin:0 8px;">
      <div class="storage-title">EXTERNAL SERVICES</div>
      <div class="storage-item" id="s-db">...</div>
      <div class="storage-sep">·</div>
      <div class="storage-item" id="s-llm">...</div>
      <div class="storage-sep">·</div>
      <div class="storage-item" id="s-cache">...</div>
    </div>
    <div style="min-width:[match output card width];"></div>
  </div>

===================================================================
LAYOUT B — MULTI-AGENT HUB
===================================================================

Use when:
  → Orchestrator spawns parallel workers / sub-agents
  → ReAct loops, multi-agent systems, fan-out/fan-in patterns
  → Agents share a common service layer (LLM, tools, DB)

Visual shape:

  [User] → [Orchestrator]
               ↓  ↓  ↓
           [A1] [A2] [A3]   ← agents row
               ↓  ↓  ↓
           [LLM | VectorDB | Tools]

HTML skeleton:

  <!-- TOP: user + orchestrator -->
  <div style="display:flex;align-items:center;width:100%;max-width:900px;">
    <div class="component" id="c-user">...</div>
    <div class="arrow-col">...</div>
    <div class="component" id="c-orch">...</div>
  </div>

  <!-- VERT DROPS to agents (mirrors agents row flex structure) -->
  <div style="display:flex;gap:12px;width:100%;max-width:700px;">
    <div style="flex:1;display:flex;justify-content:center;">
      <div class="vert-line" id="vl-a1" style="height:20px;width:2px;"></div>
    </div>
    <div style="flex:1;display:flex;justify-content:center;">
      <div class="vert-line" id="vl-a2" style="height:20px;width:2px;"></div>
    </div>
    <div style="flex:1;display:flex;justify-content:center;">
      <div class="vert-line" id="vl-a3" style="height:20px;width:2px;"></div>
    </div>
  </div>

  <!-- AGENTS ROW -->
  <div style="display:flex;gap:12px;width:100%;max-width:700px;">
    <div class="agent-card" id="a1">...</div>
    <div class="agent-card" id="a2">...</div>
    <div class="agent-card" id="a3">...</div>
  </div>

  <!-- VERT DROPS to services (mirrors agents row flex structure) -->
  <div style="display:flex;gap:12px;width:100%;max-width:700px;">
    <div style="flex:1;display:flex;justify-content:center;">
      <div class="vert-line" id="vl-s1" style="height:20px;width:2px;"></div>
    </div>
    <div style="flex:1;display:flex;justify-content:center;">
      <div class="vert-line" id="vl-s2" style="height:20px;width:2px;"></div>
    </div>
    <div style="flex:1;display:flex;justify-content:center;">
      <div class="vert-line" id="vl-s3" style="height:20px;width:2px;"></div>
    </div>
  </div>

  <!-- SHARED SERVICES -->
  <div class="storage-pipeline" style="width:100%;max-width:700px;margin-top:0;">
    <div class="storage-title">SHARED SERVICES</div>
    <div class="storage-item" id="s-llm">...</div>
    <div class="storage-sep">·</div>
    <div class="storage-item" id="s-vdb">...</div>
    <div class="storage-sep">·</div>
    <div class="storage-item" id="s-tools">...</div>
  </div>

===================================================================
LAYOUT C — MEDALLION PIPELINE
===================================================================

Use when:
  → ETL / ELT systems, Databricks, Delta Live Tables
  → Staged data transformations (Bronze → Silver → Gold)
  → Clear sequential processing with a storage layer per stage

Visual shape:

  [Source] → [Bronze/Ingest] → [Silver/Transform] → [Gold/Serve]
                  ↕                    ↕                   ↕
            [Raw Storage]       [Delta Tables]      [Semantic Layer / BI]

HTML skeleton:

  <!-- PIPELINE ROW -->
  <div style="display:flex;align-items:center;width:100%;max-width:1100px;">
    <div class="component" id="c-source">...</div>
    <div class="arrow-col">
      <div class="arrow-wrap">
        <div class="arrow-line" id="arr-ingest"><div class="shimmer"></div></div>
        <div class="arrow-lbl">raw events →</div>
      </div>
    </div>
    <div class="component" id="c-bronze">...</div>
    <div class="arrow-col">
      <div class="arrow-wrap">
        <div class="arrow-line" id="arr-silver"><div class="shimmer"></div></div>
        <div class="arrow-lbl">cleaned →</div>
      </div>
    </div>
    <div class="component" id="c-silver">...</div>
    <div class="arrow-col">
      <div class="arrow-wrap">
        <div class="arrow-line" id="arr-gold"><div class="shimmer"></div></div>
        <div class="arrow-lbl">aggregated →</div>
      </div>
    </div>
    <div class="component" id="c-gold">...</div>
  </div>

  <!-- VERT CONNECTORS per stage -->
  <div style="display:flex;width:100%;max-width:1100px;">
    <div style="min-width:[source width];"></div>
    <div style="flex:1;"></div>
    <div style="display:flex;flex-direction:column;align-items:center;min-width:[bronze width];">
      <div class="vert-line" id="vl-bronze" style="height:24px;"></div>
    </div>
    <!-- repeat for silver, gold -->
  </div>

  <!-- STORAGE TIER per stage -->
  <div style="display:flex;width:100%;max-width:1100px;">
    <div style="min-width:[source width];flex:1;"></div>
    <div class="storage-pipeline" style="flex:3;margin:0 8px;">
      <div class="storage-title">DELTA LAKE LAYERS</div>
      <div class="storage-item" id="s-raw">...</div>
      <div class="storage-sep">·</div>
      <div class="storage-item" id="s-silver">...</div>
      <div class="storage-sep">·</div>
      <div class="storage-item" id="s-gold">...</div>
    </div>
    <div style="min-width:[serve width];flex:1;"></div>
  </div>

===================================================================
VERTICAL CONNECTOR ALIGNMENT — CRITICAL RULE
===================================================================

Vertical connector rows (vert-line divs between tiers) MUST mirror the
exact flex layout of the row they connect to. Misaligned connectors are
the #1 visual bug in generated diagrams.

THE RULE:
  The connector row's child div structure MUST replicate the sizing
  of the adjacent component row it connects to.

PATTERN A — Connecting to a row of equal-width flex items:
  If the row above uses: display:flex; gap:Xpx; with flex:1 children,
  the connector row MUST also use: display:flex; gap:Xpx; with flex:1
  children (each centering a vert-line).

  GOOD:
    <!-- Agent row: flex:1 cards, gap:10px -->
    <div style="display:flex;gap:10px;width:100%;max-width:1100px;">
      <div class="agent-card" style="flex:1;">...</div>
      <div class="agent-card" style="flex:1;">...</div>
    </div>
    <!-- Connector mirrors same layout -->
    <div style="display:flex;gap:10px;width:100%;max-width:1100px;">
      <div style="flex:1;display:flex;justify-content:center;">
        <div class="vert-line" style="height:16px;width:2px;"></div>
      </div>
      <div style="flex:1;display:flex;justify-content:center;">
        <div class="vert-line" style="height:16px;width:2px;"></div>
      </div>
    </div>

  BAD (fixed gap doesn't match flex cards):
    <div style="display:flex;justify-content:flex-end;padding-right:30px;">
      <div style="display:flex;gap:38px;">
        <div class="vert-line">...</div>
        <div class="vert-line">...</div>
      </div>
    </div>

PATTERN B — Connecting to a row of component + arrow-col alternating:
  If the row uses: component(min-width:Xpx) + arrow-col(flex:1) + ...
  the connector row MUST replicate each slot with matching min-width
  and flex spacers.

  GOOD:
    <!-- Shared path: component 110px, arrow flex:1, component 120px, ... -->
    <div style="display:flex;align-items:center;width:100%;max-width:1100px;">
      <div style="display:flex;justify-content:center;min-width:110px;">
        <div class="vert-line" style="height:20px;"></div>
      </div>
      <div style="flex:1;max-width:60px;"></div>
      <div style="display:flex;justify-content:center;min-width:120px;">
        <div class="vert-line" style="height:20px;"></div>
      </div>
      <!-- ... mirrors every slot in the row above -->
    </div>

  BAD (uniform flex:1 doesn't match alternating layout):
    <div style="display:flex;">
      <div style="flex:1;"><div class="vert-line">...</div></div>
      <div style="flex:1;"></div>
      <div style="flex:1;"><div class="vert-line">...</div></div>
    </div>

NEVER:
  → Use fixed px gaps (gap:38px) to align with flex:1 cards
  → Use justify-content:flex-end with padding to "eyeball" alignment
  → Use uniform flex:1 grids to connect to rows with mixed widths
  → Omit gap from connector rows when the adjacent row has gap

ALWAYS:
  → Copy the exact flex structure from the row you're connecting to
  → Match gap values between connector and component rows
  → Match min-width values for fixed-width components
  → Match flex:1 + max-width for arrow-col spacers
