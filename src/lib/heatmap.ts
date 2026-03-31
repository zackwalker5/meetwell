export type HeatmapData = Record<string, string[]>; // slot -> [respondent names]

export interface ResponseRow {
  id: string;
  name: string;
  slots: string[];
}

export function computeHeatmap(responses: ResponseRow[]): HeatmapData {
  const map: HeatmapData = {};
  responses.forEach((r) => {
    r.slots.forEach((slot) => {
      if (!map[slot]) map[slot] = [];
      map[slot].push(r.name);
    });
  });
  return map;
}

export function getBestTimes(
  heatmap: HeatmapData,
  topN = 3
): Array<{ slot: string; names: string[] }> {
  return Object.entries(heatmap)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, topN)
    .map(([slot, names]) => ({ slot, names }));
}
