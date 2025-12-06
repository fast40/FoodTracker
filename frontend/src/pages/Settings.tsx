import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/react";
import { NUTRIENT_DEFINITIONS, STORAGE_KEY, DEFAULT_VISIBILITY } from "@/data";

type Visibility = Record<string, boolean>;

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
    NUTRIENT_DEFINITIONS.forEach((n) => (updated[n.settingsKey] = true));
    setVisibleNutrients(updated);
    setSaved(false);
  };

  const clearAll = () => {
    const updated: Visibility = {};
    NUTRIENT_DEFINITIONS.forEach((n) => (updated[n.settingsKey] = false));
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
          {NUTRIENT_DEFINITIONS.map((n) => (
            <div
              key={n.settingsKey}
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-default-100"
              onClick={() => toggleNutrient(n.settingsKey)}
            >
              <span>{n.label}</span>
              <div
                className={`w-5 h-5 rounded-full border ${
                  visibleNutrients[n.settingsKey]
                    ? "bg-primary border-primary"
                    : "border-default-400"
                }`}
              >
                {visibleNutrients[n.settingsKey] && (
                  <svg
                    className="w-full h-full text-white p-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
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
