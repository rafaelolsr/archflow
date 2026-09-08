#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const SIDES = new Set(["left", "right", "top", "bottom"]);
const ARTIFACT_TOKEN = "<!-- ARCHFLOW_HERO -->";

const issue = (severity, code, message, subject) => ({ severity, code, message, ...(subject ? { subject } : {}) });
const rect = (item) => item.frame;
const right = (r) => r.x + r.w;
const bottom = (r) => r.y + r.h;
const overlaps = (a, b, inset = 0) =>
  a.x + inset < right(b) - inset && right(a) - inset > b.x + inset &&
  a.y + inset < bottom(b) - inset && bottom(a) - inset > b.y + inset;
const inside = (inner, outer, pad = 0) =>
  inner.x >= outer.x + pad && inner.y >= outer.y + pad &&
  right(inner) <= right(outer) - pad && bottom(inner) <= bottom(outer) - pad;
const escapeXml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&apos;");
const slug = (value) => String(value).replace(/[^a-zA-Z0-9_-]+/g, "-");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

function pointFor(entity, side, offset = 0) {
  const r = rect(entity);
  if (side === "left") return { x: r.x, y: r.y + r.h / 2 + offset };
  if (side === "right") return { x: r.x + r.w, y: r.y + r.h / 2 + offset };
  if (side === "top") return { x: r.x + r.w / 2 + offset, y: r.y };
  return { x: r.x + r.w / 2 + offset, y: r.y + r.h };
}

function simplify(points) {
  const result = [];
  for (const point of points) {
    const previous = result.at(-1);
    if (!previous || previous.x !== point.x || previous.y !== point.y) result.push(point);
    if (result.length >= 3) {
      const [a, b, c] = result.slice(-3);
      if ((a.x === b.x && b.x === c.x) || (a.y === b.y && b.y === c.y)) result.splice(-2, 1);
    }
  }
  return result;
}

export function routeFlow(flow, entitiesById) {
  const source = entitiesById.get(flow.source);
  const target = entitiesById.get(flow.target);
  if (!source || !target) return [];
  const sourcePort = flow.source_port || "right";
  const targetPort = flow.target_port || "left";
  const sourceOffset = Number.isFinite(flow.source_offset) ? flow.source_offset : 0;
  const targetOffset = Number.isFinite(flow.target_offset) ? flow.target_offset : 0;
  const start = pointFor(source, sourcePort, sourceOffset);
  const end = pointFor(target, targetPort, targetOffset);
  if (Array.isArray(flow.via) && flow.via.length) {
    return simplify([start, ...flow.via.map(([x, y]) => ({ x, y })), end]);
  }
  if (start.x === end.x || start.y === end.y) return [start, end];
  if (["left", "right"].includes(sourcePort) && ["left", "right"].includes(targetPort)) {
    const midX = Math.round((start.x + end.x) / 2);
    return simplify([start, { x: midX, y: start.y }, { x: midX, y: end.y }, end]);
  }
  if (["top", "bottom"].includes(sourcePort) && ["top", "bottom"].includes(targetPort)) {
    const midY = Math.round((start.y + end.y) / 2);
    return simplify([start, { x: start.x, y: midY }, { x: end.x, y: midY }, end]);
  }
  return simplify([start, { x: end.x, y: start.y }, end]);
}

function portSpan(entity, side) {
  return ["left", "right"].includes(side) ? entity.frame.h : entity.frame.w;
}

