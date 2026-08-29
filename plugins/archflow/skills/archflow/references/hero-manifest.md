# Hero Diagram Manifest

Use this original Archflow format whenever a report needs a connected hero diagram. The manifest separates architectural truth from presentation: the agent chooses the story and layout; the renderer guarantees repeatable SVG markup and checks common visual failures.

## Workflow

1. Analyze the repository and choose one primary flow spine.
2. Author a versioned JSON manifest with evidence for every entity.
3. Run `validate` with the analyzed repository as `--repo-root`.
4. Place `<!-- ARCHFLOW_HERO -->` once in the bespoke report template.
5. Run `render`; it validates before atomically writing the report.
6. Inspect the rendered report in a browser and run the independent design review.

```bash
node scripts/hero-diagram.mjs validate hero.json --repo-root /path/to/repo
node scripts/hero-diagram.mjs inspect hero.json --repo-root /path/to/repo --json
node scripts/hero-diagram.mjs render hero.json architecture-report.html \
  --template report.template.html --repo-root /path/to/repo --json
```

## Shape

```json
{
  "archflow_hero": 1,
  "project": { "title": "System name", "subtitle": "What the flow explains" },
  "canvas": { "width": 1440, "height": 760 },
  "zones": [
    { "id": "sources", "title": "Sources", "tone": "cool", "frame": { "x": 20, "y": 60, "w": 280, "h": 620 } }
  ],
  "entities": [
    {
      "id": "extractor",
      "title": "Source extractor",
      "caption": "Collects source snapshots",
      "kind": "process",
      "zone": "sources",
      "tag": "PYTHON",
      "frame": { "x": 55, "y": 150, "w": 190, "h": 92 },
      "evidence": [{ "path": "src/extractor.py", "start_line": 20, "end_line": 88 }]
    }
  ],
  "flows": [
    {
      "id": "extract-build",
      "source": "extractor",
      "target": "builder",
      "label": "snapshots",
      "kind": "data",
      "source_port": "right",
      "source_offset": -12,
      "target_port": "left",
      "target_offset": 12,
      "via": [[300, 196], [300, 340]],
      "label_at": [300, 315]
    }
  ],
  "chapters": [
    { "id": "collect", "label": "Collect", "color": "mint", "zones": ["sources"], "entities": ["extractor"], "flows": [] }
  ]
}
```

## Contract

- `canvas`, `frame`, and optional `via` coordinates are explicit pixels in SVG view-box space.
- `label_at` optionally fixes a flow label at an explicit `[x, y]` when the automatic longest-segment placement is crowded.
- IDs are unique across zones, entities, flows, and chapters.
- Entity kinds are semantic hints: `source`, `process`, `store`, `view`, `interface`, or `control`.
- Ports are `left`, `right`, `top`, or `bottom`. `source_offset` and `target_offset` move an endpoint along that side from its center; keep at least 8px from node corners. Routes must be orthogonal.
- Assign entities to zones only when the zone fully contains them with padding.
- Every entity carries at least one repository-relative evidence range when `--repo-root` is provided.
- Use 4–8 chapters. Every entity and flow must be activated by at least one chapter.
- Explicit routes may not cross unrelated entity interiors. Unrelated flows may not share segments, arrowheads, or corridors narrower than 10px; use offset ports and distinct `via` lanes. Shared trunks require an explicit junction entity. Keep entity frames at least 130×68.
- A full HTML report must include print CSS, a `beforeprint` composite state, reduced-motion handling, and persisted theme selection.

The renderer emits stable `data-af-zone`, `data-af-entity`, and `data-af-flow` hooks. Report JavaScript should toggle `is-active` on those groups from the chapter definitions; it should not redraw or mutate SVG geometry.
