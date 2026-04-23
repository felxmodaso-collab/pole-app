export type ZoneId =
  | "entry"
  | "problem"
  | "artifact"
  | "mechanisms"
  | "test"
  | "pricing"
  | "faq"
  | "about";

export interface Zone {
  id: ZoneId;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const WORLD = { width: 4400, height: 2700 };

export const ZONES: Zone[] = [
  { id: "entry",      label: "Вход",         shortLabel: "Entry",      x: 1500, y: 1040, width: 380, height: 500 },
  { id: "problem",    label: "Проблема",     shortLabel: "Problem",    x:  520, y: 1200, width: 460, height: 640 },
  { id: "artifact",   label: "Сам продукт",  shortLabel: "Artifact",   x: 1020, y:  380, width: 840, height: 560 },
  { id: "mechanisms", label: "Три механики", shortLabel: "Mechanisms", x: 2120, y: 1200, width: 960, height: 520 },
  { id: "test",       label: "Кейс Марии",   shortLabel: "Case",       x: 2020, y:  180, width: 800, height: 380 },
  { id: "pricing",    label: "Цены",         shortLabel: "Pricing",    x: 2260, y: 1820, width: 980, height: 440 },
  { id: "faq",        label: "Вопросы",      shortLabel: "FAQ",        x: 3360, y: 1820, width: 720, height: 720 },
  { id: "about",      label: "Кто делает",   shortLabel: "Team",       x: 3000, y:  680, width: 420, height: 720 },
];

// Curated graph: every zone has 2–3 meaningful links to adjacent neighbours.
// Spec §2: "на hover проявляются тонкие constellation-линии к 2–3 связанным
// зонам." A fully connected graph creates visual noise at rest.
export const CONNECTIONS: [ZoneId, ZoneId][] = [
  ["entry",      "problem"],      // the narrative arc the user should walk
  ["entry",      "artifact"],
  ["problem",    "artifact"],     // diagnosis → product answer
  ["artifact",   "mechanisms"],   // product → how it holds up
  ["artifact",   "test"],         // product → proof case
  ["mechanisms", "test"],         // how → whom it worked for
  ["test",       "pricing"],      // proof → commit
  ["pricing",    "faq"],          // price raises questions → answered
  ["faq",        "about"],        // questions resolved → who stands behind
  ["about",      "artifact"],     // team ↔ product
  ["about",      "pricing"],      // team stands behind price
];

export function getZone(id: ZoneId): Zone {
  const z = ZONES.find((x) => x.id === id);
  if (!z) throw new Error(`Zone ${id} not found`);
  return z;
}

export function zoneCenter(zone: Zone) {
  return { x: zone.x + zone.width / 2, y: zone.y + zone.height / 2 };
}

export function getConnectionsFor(id: ZoneId): ZoneId[] {
  return CONNECTIONS.flatMap(([a, b]) =>
    a === id ? [b] : b === id ? [a] : []
  );
}