function segmentRelation(a, b, c, d) {
  const firstHorizontal = a.y === b.y;
  const secondHorizontal = c.y === d.y;
  if (firstHorizontal === secondHorizontal) {
    const firstAxis = firstHorizontal ? a.y : a.x;
    const secondAxis = secondHorizontal ? c.y : c.x;
    const firstLow = firstHorizontal ? Math.min(a.x, b.x) : Math.min(a.y, b.y);
    const firstHigh = firstHorizontal ? Math.max(a.x, b.x) : Math.max(a.y, b.y);
    const secondLow = secondHorizontal ? Math.min(c.x, d.x) : Math.min(c.y, d.y);
    const secondHigh = secondHorizontal ? Math.max(c.x, d.x) : Math.max(c.y, d.y);
    const overlapLength = Math.min(firstHigh, secondHigh) - Math.max(firstLow, secondLow);
    if (overlapLength <= 2) return null;
    const gap = Math.abs(firstAxis - secondAxis);
    if (gap === 0) return { type: "overlap", length: overlapLength };
    if (gap < 10) return { type: "corridor", length: overlapLength, gap };
    return null;
  }

  const horizontalA = firstHorizontal ? a : c;
  const horizontalB = firstHorizontal ? b : d;
  const verticalA = firstHorizontal ? c : a;
  const verticalB = firstHorizontal ? d : b;
  const x = verticalA.x;
  const y = horizontalA.y;
  const insideHorizontal = x > Math.min(horizontalA.x, horizontalB.x) + 2 && x < Math.max(horizontalA.x, horizontalB.x) - 2;
  const insideVertical = y > Math.min(verticalA.y, verticalB.y) + 2 && y < Math.max(verticalA.y, verticalB.y) - 2;
  return insideHorizontal && insideVertical ? { type: "crossing", point: { x, y } } : null;
}

function segmentHitsRect(a, b, r) {
  const epsilon = 2;
  if (a.y === b.y) {
    const low = Math.min(a.x, b.x);
    const high = Math.max(a.x, b.x);
    return a.y > r.y + epsilon && a.y < bottom(r) - epsilon && high > r.x + epsilon && low < right(r) - epsilon;
  }
  if (a.x === b.x) {
    const low = Math.min(a.y, b.y);
    const high = Math.max(a.y, b.y);
    return a.x > r.x + epsilon && a.x < right(r) - epsilon && high > r.y + epsilon && low < bottom(r) - epsilon;
  }
  return true;
}

function longestSegment(points) {
  let best = null;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    const length = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    if (!best || length > best.length) best = { a, b, length };
  }
  return best;
}

function labelPosition(flow, points) {
  if (!flow.label || points.length < 2) return null;
  if (Array.isArray(flow.label_at) && flow.label_at.length === 2 && flow.label_at.every(Number.isFinite)) {
    return { x: flow.label_at[0], y: flow.label_at[1], anchor: "middle" };
  }
  const segment = longestSegment(points);
  const horizontal = segment.a.y === segment.b.y;
  return horizontal
    ? { x: (segment.a.x + segment.b.x) / 2, y: segment.a.y - 13, anchor: "middle" }
    : { x: segment.a.x + 12, y: (segment.a.y + segment.b.y) / 2 + 3, anchor: "start" };
}

