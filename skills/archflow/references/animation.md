# Animation Reference

The JS phase engine that drives all diagram animation.
Follow this pattern exactly in every generated file.

===================================================================
CORE PATTERN
===================================================================

  // ── THEME RESTORE (place at top of script) ─────────────────
  if (localStorage.getItem('archflow-theme') === 'light') document.body.classList.add('light');

  const phases = [
    "Phase 0: plain-language description of what is happening...",
    "Phase 1: next step in the flow...",
    // 4-8 phases total — sweet spot for readability
  ];

  // One accent color per phase, matching the active component's role
  const phaseColors = [
    "#00d4ff",  // phase 0 — user/input (cyan)
    "#ff6b35",  // phase 1 — orchestrator (orange)
    "#a78bfa",  // phase 2 — agents (purple)
    "#e8b84b",  // phase 3 — storage (yellow)
    "#3fb950",  // phase 4 — output (green)
  ];

  let phase = 0;

  // ── THEME-AWARE HELPERS ────────────────────────────────────
  // Read CSS custom properties so colors adapt to dark/light mode.

  const borderColor = () => getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
  const shadowAlpha = () => getComputedStyle(document.documentElement).getPropertyValue('--shadow-alpha').trim();

  function litComponent(id, color) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = color;
    el.style.boxShadow = `0 0 18px ${color}${shadowAlpha()}`;
  }

  function litArrow(id, color, shimmer = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.background = color;
    if (shimmer) el.classList.add("active");
  }

  function litStorage(id) {
    // Storage items always glow yellow
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = "#e8b84b";
    el.style.boxShadow = "0 0 14px #e8b84b33";
  }

  function resetAll() {
    const bc = borderColor();
    document.querySelectorAll(
      ".component, .agent-card, .storage-item"
    ).forEach(el => {
      el.style.borderColor = bc;
      el.style.boxShadow = "none";
    });
    document.querySelectorAll(".arrow-line, .vert-line").forEach(el => {
      el.style.background = bc;
      el.classList.remove("active");
    });
  }

  // ── MAIN APPLY FUNCTION ───────────────────────────────────────

  function applyPhase() {
    const banner = document.getElementById("phase-banner");
    banner.textContent = "▶ " + phases[phase];
    banner.style.color = phaseColors[phase];
    banner.style.borderColor = phaseColors[phase] + "55";

    resetAll();

    // Light up the relevant elements for THIS phase.
    // Use === for a moving spotlight (only active node glows).
    // Use >= to keep earlier nodes lit as animation progresses.
    // Moving spotlight is recommended for most diagrams.

    if (phase === 0) {
      litComponent("c-input", phaseColors[0]);
    }
    if (phase === 1) {
      litArrow("arr-1", phaseColors[1], true); // true = shimmer
      litComponent("c-orch", phaseColors[1]);
    }
    if (phase === 2) {
      litArrow("vl-orch", phaseColors[2]);      // vert connector
      litStorage("s-llm");
    }
    if (phase === 3) {
      litComponent("c-proc", phaseColors[3]);
      litArrow("arr-2", phaseColors[3], true);
    }
    if (phase === 4) {
      litComponent("c-output", phaseColors[4]);
      litArrow("arr-back", phaseColors[4]);
    }
  }

  // ── TICK ─────────────────────────────────────────────────────

  applyPhase();
  setInterval(() => {
    phase = (phase + 1) % phases.length;
    applyPhase();
  }, 1500); // 1500ms per phase — do not go below 1200ms

===================================================================
LAYOUT-AGNOSTIC
===================================================================

The phase engine works with ANY layout direction — horizontal,
vertical, hub, medallion. litComponent, litArrow, litStorage all
target elements by ID, not by position. The same JS works for:

  → Horizontal pipeline (flex-direction: row)
  → Vertical pipeline (flex-direction: column)
  → Multi-agent hub (mixed row + column)
  → Medallion pipeline (sequential stages)

