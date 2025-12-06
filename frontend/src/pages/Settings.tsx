import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/react";

const STORAGE_KEY = "nutrientVisibility";

type Visibility = Record<string, boolean>;

const NUTRIENTS = [
  { key: "calories", label: "Calories" },
  { key: "protein", label: "Protein" },
  { key: "carbs", label: "Carbs" },
  { key: "fat", label: "Fat" },
  { key: "fiber", label: "Fiber" },
  { key: "sodium", label: "Sodium" },
  { key: "sugars", label: "Sugars" },
];

// default nutrient visibility, set to true
const DEFAULT_VISIBILITY = {
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  fiber: true,
  sodium: true,
  sugars: true,
};

function loadInitialVisibility() {
  if (typeof window === "undefined") return DEFAULT_VISIBILITY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_VISIBILITY, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load nutrient visibility", e);
  }
  return DEFAULT_VISIBILITY;
}

export default function Settings() {
  const [visibleNutrients, setVisibleNutrients] = useState(() =>
    loadInitialVisibility()
  );
  const [saved, setSaved] = useState(false);

  const toggleNutrient = (key: string) => {
    setVisibleNutrients((prev: Visibility) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const selectAll = () => {
    const updated: Visibility = {};
    NUTRIENTS.forEach((n) => (updated[n.key] = true));
    setVisibleNutrients(updated);
    setSaved(false);
  };

  const clearAll = () => {
    const updated: Visibility = {};
    NUTRIENTS.forEach((n) => (updated[n.key] = false));
    setVisibleNutrients(updated);
    setSaved(false);
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(visibleNutrients)
      );
    }
    setSaved(true);
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto py-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-default-500">
          Choose which nutrients you want to see across your entries and graphs.
        </p>

        <div className="flex gap-3">
          <Button size="sm" variant="flat" onClick={selectAll}>
            Select All
          </Button>
          <Button size="sm" variant="flat" onClick={clearAll}>
            Hide All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NUTRIENTS.map((nutrient) => (
            <label
              key={nutrient.key}
              className="flex items-center gap-2 border border-default-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-default-50"
            >
              <input
                type="checkbox"
                checked={!!visibleNutrients[nutrient.key]}
                onChange={() => toggleNutrient(nutrient.key)}
              />
              <span>{nutrient.label}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm text-emerald-400">Preferences saved</span>
          )}
          <Button color="primary" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