function wrapText(text, maxChars, maxLines = 2) {
  const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  for (const word of words) {
    const candidate = lines.length ? `${lines.at(-1)} ${word}` : word;
    if (!lines.length || candidate.length > maxChars) lines.push(word);
    else lines[lines.length - 1] = candidate;
  }
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].slice(0, Math.max(1, maxChars - 1))}…`;
    return { lines: kept, truncated: true };
  }
  return { lines, truncated: false };
}

async function validateEvidence(entity, repoRoot, issues) {
  if (!repoRoot) return;
  if (!Array.isArray(entity.evidence) || entity.evidence.length === 0) {
    issues.push(issue("error", "evidence.missing", "Every entity needs at least one source reference.", entity.id));
    return;
  }
  for (const ref of entity.evidence) {
    if (!ref.path || !Number.isInteger(ref.start_line) || ref.start_line < 1) {
      issues.push(issue("error", "evidence.shape", "Evidence needs path and a positive start_line.", entity.id));
      continue;
    }
    const candidate = path.resolve(repoRoot, ref.path);
    if (candidate !== path.resolve(repoRoot) && !candidate.startsWith(`${path.resolve(repoRoot)}${path.sep}`)) {
      issues.push(issue("error", "evidence.escape", `Evidence leaves repository root: ${ref.path}`, entity.id));
      continue;
    }
    try {
      const contents = await fs.readFile(candidate, "utf8");
      const lineCount = contents.split(/\r?\n/).length;
      const endLine = ref.end_line ?? ref.start_line;
      if (endLine < ref.start_line || endLine > lineCount) {
        issues.push(issue("error", "evidence.range", `Evidence line range is outside ${ref.path} (${lineCount} lines).`, entity.id));
      }
    } catch {
      issues.push(issue("error", "evidence.not_found", `Evidence file does not exist: ${ref.path}`, entity.id));
    }
  }
}

export async function validateManifest(manifest, options = {}) {
  const issues = [];
  if (manifest.archflow_hero !== 1) issues.push(issue("error", "manifest.version", "archflow_hero must equal 1."));
  const canvas = manifest.canvas || {};
  if (!(canvas.width > 0 && canvas.height > 0)) issues.push(issue("error", "canvas.invalid", "Canvas width and height must be positive."));
  const zones = Array.isArray(manifest.zones) ? manifest.zones : [];
  const entities = Array.isArray(manifest.entities) ? manifest.entities : [];
  const flows = Array.isArray(manifest.flows) ? manifest.flows : [];
  const chapters = Array.isArray(manifest.chapters) ? manifest.chapters : [];
  if (!entities.length) issues.push(issue("error", "entities.empty", "At least one entity is required."));
  if (!flows.length) issues.push(issue("error", "flows.empty", "At least one flow is required."));
  if (chapters.length < 4 || chapters.length > 8) issues.push(issue("error", "chapters.count", "Use 4–8 narrative chapters."));

  const allItems = [...zones, ...entities, ...flows, ...chapters];
  const seen = new Set();
  for (const item of allItems) {
    if (!item.id) issues.push(issue("error", "id.missing", "Every zone, entity, flow, and chapter needs an id."));
    else if (seen.has(item.id)) issues.push(issue("error", "id.duplicate", `Duplicate id: ${item.id}`, item.id));
    else seen.add(item.id);
  }

  const zoneById = new Map(zones.map((zone) => [zone.id, zone]));
  const entityById = new Map(entities.map((entity) => [entity.id, entity]));
  const routesById = new Map(flows.map((flow) => [flow.id, routeFlow(flow, entityById)]));
  const canvasRect = { x: 0, y: 0, w: canvas.width || 0, h: canvas.height || 0 };
  for (const item of [...zones, ...entities]) {
    const frame = rect(item);
    if (!frame || ![frame.x, frame.y, frame.w, frame.h].every(Number.isFinite) || frame.w <= 0 || frame.h <= 0) {
      issues.push(issue("error", "frame.invalid", "Frame must contain finite x, y, w, h values and positive size.", item.id));
      continue;
    }
    if (!inside(frame, canvasRect)) issues.push(issue("error", "frame.out_of_bounds", "Frame leaves the SVG canvas.", item.id));
  }

  for (let i = 0; i < entities.length; i += 1) {
    const current = entities[i];
    if (current.frame?.w < 130 || current.frame?.h < 68) issues.push(issue("warning", "entity.compact", "Entity may be too small for readable title and caption.", current.id));
    const title = wrapText(current.title, Math.max(8, Math.floor((current.frame?.w - 38) / 7)), 2);
    if (title.truncated) issues.push(issue("warning", "text.title_fit", "Entity title will be truncated.", current.id));
    const caption = wrapText(current.caption, Math.max(10, Math.floor((current.frame?.w - 24) / 5.6)), 2);
    if (caption.truncated) issues.push(issue("warning", "text.caption_fit", "Entity caption will be truncated.", current.id));
    if (current.tag && current.frame) {
      const tagWidth = String(current.tag).length * 5 + 8;
      const tagRect = { x: right(current.frame) - 7 - tagWidth, y: current.frame.y - 18, w: tagWidth, h: 12 };
      if (!inside(tagRect, canvasRect)) issues.push(issue("error", "tag.out_of_bounds", "Exterior tag leaves the SVG canvas.", current.id));
      for (const other of entities) {
        if (other.id !== current.id && other.frame && overlaps(tagRect, other.frame)) issues.push(issue("error", "tag.collision", `Exterior tag overlaps ${other.id}.`, current.id));
      }
    }
    if (current.zone) {
      const zone = zoneById.get(current.zone);
      if (!zone) issues.push(issue("error", "zone.unknown", `Unknown zone: ${current.zone}`, current.id));
      else if (current.frame && zone.frame && !inside(current.frame, zone.frame, 12)) issues.push(issue("error", "zone.escape", "Entity does not fit inside its assigned zone.", current.id));
    }
    for (let j = i + 1; j < entities.length; j += 1) {
      if (current.frame && entities[j].frame && overlaps(current.frame, entities[j].frame)) {
        issues.push(issue("error", "entity.overlap", `Overlaps ${entities[j].id}.`, current.id));
      }
    }
    await validateEvidence(current, options.repoRoot, issues);
  }

  for (const flow of flows) {
    const source = entityById.get(flow.source);
    const target = entityById.get(flow.target);
    if (!source || !target) {
      issues.push(issue("error", "flow.endpoint", "Flow source and target must reference entities.", flow.id));
      continue;
    }
    if (flow.source === flow.target) issues.push(issue("error", "flow.self", "Self-referencing flows are not supported.", flow.id));
    if (flow.source_port && !SIDES.has(flow.source_port)) issues.push(issue("error", "flow.port", `Unknown source_port: ${flow.source_port}`, flow.id));
    if (flow.target_port && !SIDES.has(flow.target_port)) issues.push(issue("error", "flow.port", `Unknown target_port: ${flow.target_port}`, flow.id));
    if (flow.label_at !== undefined && (!Array.isArray(flow.label_at) || flow.label_at.length !== 2 || !flow.label_at.every(Number.isFinite))) {
      issues.push(issue("error", "flow.label_at", "label_at must be a finite [x, y] coordinate.", flow.id));
    }
    for (const endpoint of ["source", "target"]) {
      const offset = flow[`${endpoint}_offset`];
      if (offset === undefined) continue;
      const side = flow[`${endpoint}_port`] || (endpoint === "source" ? "right" : "left");
      const entity = endpoint === "source" ? source : target;
      if (!Number.isFinite(offset)) {
        issues.push(issue("error", "flow.port_offset", `${endpoint}_offset must be a finite number.`, flow.id));
      } else if (Math.abs(offset) > portSpan(entity, side) / 2 - 8) {
        issues.push(issue("error", "flow.port_offset_bounds", `${endpoint}_offset leaves less than 8px of endpoint clearance.`, flow.id));
      }
    }
    const points = routesById.get(flow.id) || [];
    for (let index = 1; index < points.length; index += 1) {
      if (points[index - 1].x !== points[index].x && points[index - 1].y !== points[index].y) {
        issues.push(issue("error", "flow.diagonal", "Flow routes must use orthogonal segments.", flow.id));
      }
    }
    for (const entity of entities) {
      if ([flow.source, flow.target].includes(entity.id)) continue;
      for (let index = 1; index < points.length; index += 1) {
        if (segmentHitsRect(points[index - 1], points[index], entity.frame)) {
          issues.push(issue("error", "flow.collision", `Route intersects ${entity.id}.`, flow.id));
          break;
        }
      }
    }
    const label = labelPosition(flow, points);
    if (label) {
      const width = String(flow.label).length * 6.2 + 18;
      const labelRect = { x: label.anchor === "middle" ? label.x - width / 2 : label.x, y: label.y - 13, w: width, h: 18 };
      for (const entity of entities) {
        if (overlaps(labelRect, entity.frame)) issues.push(issue("warning", "flow.label_collision", `Label may overlap ${entity.id}.`, flow.id));
      }
      for (const zone of zones) {
        const r = zone.frame;
        const border = [
          [{ x: r.x, y: r.y }, { x: right(r), y: r.y }],
          [{ x: right(r), y: r.y }, { x: right(r), y: bottom(r) }],
          [{ x: right(r), y: bottom(r) }, { x: r.x, y: bottom(r) }],
          [{ x: r.x, y: bottom(r) }, { x: r.x, y: r.y }],
        ];
        if (border.some(([a, b]) => segmentHitsRect(a, b, labelRect))) {
          issues.push(issue("error", "flow.label_zone_border", `Label crosses ${zone.id}; move label_at away from the zone frame.`, flow.id));
        }
      }
      let routeCollision = null;
      for (const other of flows) {
        const otherPoints = routesById.get(other.id) || [];
        for (let index = 1; index < otherPoints.length; index += 1) {
          if (segmentHitsRect(otherPoints[index - 1], otherPoints[index], labelRect)) {
            routeCollision = other.id;
            break;
          }
        }
        if (routeCollision) break;
      }
      if (routeCollision) issues.push(issue("error", "flow.label_route_collision", `Label intersects ${routeCollision}; move label_at into a clear gap.`, flow.id));
    }
  }

  for (let i = 0; i < flows.length; i += 1) {
    for (let j = i + 1; j < flows.length; j += 1) {
      const first = flows[i];
      const second = flows[j];
      const firstPoints = routesById.get(first.id) || [];
      const secondPoints = routesById.get(second.id) || [];
      const firstEnd = firstPoints.at(-1);
      const secondEnd = secondPoints.at(-1);
      if (firstEnd?.x === secondEnd?.x && firstEnd?.y === secondEnd?.y) {
        issues.push(issue("error", "flow.shared_arrowhead", `Shares a target arrowhead with ${second.id}; assign distinct target_offset values.`, first.id));
      }
      let relation = null;
      for (let a = 1; a < firstPoints.length && !relation; a += 1) {
        const p1 = firstPoints[a - 1];
        const p2 = firstPoints[a];
        for (let b = 1; b < secondPoints.length; b += 1) {
          const q1 = secondPoints[b - 1];
          const q2 = secondPoints[b];
          relation = segmentRelation(p1, p2, q1, q2);
          if (relation) break;
        }
      }
      if (!relation) continue;
      if (relation.type === "overlap") {
        const reverse = first.source === second.target && first.target === second.source;
        issues.push(issue("error", reverse ? "flow.reverse_overlap" : "flow.segment_overlap", `Route shares ${Math.round(relation.length)}px with ${second.id}; use distinct lanes or an explicit junction.`, first.id));
      } else if (relation.type === "corridor") {
        issues.push(issue("error", "flow.ambiguous_corridor", `Route runs ${relation.gap}px from ${second.id}; keep parallel lanes at least 10px apart.`, first.id));
      } else {
        issues.push(issue("error", "flow.crossing", `Route crosses ${second.id} at (${relation.point.x}, ${relation.point.y}); adjust via coordinates.`, first.id));
      }
    }
  }

  const coveredEntities = new Set(chapters.flatMap((chapter) => chapter.entities || []));
  const coveredFlows = new Set(chapters.flatMap((chapter) => chapter.flows || []));
  for (const entity of entities) if (!coveredEntities.has(entity.id)) issues.push(issue("error", "chapter.entity_uncovered", "Entity is not activated by any chapter.", entity.id));
  for (const flow of flows) if (!coveredFlows.has(flow.id)) issues.push(issue("error", "chapter.flow_uncovered", "Flow is not activated by any chapter.", flow.id));
  for (const chapter of chapters) {
    for (const id of chapter.entities || []) if (!entityById.has(id)) issues.push(issue("error", "chapter.entity_unknown", `Chapter references unknown entity: ${id}`, chapter.id));
    for (const id of chapter.flows || []) if (!flows.some((flow) => flow.id === id)) issues.push(issue("error", "chapter.flow_unknown", `Chapter references unknown flow: ${id}`, chapter.id));
  }
  return issues;
}

function iconFor(kind, x, y) {
  const label = ({ source: "IN", process: "FX", store: "DB", view: "VW", interface: "API", control: "OK" })[kind] || "●";
  return `<g class="afh-icon" transform="translate(${x} ${y})"><rect width="27" height="27" rx="8"/><text x="13.5" y="17.5" text-anchor="middle">${label}</text></g>`;
}

function textLines(lines, x, y, className, lineHeight) {
  return lines.map((line, index) => `<text class="${className}" x="${x}" y="${y + index * lineHeight}">${escapeXml(line)}</text>`).join("");
}

export function renderSvg(manifest) {
  const entities = manifest.entities || [];
  const entityById = new Map(entities.map((entity) => [entity.id, entity]));
  const zones = (manifest.zones || []).map((zone) => {
    const r = zone.frame;
    return `<g id="${slug(zone.id)}" class="afh-zone" data-af-zone="${escapeXml(zone.id)}" data-af-tone="${escapeXml(zone.tone || "neutral")}"><rect class="afh-zone-frame" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="24"/><text class="afh-zone-title" x="${r.x + 22}" y="${r.y + 31}">${escapeXml(zone.title)}</text></g>`;
  }).join("");
  const flows = (manifest.flows || []).map((flow) => {
    const points = routeFlow(flow, entityById);
    const d = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
    const label = labelPosition(flow, points);
    const labelSvg = label ? `<text class="afh-flow-label" x="${label.x}" y="${label.y}" text-anchor="${label.anchor}">${escapeXml(flow.label)}</text>` : "";
    return `<g id="${slug(flow.id)}" class="afh-flow" data-af-flow="${escapeXml(flow.id)}" data-af-kind="${escapeXml(flow.kind || "data")}"><path class="afh-flow-halo" d="${d}"/><path class="afh-flow-path" d="${d}" marker-end="url(#afh-arrow)"/>${labelSvg}</g>`;
  }).join("");
  const entitySvg = entities.map((entity) => {
    const r = entity.frame;
    const title = wrapText(entity.title, Math.max(8, Math.floor((r.w - 50) / 7)), 2).lines;
    const caption = wrapText(entity.caption, Math.max(10, Math.floor((r.w - 24) / 5.6)), 2).lines;
    const titleY = r.y + 26;
    const captionY = titleY + title.length * 15 + 9;
    const tag = entity.tag ? `<text class="afh-tag" x="${r.x + r.w - 7}" y="${r.y - 7}" text-anchor="end">${escapeXml(entity.tag)}</text>` : "";
    return `<g id="${slug(entity.id)}" class="afh-entity" data-af-entity="${escapeXml(entity.id)}" data-af-kind="${escapeXml(entity.kind || "process")}"><rect class="afh-entity-shadow" x="${r.x + 2}" y="${r.y + 5}" width="${r.w}" height="${r.h}" rx="16"/><rect class="afh-entity-frame" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="16"/>${iconFor(entity.kind, r.x + 13, r.y + 13)}${tag}${textLines(title, r.x + 50, titleY, "afh-entity-title", 15)}${textLines(caption, r.x + 14, captionY, "afh-entity-caption", 13)}</g>`;
  }).join("");
  const title = escapeXml(manifest.project?.title || "Architecture flow");
  const description = escapeXml(manifest.project?.subtitle || "Connected architecture diagram");
  const chapters = escapeXml(JSON.stringify(manifest.chapters || []));
  return `<svg class="archflow-hero" data-archflow-hero="1" viewBox="0 0 ${manifest.canvas.width} ${manifest.canvas.height}" role="img" aria-labelledby="afh-title afh-description" xmlns="http://www.w3.org/2000/svg"><title id="afh-title">${title}</title><desc id="afh-description">${description}</desc><metadata id="afh-chapters">${chapters}</metadata><defs><marker id="afh-arrow" markerUnits="userSpaceOnUse" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker><filter id="afh-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter></defs><style>.archflow-hero{width:100%;height:auto;display:block;overflow:visible}.afh-zone{opacity:.76;transition:opacity .35s ease}.afh-zone-frame{fill:var(--afh-zone-fill,#121b2f);stroke:var(--afh-zone-stroke,#2b3a59);stroke-width:1}.afh-zone-title{fill:var(--afh-muted,#8290aa);font:600 11px var(--afh-mono,ui-monospace,monospace);letter-spacing:.12em;text-transform:uppercase}.afh-entity{opacity:.46;transition:opacity .3s ease,filter .3s ease}.afh-entity-shadow{fill:var(--afh-shadow,#050810);opacity:.44;filter:url(#afh-soft)}.afh-entity-frame{fill:var(--afh-card,#172137);stroke:var(--afh-line,#33425f);stroke-width:1.2;transition:stroke .3s ease,fill .3s ease}.afh-icon rect{fill:var(--afh-icon,#24334f)}.afh-icon text{fill:var(--afh-accent,#5eead4);font:700 8px var(--afh-mono,ui-monospace,monospace);letter-spacing:.05em}.afh-entity-title{fill:var(--afh-ink,#edf4ff);font:650 12px var(--afh-body,system-ui,sans-serif)}.afh-entity-caption{fill:var(--afh-muted,#95a4bd);font:500 9.5px var(--afh-body,system-ui,sans-serif)}.afh-tag{paint-order:stroke;stroke:var(--afh-bg,#08101f);stroke-width:5;stroke-linejoin:round;fill:var(--afh-accent-2,#f4b860);font:700 8px var(--afh-mono,ui-monospace,monospace);letter-spacing:.08em}.afh-flow{opacity:.22;transition:opacity .3s ease}.afh-flow-halo{fill:none;stroke:var(--afh-bg,#08101f);stroke-width:7;stroke-linejoin:round}.afh-flow-path{fill:none;stroke:var(--afh-edge,#6d7f9f);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.afh-flow-label{paint-order:stroke;stroke:var(--afh-bg,#08101f);stroke-width:7;stroke-linejoin:round;fill:var(--afh-muted,#95a4bd);font:650 8.5px var(--afh-mono,ui-monospace,monospace);letter-spacing:.04em}.afh-entity.is-active{opacity:1}.afh-entity.is-active .afh-entity-frame{stroke:var(--afh-accent,#5eead4);fill:var(--afh-card-active,#1b2a42)}.afh-flow.is-active{opacity:1}.afh-flow.is-active .afh-flow-path{stroke:var(--afh-accent,#5eead4);stroke-width:2.5}.afh-zone.is-active{opacity:1}.afh-zone.is-active .afh-zone-frame{stroke:var(--afh-accent,#5eead4);stroke-opacity:.5}@media(prefers-reduced-motion:reduce){.afh-zone,.afh-entity,.afh-flow{transition:none}}</style>${zones}${flows}${entitySvg}</svg>`;
}

