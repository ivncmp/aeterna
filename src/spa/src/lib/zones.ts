import type { MetabolicZone, ZoneInfo } from "@/types";

export const ZONE_CONFIG: Record<MetabolicZone, ZoneInfo> = {
  anabolic: {
    zone: "anabolic",
    label: "Anabolic",
    color: "#8ADE88",
    minHours: 0,
    maxHours: 4,
  },
  catabolic: {
    zone: "catabolic",
    label: "Catabolic",
    color: "#F8BF24",
    minHours: 4,
    maxHours: 12,
  },
  fat_burning: {
    zone: "fat_burning",
    label: "Fat Burning",
    color: "#F0932C",
    minHours: 12,
    maxHours: 18,
  },
  autophagy: {
    zone: "autophagy",
    label: "Autophagy",
    color: "#F87171",
    minHours: 18,
    maxHours: null,
  },
};

export const ZONE_ORDER: MetabolicZone[] = [
  "anabolic",
  "catabolic",
  "fat_burning",
  "autophagy",
];

export function getZone(elapsedHours: number): ZoneInfo {
  for (let i = ZONE_ORDER.length - 1; i >= 0; i--) {
    const zone = ZONE_CONFIG[ZONE_ORDER[i]];
    if (elapsedHours >= zone.minHours) return zone;
  }
  return ZONE_CONFIG.anabolic;
}

export function getNextZone(current: MetabolicZone): ZoneInfo | null {
  const idx = ZONE_ORDER.indexOf(current);
  if (idx === -1 || idx === ZONE_ORDER.length - 1) return null;
  return ZONE_CONFIG[ZONE_ORDER[idx + 1]];
}

export function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
