import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Switch,
  Divider,
} from "@heroui/react";
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
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto py-6">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-start px-6 pt-6 pb-0">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-small text-default-500 mt-1">
              Choose which nutrients you want to see across your entries and
              graphs.
            </p>
          </CardHeader>

          <CardBody className="px-6 py-6 gap-6">
            <div className="flex gap-3">
              <Button size="sm" variant="flat" onPress={selectAll}>
                Select All
              </Button>
              <Button size="sm" variant="flat" onPress={clearAll}>
                Hide All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {NUTRIENT_DEFINITIONS.map((n) => (
                <Switch
                  key={n.settingsKey}
                  isSelected={visibleNutrients[n.settingsKey]}
                  onValueChange={() => toggleNutrient(n.settingsKey)}
                >
                  {n.label}
                </Switch>
              ))}
            </div>
          </CardBody>

          <Divider />

          <CardFooter className="flex justify-end gap-4 px-6 py-4">
            {saved && (
              <span className="text-sm text-success animate-appearance-in">
                Preferences saved
              </span>
            )}
            <Button color="primary" onPress={handleSave}>
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
}