export function validateArtifact(contents, manifest) {
  const issues = [];
  const heroCount = (contents.match(/<svg\b[^>]*data-archflow-hero="1"/g) || []).length;
  if (heroCount !== 1) issues.push(issue("error", "artifact.hero_count", `Expected one hero SVG, found ${heroCount}.`));
  for (const entity of manifest.entities || []) if (!contents.includes(`data-af-entity="${entity.id}"`)) issues.push(issue("error", "artifact.entity_missing", `Rendered entity is missing: ${entity.id}`));
  for (const flow of manifest.flows || []) if (!contents.includes(`data-af-flow="${flow.id}"`)) issues.push(issue("error", "artifact.flow_missing", `Rendered flow is missing: ${flow.id}`));
  const isHtml = /<html[\s>]/i.test(contents);
  if (isHtml) {
    const checks = [
      [/@media\s+print/, "artifact.print", "HTML report needs print CSS."],
      [/beforeprint/, "artifact.beforeprint", "HTML report needs a beforeprint composite state."],
      [/prefers-reduced-motion/, "artifact.reduced_motion", "HTML report must respect reduced motion."],
      [/localStorage/, "artifact.theme_persistence", "HTML report must persist theme choice."],
    ];
    for (const [pattern, code, message] of checks) if (!pattern.test(contents)) issues.push(issue("error", code, message));
  }
  return issues;
}

