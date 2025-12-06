import { NutrientID } from "./types";

export const STORAGE_KEY = "nutrientVisibility";

export interface NutrientDef {
  id: NutrientID;
  label: string;
  settingsKey: string; // logicalKey in History.tsx
  dataKey: string; // key in AddFood.tsx, dataKey in History.tsx
  unit: string;
  defaultDV: number;
}

export const NUTRIENT_DEFINITIONS: NutrientDef[] = [
  {
    id: NutrientID.Energy,
    label: "Calories",
    settingsKey: "calories",
    dataKey: "energy_kcal",
    unit: "kcal",
    defaultDV: 2000,
  },
  {
    id: NutrientID.Protein,
    label: "Protein",
    settingsKey: "protein",
    dataKey: "protein_g",
    unit: "g",
    defaultDV: 50,
  },
  {
    id: NutrientID.Carbs,
    label: "Carbs",
    settingsKey: "carbs",
    dataKey: "carbs_g",
    unit: "g",
    defaultDV: 275,
  },
  {
    id: NutrientID.Fat,
    label: "Fat",
    settingsKey: "fat",
    dataKey: "fat_g",
    unit: "g",
    defaultDV: 78,
  },
  {
    id: NutrientID.Fiber,
    label: "Fiber",
    settingsKey: "fiber",
    dataKey: "fiber_g",
    unit: "g",
    defaultDV: 28,
  },
  {
    id: NutrientID.Sodium,
    label: "Sodium",
    settingsKey: "sodium",
    dataKey: "sodium_mg",
    unit: "mg",
    defaultDV: 2300,
  },
  {
    id: NutrientID.Sugar,
    label: "Sugars",
    settingsKey: "sugars",
    dataKey: "sugars_g",
    unit: "g",
    defaultDV: 50,
  },
];

export const BASE_NUTRIENTS = NUTRIENT_DEFINITIONS.map((n) => ({
  id: n.id,
  label: n.label,
  settingsKey: n.settingsKey,
}));

export const DEFAULT_DV = NUTRIENT_DEFINITIONS.reduce(
  (acc, n) => ({ ...acc, [n.id]: n.defaultDV }),
  {} as Record<number, number>
);

export const UNITS = NUTRIENT_DEFINITIONS.reduce(
  (acc, n) => ({ ...acc, [n.id]: n.unit }),
  {} as Record<number, string>
);

export const DEFAULT_VISIBILITY = NUTRIENT_DEFINITIONS.reduce(
  (acc, n) => ({ ...acc, [n.settingsKey]: true }),
  {} as Record<string, boolean>
);

export const PALETTE = [
  "#7471b3ff",
  "#313d85ff",
  "#4e9cb1ff",
  "#6bd1a5ff",
  "#60a344ff",
  "#be916eff",
  "#7a4628ff",
];
