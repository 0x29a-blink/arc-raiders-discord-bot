import type { MapRotation } from "../types";

// Map condition emojis and colors
export const CONDITION_EMOJIS: { [key: string]: string } = {
  Harvester: "🤖",
  Night: "🌙",
  Husks: "💀",
  Blooms: "🌸",
  Storm: "⛈️",
  Caches: "📦",
  Probes: "🛸",
  Tower: "🗼",
  Bunker: "🏰",
  Matriarch: "👑",
  None: "✅",
};

export const CONDITION_COLORS: { [key: string]: number } = {
  Harvester: 0xff6b35, // Orange-red
  Night: 0x2c3e50, // Dark blue
  Husks: 0x8b0000, // Dark red
  Blooms: 0xff69b4, // Pink
  Storm: 0x4a5568, // Gray-blue
  Caches: 0xffd700, // Gold
  Probes: 0x9370db, // Purple
  Tower: 0x708090, // Slate gray
  Bunker: 0x654321, // Brown
  Matriarch: 0xffd700, // Gold
  None: 0x2ecc71, // Green
};

// 24-hour map rotation schedule (UTC)
export const MAP_ROTATIONS: MapRotation[] = [
  {
    hour: 0,
    damMinor: "Matriarch",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "Night",
    spaceportMinor: "Harvester",
    spaceportMajor: "None",
    blueGateMinor: "None",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 1,
    damMinor: "None",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "Night",
    blueGateMinor: "None",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 2,
    damMinor: "None",
    damMajor: "Night",
    buriedCityMinor: "Caches",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "None",
    blueGateMinor: "Husks",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
  {
    hour: 3,
    damMinor: "Blooms",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "Night",
    spaceportMinor: "Matriarch",
    spaceportMajor: "None",
    blueGateMinor: "None",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 4,
    damMinor: "None",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "Storm",
    blueGateMinor: "None",
    blueGateMajor: "Night",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 5,
    damMinor: "None",
    damMajor: "Storm",
    buriedCityMinor: "Husks",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "None",
    blueGateMinor: "Harvester",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
  {
    hour: 6,
    damMinor: "Probes",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "Night",
    spaceportMinor: "Tower",
    spaceportMajor: "None",
    blueGateMinor: "None",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 7,
    damMinor: "None",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "Night",
    blueGateMinor: "None",
    blueGateMajor: "Storm",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 8,
    damMinor: "None",
    damMajor: "Night",
    buriedCityMinor: "Blooms",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "None",
    blueGateMinor: "Probes",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
  {
    hour: 9,
    damMinor: "Harvester",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "Night",
    spaceportMinor: "Probes",
    spaceportMajor: "None",
    blueGateMinor: "Blooms",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 10,
    damMinor: "Husks",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "Bunker",
    blueGateMinor: "None",
    blueGateMajor: "Night",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 11,
    damMinor: "None",
    damMajor: "Storm",
    buriedCityMinor: "Probes",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "None",
    blueGateMinor: "Matriarch",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
  {
    hour: 12,
    damMinor: "None",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "Night",
    spaceportMinor: "Blooms",
    spaceportMajor: "None",
    blueGateMinor: "None",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 13,
    damMinor: "Probes",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "Night",
    blueGateMinor: "None",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
  {
    hour: 14,
    damMinor: "None",
    damMajor: "Night",
    buriedCityMinor: "Husks",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "None",
    blueGateMinor: "Caches",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 15,
    damMinor: "None",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "Night",
    spaceportMinor: "Caches",
    spaceportMajor: "None",
    blueGateMinor: "None",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
  {
    hour: 16,
    damMinor: "Harvester",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "Storm",
    blueGateMinor: "None",
    blueGateMajor: "Storm",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 17,
    damMinor: "Blooms",
    damMajor: "Storm",
    buriedCityMinor: "Blooms",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "None",
    blueGateMinor: "Harvester",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
  {
    hour: 18,
    damMinor: "None",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "Night",
    spaceportMinor: "Harvester",
    spaceportMajor: "None",
    blueGateMinor: "Husks",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 19,
    damMinor: "None",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "Bunker",
    blueGateMinor: "None",
    blueGateMajor: "Night",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 20,
    damMinor: "Matriarch",
    damMajor: "Night",
    buriedCityMinor: "Caches",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "None",
    blueGateMinor: "Blooms",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
  {
    hour: 21,
    damMinor: "None",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "Night",
    spaceportMinor: "Matriarch",
    spaceportMajor: "None",
    blueGateMinor: "None",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "None",
  },
  {
    hour: 22,
    damMinor: "None",
    damMajor: "None",
    buriedCityMinor: "None",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "Night",
    blueGateMinor: "None",
    blueGateMajor: "Storm",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
  {
    hour: 23,
    damMinor: "Caches",
    damMajor: "Storm",
    buriedCityMinor: "Probes",
    buriedCityMajor: "None",
    spaceportMinor: "None",
    spaceportMajor: "None",
    blueGateMinor: "Matriarch",
    blueGateMajor: "None",
    stellaMontisMinor: "None",
    stellaMontisMajor: "Night",
  },
];

/**
 * Get the current map rotation based on UTC time
 */
export function getCurrentRotation(): MapRotation {
  const now = new Date();
  const currentHour = now.getUTCHours();
  return MAP_ROTATIONS[currentHour];
}

/**
 * Get the next map rotation
 */
export function getNextRotation(): MapRotation {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const nextHour = (currentHour + 1) % 24;
  return MAP_ROTATIONS[nextHour];
}

/**
 * Get the timestamp for the next rotation change (top of next hour)
 */
export function getNextRotationTimestamp(): number {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setUTCHours(now.getUTCHours() + 1, 0, 0, 0);
  return Math.floor(nextHour.getTime() / 1000);
}

/**
 * Format a map condition with its emoji
 */
export function formatCondition(condition: string): string {
  const emoji = CONDITION_EMOJIS[condition] || "❓";
  return `${emoji} ${condition}`;
}