async function atomicWrite(filename, contents) {
  await fs.mkdir(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(temporary, contents, "utf8");
  await fs.rename(temporary, filename);
}

function parseArgs(argv) {
  const positional = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--json") options.json = true;
    else if (token.startsWith("--")) options[token.slice(2).replaceAll("-", "_")] = argv[++index];
    else positional.push(token);
  }
  return { positional, options };
}

function usage() {
  return `Archflow hero diagram\n\n  validate <manifest.json> [--repo-root PATH] [--artifact FILE] [--json]\n  inspect  <manifest.json> [--repo-root PATH] [--json]\n  render   <manifest.json> <output.svg|output.html> [--template FILE] [--repo-root PATH] [--json]`;
}

async function loadManifest(filename) {
  const source = await fs.readFile(filename, "utf8");
  return { source, manifest: JSON.parse(source) };
}

async function runCli(argv) {
  const { positional, options } = parseArgs(argv);
  const [command, manifestFile, outputFile] = positional;
  if (!command || !manifestFile || !["validate", "inspect", "render"].includes(command) || (command === "render" && !outputFile)) {
    console.error(usage());
    return 2;
  }
  const { source, manifest } = await loadManifest(path.resolve(manifestFile));
  let issues = await validateManifest(manifest, { repoRoot: options.repo_root && path.resolve(options.repo_root) });
  let artifactContents = null;
  let artifactPath = options.artifact && path.resolve(options.artifact);
  if (command === "render" && !issues.some((entry) => entry.severity === "error")) {
    const svg = renderSvg(manifest);
    artifactPath = path.resolve(outputFile);
    if (options.template) {
      const template = await fs.readFile(path.resolve(options.template), "utf8");
      if ((template.match(new RegExp(ARTIFACT_TOKEN, "g")) || []).length !== 1) {
        issues.push(issue("error", "template.token", `Template must contain exactly one ${ARTIFACT_TOKEN} token.`));
      } else artifactContents = template.replace(ARTIFACT_TOKEN, svg);
    } else artifactContents = svg;
    if (artifactContents) issues = [...issues, ...validateArtifact(artifactContents, manifest)];
    if (!issues.some((entry) => entry.severity === "error") && artifactContents) await atomicWrite(artifactPath, artifactContents);
  } else if (artifactPath) {
    artifactContents = await fs.readFile(artifactPath, "utf8");
    issues = [...issues, ...validateArtifact(artifactContents, manifest)];
  }
  const receipt = {
    command,
    valid: !issues.some((entry) => entry.severity === "error"),
    manifest: path.resolve(manifestFile),
    artifact: artifactPath || null,
    input_sha256: sha256(source),
    artifact_sha256: artifactContents ? sha256(artifactContents) : null,
    counts: { zones: manifest.zones?.length || 0, entities: manifest.entities?.length || 0, flows: manifest.flows?.length || 0, chapters: manifest.chapters?.length || 0 },
    issues,
  };
  if (command === "inspect") receipt.routes = Object.fromEntries((manifest.flows || []).map((flow) => [flow.id, routeFlow(flow, new Map((manifest.entities || []).map((entity) => [entity.id, entity])))]));
  if (options.json || command === "inspect") console.log(JSON.stringify(receipt, null, 2));
  else {
    console.log(`${receipt.valid ? "PASS" : "FAIL"} ${receipt.counts.entities} entities · ${receipt.counts.flows} flows · ${issues.length} issues`);
    for (const entry of issues) console.log(`${entry.severity.toUpperCase()} ${entry.code}${entry.subject ? ` [${entry.subject}]` : ""}: ${entry.message}`);
  }
  return receipt.valid ? 0 : 1;
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) runCli(process.argv.slice(2)).then((code) => { process.exitCode = code; }).catch((error) => { console.error(error.stack || error.message); process.exitCode = 2; });
