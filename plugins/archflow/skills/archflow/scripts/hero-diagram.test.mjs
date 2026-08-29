import assert from "node:assert/strict";
import { test } from "node:test";
import { renderSvg, routeFlow, validateArtifact, validateManifest } from "./hero-diagram.mjs";

const base = () => ({
  archflow_hero: 1,
  project: { title: "Test system", subtitle: "A deterministic flow" },
  canvas: { width: 800, height: 360 },
  zones: [
    { id: "input-zone", title: "Input", frame: { x: 20, y: 40, w: 220, h: 260 } },
    { id: "output-zone", title: "Output", frame: { x: 560, y: 40, w: 220, h: 260 } },
  ],
  entities: [
    { id: "source", title: "Source", caption: "Incoming data", kind: "source", zone: "input-zone", frame: { x: 50, y: 130, w: 160, h: 84 } },
    { id: "process", title: "Transform", caption: "Pure operation", kind: "process", frame: { x: 320, y: 130, w: 160, h: 84 } },
    { id: "target", title: "Target", caption: "Materialized view", kind: "view", zone: "output-zone", frame: { x: 590, y: 130, w: 160, h: 84 } },
  ],
  flows: [
    { id: "source-process", source: "source", target: "process", label: "normalize", label_at: [280, 150] },
    { id: "process-target", source: "process", target: "target", label: "publish", label_at: [520, 150] },
  ],
  chapters: [
    { id: "chapter-1", label: "Source", entities: ["source"], flows: [], zones: ["input-zone"] },
    { id: "chapter-2", label: "Transform", entities: ["process"], flows: ["source-process"] },
    { id: "chapter-3", label: "Publish", entities: ["target"], flows: ["process-target"], zones: ["output-zone"] },
    { id: "chapter-4", label: "Complete", entities: ["source", "process", "target"], flows: ["source-process", "process-target"], zones: ["input-zone", "output-zone"] },
  ],
});

test("validates and renders a complete manifest", async () => {
  const manifest = base();
  assert.deepEqual(await validateManifest(manifest), []);
  const svg = renderSvg(manifest);
  assert.match(svg, /data-archflow-hero="1"/);
  assert.match(svg, /markerUnits="userSpaceOnUse"/);
  assert.match(svg, /data-af-entity="process"/);
  assert.deepEqual(validateArtifact(svg, manifest), []);
});

test("derives an orthogonal route", () => {
  const manifest = base();
  const points = routeFlow(manifest.flows[0], new Map(manifest.entities.map((entity) => [entity.id, entity])));
  assert.deepEqual(points, [{ x: 210, y: 172 }, { x: 320, y: 172 }]);
});

test("offsets endpoint ports without changing the node frame", () => {
  const manifest = base();
  manifest.flows[0].target_offset = 10;
  const points = routeFlow(manifest.flows[0], new Map(manifest.entities.map((entity) => [entity.id, entity])));
  assert.deepEqual(points, [
    { x: 210, y: 172 },
    { x: 265, y: 172 },
    { x: 265, y: 182 },
    { x: 320, y: 182 },
  ]);
});

test("rejects diagonal routes and overlapping entities", async () => {
  const manifest = base();
  manifest.entities[1].frame.x = 190;
  manifest.flows[0].via = [[260, 110]];
  const issues = await validateManifest(manifest);
  assert.ok(issues.some((entry) => entry.code === "entity.overlap"));
  assert.ok(issues.some((entry) => entry.code === "flow.diagonal"));
});

test("requires every entity and flow to appear in the narrative", async () => {
  const manifest = base();
  manifest.chapters = manifest.chapters.map((chapter) => ({ ...chapter, entities: [], flows: [] }));
  const issues = await validateManifest(manifest);
  assert.ok(issues.some((entry) => entry.code === "chapter.entity_uncovered"));
  assert.ok(issues.some((entry) => entry.code === "chapter.flow_uncovered"));
});

test("rejects ambiguous overlapping reverse flows", async () => {
  const manifest = base();
  manifest.flows.push({ id: "process-source", source: "process", target: "source" });
  manifest.chapters[3].flows.push("process-source");
  const issues = await validateManifest(manifest);
  assert.ok(issues.some((entry) => entry.code === "flow.reverse_overlap"));
});

test("rejects shared fan-in arrowheads and same-direction segments", async () => {
  const manifest = base();
  manifest.entities.push({ id: "source-2", title: "Source 2", caption: "Second input", kind: "source", zone: "input-zone", frame: { x: 50, y: 220, w: 160, h: 68 } });
  manifest.flows.push({ id: "source-2-process", source: "source-2", target: "process", label: "normalize" });
  manifest.chapters[3].entities.push("source-2");
  manifest.chapters[3].flows.push("source-2-process");
  const issues = await validateManifest(manifest);
  assert.ok(issues.some((entry) => entry.code === "flow.shared_arrowhead"));
  assert.ok(issues.some((entry) => entry.code === "flow.segment_overlap"));
});

test("rejects endpoint offsets that approach node corners", async () => {
  const manifest = base();
  manifest.flows[0].target_offset = 40;
  const issues = await validateManifest(manifest);
  assert.ok(issues.some((entry) => entry.code === "flow.port_offset_bounds"));
});

test("rejects labels placed across a route", async () => {
  const manifest = base();
  manifest.flows[0].label_at = [265, 172];
  const issues = await validateManifest(manifest);
  assert.ok(issues.some((entry) => entry.code === "flow.label_route_collision"));
});

test("rejects labels placed across a zone border", async () => {
  const manifest = base();
  manifest.flows[0].label_at = [240, 100];
  const issues = await validateManifest(manifest);
  assert.ok(issues.some((entry) => entry.code === "flow.label_zone_border"));
});

test("rejects parallel routes closer than the lane clearance", async () => {
  const manifest = base();
  manifest.flows.push({ id: "source-process-close", source: "source", target: "process", label: "normalize", source_offset: 5, target_offset: 5 });
  manifest.chapters[3].flows.push("source-process-close");
  const issues = await validateManifest(manifest);
  assert.ok(issues.some((entry) => entry.code === "flow.ambiguous_corridor"));
});

test("rejects proper crossings between unrelated routes", async () => {
  const manifest = base();
  manifest.flows[1].via = [[500, 172], [500, 280], [590, 280]];
  manifest.flows.push({
    id: "source-target",
    source: "source",
    target: "target",
    label: "bypass",
    source_port: "bottom",
    target_port: "bottom",
    via: [[130, 260], [550, 260], [550, 214]],
  });
  manifest.chapters[3].flows.push("source-target");
  const issues = await validateManifest(manifest);
  assert.ok(issues.some((entry) => entry.code === "flow.crossing"));
});
