# Design System

Colors, typography, and CSS classes for the architecture diagram.
Copy the base CSS block into every generated HTML file.

===================================================================
COLOR PALETTE
===================================================================

  Background body    → #080c10
  Card background    → #0d1117
  Card border        → #21262d
  Subtle border      → #30363d
  Text primary       → #e6edf3
  Text secondary     → #c9d1d9
  Text muted         → #8b949e
  Text dim           → #4a5568

  Semantic accent assignments — one color per architectural role:

    Cyan    #00d4ff   user / input / client layer
    Orange  #ff6b35   orchestrator / coordinator / router
    Purple  #a78bfa   agents / workers / sub-processes
    Yellow  #e8b84b   storage / external services / RAG
    Green   #3fb950   output / persistence / success state
    Amber   #f0883e   LLM / AI inference / model core
    Blue    #58a6ff   app layer / API responses / user-facing
    Red     #f85149   errors / warnings (use sparingly)

===================================================================
TYPOGRAPHY
===================================================================

  Font stack    → 'JetBrains Mono', 'Fira Code', monospace
  Title main    → 22px, weight 700, #e6edf3, letter-spacing -0.5px
  Title sub     → 10px, weight 400, letter-spacing 4px, #4a5568, UPPERCASE
  Section label → 9px, letter-spacing 3px, UPPERCASE, accent color
  Card label    → 10px, weight 700, letter-spacing 1px, accent color
  Card sublabel → 9px, color #4a5568, line-height 1.4
  Card body     → 9px, color #8b949e, line-height 1.7
  Phase banner  → 11px, accent color, transitions on color/border change

===================================================================
BASE CSS — COPY INTO EVERY GENERATED FILE
===================================================================

<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    min-height: 100vh;
    background: #080c10;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    color: #c9d1d9;
  }

  /* TITLE */
  .title-sub {
    font-size: 10px; letter-spacing: 4px; color: #4a5568;
    margin-bottom: 6px; text-align: center; text-transform: uppercase;
  }
  .title-main {
    font-size: 22px; font-weight: 700; color: #e6edf3;
    letter-spacing: -0.5px; text-align: center; margin-bottom: 28px;
  }

  /* PHASE BANNER */
  .phase-banner {
    background: #0d1117;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 10px 24px;
    margin-bottom: 32px;
    font-size: 11px;
    min-width: 400px;
    max-width: 700px;
    text-align: center;
    transition: color 0.4s, border-color 0.4s;
  }

  /* COMPONENT CARD */
  .component {
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 10px;
    padding: 14px;
    text-align: center;
    transition: border-color 0.4s, box-shadow 0.4s;
    min-width: 120px;
  }
  .component-icon  { font-size: 22px; margin-bottom: 6px; }
  .component-label { font-size: 10px; font-weight: 700;
                     letter-spacing: 1px; margin-bottom: 3px; }
  .component-sub   { font-size: 8px; color: #4a5568;
                     margin-bottom: 6px; line-height: 1.4; }
  .component-body  { font-size: 8px; color: #8b949e; line-height: 1.7; }

  /* AGENT CARD (lighter variant for parallel workers) */
  .agent-card {
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 8px;
    padding: 10px 12px;
    text-align: center;
    flex: 1;
    transition: border-color 0.4s, box-shadow 0.4s;
  }

  /* ARROW */
  .arrow-col  { flex: 1; padding: 0 8px;
                display: flex; flex-direction: column; gap: 8px; }
  .arrow-wrap { display: flex; flex-direction: column; }
  .arrow-line {
    height: 2px; background: #21262d;
    border-radius: 1px; position: relative; overflow: hidden;
    transition: background 0.4s;
  }
  .arrow-line .shimmer {
    display: none; position: absolute; top: 0; left: -20%;
    width: 20%; height: 100%;
    background: white; opacity: 0.85;
    animation: slide 0.7s linear infinite;
  }
  .arrow-line.active .shimmer { display: block; }
  .arrow-lbl       { text-align: center; font-size: 9px;
                     color: #4a5568; margin-top: 3px; }
  .arrow-lbl.above { margin-top: 0; margin-bottom: 3px; }

  /* VERTICAL CONNECTOR */
  .vert-line {
    width: 2px; background: #21262d;
    transition: background 0.4s; margin: 0 auto;
  }

  /* STORAGE / EXTERNAL SERVICES ROW */
  .storage-pipeline {
    display: flex; align-items: center; gap: 0;
    background: #0a0f14;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 14px 12px;
    position: relative;
  }
  .storage-title {
    position: absolute; top: -10px; left: 16px;
    background: #080c10; padding: 0 8px;
    font-size: 9px; letter-spacing: 3px;
    color: #e8b84b; text-transform: uppercase;
  }
  .storage-item {
    flex: 1; background: #0d1117; border: 1px solid #21262d;
    border-radius: 8px; padding: 10px;
    text-align: center; min-width: 80px;
    transition: border-color 0.4s, box-shadow 0.4s;
  }
  .storage-sep { width: 16px; text-align: center;
                 font-size: 10px; color: #21262d; flex-shrink: 0; }

  /* INSIGHTS ROW */
  .insights {
    margin-top: 32px; display: flex; gap: 10px;
    flex-wrap: wrap; justify-content: center;
  }
  .insight-card {
    background: #0d1117; border: 1px solid #21262d;
    border-radius: 8px; padding: 10px 16px;
    text-align: center; min-width: 150px;
  }
  .insight-label { font-size: 9px; letter-spacing: 2px;
                   margin-bottom: 3px; text-transform: uppercase; }
  .insight-value { font-size: 10px; color: #8b949e; }

  /* KEYFRAMES */
  @keyframes slide { from { left: -20%; } to { left: 120%; } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
</style>

===================================================================
COMPONENT ICON GUIDE
===================================================================

  👤  User / client / human
  🌐  API / HTTP endpoint / gateway
  ⚙️  Orchestrator / engine / coordinator
  🤖  Agent / bot / AI worker
  🔍  Search / query / embed / lookup
  🗄️  Database / storage / warehouse
  📄  Document / file / chunk / record
  🧩  Augmentation / injection / compose
  📊  Analytics / dashboard / metrics
  🔄  Pipeline / loop / cycle / stream
  📡  Event / message / queue / pub-sub
  🏗️  Builder / generator / factory
  🔐  Auth / security / compliance
  📦  Package / artifact / output
  🧠  LLM / embedding / AI inference
  💾  Persistence / cache / write
  📬  Notification / webhook / emit
  🔀  Router / dispatcher / load balancer
  📥  Ingest / intake / collector
  🪄  Transform / enrich / process
