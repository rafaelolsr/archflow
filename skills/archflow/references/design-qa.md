# Design Quality Gates

Visual quality checklist and anti-patterns for all archflow outputs.
Run through these checks mentally before finalizing any generated HTML.

===================================================================
PRE-GENERATION: THINK PHASE
===================================================================

Before writing HTML, commit to a visual direction:

  1. What is the project's character?
     → Data engineering / ETL     → IBM Plex Sans, cool blues
     → AI / ML / agents          → DM Sans, warm oranges + purples
     → Enterprise / API          → Outfit, clean geometric
     → Developer tooling         → Bricolage Grotesque, bold greens

  2. Which palette family fits?
     → Default (cyan/orange/purple) for technical systems
     → Warm Signal (teal/terracotta/amber) for data platforms
     → Nordic (ice-blue/slate/frost-green) for enterprise
     → Terminal (neon-green/hot-pink/electric-blue) for dev tools

  3. Which atmosphere?
     → Radial glow for most outputs
     → Dot grid for minimal / enterprise
     → Gradient mesh for data-heavy / editorial

  Do NOT default to the same font + palette + atmosphere every time.
  Each project should feel intentionally designed, not template-stamped.

===================================================================
SQUINT TEST
===================================================================

Blur the page to 50% in your mind. Can you still distinguish:

  → The header from the body?
  → The hero diagram from surrounding sections?
  → KPI cards from insight cards?
  → The TOC sidebar from the main content?

If everything blurs into one uniform column, you need more
visual hierarchy. Fix with:

  → Vary card depth tiers (hero, elevated, recessed, glass)
  → Use full-width sections alternating with grid sections
  → Make the diagram section visually heavier than others
  → Use accent color stripes to break monotony

===================================================================
SWAP TEST
===================================================================

Mentally replace the accent colors with a different palette.
Does the design still work?

  → If hierarchy depends on a specific color, it's fragile.
  → Hierarchy should come from SIZE, WEIGHT, DEPTH, and SPACE —
    not from color alone.
  → Color reinforces hierarchy; it should never be the only signal.

===================================================================
DEPTH VARIETY CHECK
===================================================================

Every report must use at least 3 different card depth tiers:

  ✓ af-card--hero      → Executive summary, key finding
  ✓ af-card--elevated  → Insights, service cards, important content
  ✓ af-card (base)     → Standard content cards
  ✓ af-card--recessed  → Component table wrapper, code references
  ✓ af-card--glass     → Special callouts (use sparingly, max 1 per report)

  BAD:  Every section uses the same flat af-card
  GOOD: Overview is --hero, insights are --elevated, code refs are --recessed

===================================================================
ACCENT COLOR VARIETY
===================================================================

Never give all cards in a section the same accent color.

  BAD:  4 insight cards, all with af-card--accent-cyan
  GOOD: Insight 1: cyan, Insight 2: orange, Insight 3: green, Insight 4: purple

  BAD:  3 service cards, all with af-card--accent-yellow
  GOOD: Service cards use the color matching their role:
        Database → yellow, API → cyan, Cache → green, Queue → orange

  The semantic color assignments from the design system guide this:
    Cyan    → input / client / user-facing
    Orange  → orchestrator / coordinator
    Purple  → agents / workers / processing
    Yellow  → storage / external services
    Green   → output / success / persistence
    Amber   → LLM / AI inference
    Blue    → API / app layer

===================================================================
LAYOUT RHYTHM
===================================================================

Sections should NOT all be the same width and layout.
Create visual rhythm by alternating:

  → Full-width hero card (overview)
  → Multi-column grid (KPIs: 4-col, services: 3-col, insights: 2-col)
  → Full-width diagram (no card wrapper, maximum visual weight)
  → Table (full-width, recessed card wrapper)
  → Asymmetric first item (first insight full-width, rest 2-col)

  BAD:  Every section is a single full-width card, stacked vertically
  GOOD: Overview (full-width hero) → KPIs (4-col grid) → Diagram (full-width, no card)
        → Table (recessed) → Services (3-col grid) → Insights (asymmetric)

===================================================================
ANIMATION CHOREOGRAPHY
===================================================================

Don't use the same animation for everything.

  Entrance Type         Use For                   Timing
  fadeUp                Cards, sections, text      0.4s ease-out
  fadeScale             KPI values, badges, tags   0.35s ease-out
  countUp (CSS)         KPI hero numbers           1.2s ease-out
  none                  Diagram section            (phase engine handles it)

  Stagger: use --i increments of 0.06-0.08s.
  Important elements get lower --i values (appear first).

  Section reveal: use IntersectionObserver so sections animate
  when scrolled into view, not all at page load.

===================================================================
TYPOGRAPHY ANTI-PATTERNS
===================================================================

  NEVER use as the primary body font:
    → Inter
    → Roboto
    → Arial
    → Helvetica
    → system-ui alone (as sole font-family)

  These signal "AI-generated default" and lack character.

  ALWAYS use at least 2 DISTINCT font families (not from the same family):
    → Instrument Serif (display) + DM Sans (body) + Fira Code (mono)
    → Playfair Display (display) + Inter (body) + JetBrains Mono (mono)
    → Fraunces (display) + IBM Plex Sans (body) + IBM Plex Mono (mono)
    → Bebas Neue (display) + Outfit (body) + Space Mono (mono)
    → Bricolage Grotesque (display) + Plus Jakarta Sans (body) + Azeret Mono (mono)

  NEVER use one font family for everything (e.g., Red Hat Display + Red Hat Mono).
  Mix serif display with sans-serif body for editorial contrast.
  Add a third voice: editorial serif (Newsreader, Crimson Pro) for quotes/callouts.

  Rotate pairings across projects. Don't always pick the same set.

===================================================================
COLOR ANTI-PATTERNS
===================================================================

  NEVER:
    → Use the same accent color for all cards in a grid
    → Use gradient text on headings
    → Use animated glowing shadows (archflow's phase engine glow
      is the ONE exception — it's functional, not decorative)
    → Apply neon intensity to body text backgrounds

  ALWAYS:
    → Use semantic color assignments consistently
    → Ensure text on colored backgrounds has sufficient contrast
    → Keep accent colors at 8-12% opacity for card tint backgrounds
    → Use full-strength accents only for borders, labels, and dots

===================================================================
FINAL CHECKLIST — RUN BEFORE PRESENTING
===================================================================

  □ Squint test passes (sections visually distinct when blurred)
  □ Swap test passes (hierarchy works without color alone)
  □ Typography uses 2+ distinct font families (serif + sans or display + body)
  □ No single font family for display + body + labels
  □ Each section has a UNIQUE background treatment (gradient, texture, or atmosphere)
  □ No uniform flat background across all sections
  □ No 3+ adjacent sections with the same card/component shape
  □ At least 3 different component types used (not all bordered rectangles)
  □ Accent colors varied (not monochrome grid)
  □ Background atmosphere matches project character
  □ Diagram phase engine runs correctly
  □ Both dark and light themes work
  □ Sections reveal on scroll (not all at once)
  □ No overflow on mobile viewport
  □ Phase banner is readable in both themes
  □ If you swapped CSS between this report and another, someone WOULD notice
