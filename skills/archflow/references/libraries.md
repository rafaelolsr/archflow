# External Libraries

CDN imports for fonts, diagrams, and optional visualizations.
Only include what the report needs — keep it minimal.

===================================================================
GOOGLE FONTS
===================================================================

Always load fonts via CDN. Pattern:

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=[Body]:wght@300;400;500;600;700;800&family=[Mono]:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

Recommended pairings (use Google import slugs):

  Body                   Mono                  Import Slug (body)
  DM Sans                Fira Code             DM+Sans:wght@300;400;500;600;700
  Outfit                 Space Mono            Outfit:wght@300;400;500;600;700;800
  IBM Plex Sans          IBM Plex Mono         IBM+Plex+Sans:wght@300;400;500;600;700
  Bricolage Grotesque    Fragment Mono         Bricolage+Grotesque:wght@400;500;600;700
  Plus Jakarta Sans      Azeret Mono           Plus+Jakarta+Sans:wght@400;500;600;700
  Sora                   IBM Plex Mono         Sora:wght@300;400;500;600;700
  Geist                  Geist Mono            Geist:wght@400;500;600;700
  Red Hat Display        Red Hat Mono          Red+Hat+Display:wght@400;500;600;700
  Libre Franklin         Inconsolata           Libre+Franklin:wght@400;500;600;700
  Instrument Serif       JetBrains Mono        Instrument+Serif:ital@0;1

  FORBIDDEN as body font: Inter, Roboto, Arial, Helvetica

===================================================================
MERMAID.JS — DIAGRAMS
===================================================================

Use for supplementary diagrams (sequence, ER, state, flowcharts).
NOT for the main animated architecture diagram (that uses the
archflow phase engine).

  Import (place at end of <body>, before closing tag):

    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
      const isDark = !document.body.classList.contains('light');
      mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          primaryColor: isDark ? '#1a2744' : '#e0f2fe',
          primaryBorderColor: isDark ? accent : accent,
          primaryTextColor: isDark ? '#e2e8f4' : '#1a1a2e',
          lineColor: isDark ? '#4a5568' : '#94a3b8',
          fontSize: '16px',
          fontFamily: 'var(--font-body)',
        }
      });
    </script>

  Container CSS:
    .mermaid-wrap {
      display: flex; justify-content: center; align-items: center;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px 24px;
      overflow: auto;
      min-height: 300px;
    }

  Rules:
    → Never use .node as a CSS class (Mermaid uses it internally)
    → Prefer flowchart TD over LR for 10+ nodes
    → Use <br/> for line breaks in labels (not \n)
    → Max 10-12 nodes per diagram
    → Always center diagrams with flexbox
    → Use classDef with semi-transparent fills (alpha 20-44)

  When to use Mermaid vs CSS:
    → Mermaid: complex flows, branching, multiple actors
    → CSS cards/grid: text-heavy architecture, simple linear flows

===================================================================
CHART.JS — OPTIONAL DATA VIZ
===================================================================

Only include when the report has quantitative data that benefits
from charts (benchmarks, performance metrics, distributions).

  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>

  Most reports do NOT need Chart.js. Prefer:
    → CSS bar visualizations for simple comparisons
    → SVG sparklines for inline trends
    → HTML tables for detailed data

===================================================================
CDN POLICY
===================================================================

  Diagram-only mode: ZERO external dependencies
  Report mode: Google Fonts CDN (required) + Mermaid (optional)
  Slide mode: Google Fonts CDN (required)
  Chart.js: only when quantitative data justifies it