For vertical layouts, use .vert-line elements as connectors
between stacked components. litArrow() lights them the same way
it lights horizontal .arrow-line elements.

===================================================================
THEME TOGGLE
===================================================================

The toggle button adds/removes the .light class on <body>.
All theme-sensitive colors are read from CSS custom properties,
so the phase engine works in both modes without changes.

  borderColor() reads --border     (dark: #21262d, light: #d0d5dd)
  shadowAlpha() reads --shadow-alpha (dark: 44, light: 22)

Accent colors (phaseColors, litStorage yellow) are the same in
both themes — they don't need CSS variables.

===================================================================
TIMING GUIDE
===================================================================

  1500ms    → default, works for 4-6 phases
  1800ms    → use for 7-8 phases (more reading time per label)
  1200ms    → minimum — below this feels rushed

===================================================================
SPOTLIGHT VS CUMULATIVE
===================================================================

  SPOTLIGHT (===)
    Only the currently active components glow.
    Everything else resets to dim.
    Best for: most diagrams, especially pipelines with 5+ phases.

  CUMULATIVE (>=)
    Each phase adds to what's already lit.
    Components stay glowing once activated.
    Best for: short 3-4 phase flows where you want to show
    the full path building up visually.

===================================================================
STORAGE ITEM ANIMATION
===================================================================

Storage items always use yellow (#e8b84b) regardless of phase color.
This visually distinguishes the external services tier from the
main processing layer at all times.

  litStorage("s-vectordb");   // always yellow glow
  litStorage("s-llm");        // always yellow glow

===================================================================
PROCESSING INDICATOR (optional)
===================================================================

For components that represent a slow/async operation (LLM call,
heavy transform), add a blinking indicator while active:

  HTML inside the component:
    <div class="proc-indicator" id="proc-llm">● PROCESSING</div>

  CSS:
    .proc-indicator { display:none; font-size:9px; color:#f0883e;
                      margin-top:8px; }
    .proc-indicator.visible { display:block;
                               animation:blink 0.5s linear infinite; }

  JS — toggle in applyPhase():
    document.getElementById("proc-llm")
      .classList.toggle("visible", phase === 2);

===================================================================
ENTRANCE ANIMATIONS — REPORT SECTIONS
===================================================================

In report mode, two animation systems coexist independently:

  1. PHASE ENGINE (this file, above)
     → Runs via setInterval in the animated diagram hero section
     → Controls component glow, arrow shimmer, phase banner
     → Loops continuously

  2. ENTRANCE ANIMATIONS (CSS only)
     → Fire once on page load for report sections
     → Staggered via --i CSS variable per element
     → Defined in design-system.md (fadeUp, fadeScale keyframes)

These do NOT conflict. The phase engine targets elements by ID
inside the diagram section (.component, .agent-card, .arrow-line,
.storage-item). Entrance animations target .af-section and .af-kpi
elements that live OUTSIDE the diagram section.

  Stagger index assignments (--i values):

    Section          --i    Animation
    Header            0     fadeUp
    Executive Summary 1     fadeUp
    KPI cards       2-6     fadeScale
    Diagram hero      7     fadeUp
    Component table   8     fadeUp
    Data flow         9     fadeUp
    External services 10    fadeUp
    Insights          11    fadeUp
    Code references   12    fadeUp

  How to apply:

    <section class="af-section" style="--i: 8" id="components">
      ...
    </section>

  The animated diagram section (--i: 7) gets the fadeUp entrance
  like other sections, but its internal components are controlled
  by the phase engine, not CSS animations.

===================================================================
REDUCED MOTION
===================================================================

Both animation systems respect prefers-reduced-motion:

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

This disables both entrance animations AND the phase engine's
CSS transitions (border-color, box-shadow). The setInterval
still runs but visual changes are instantaneous rather than
animated — content remains visible and functional.
