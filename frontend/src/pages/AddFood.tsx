//AddFood.jsx will:
// 1) show a form (name, serving, nutrients)
// 2) when user click "save food" it will build a json object
// 3) send this json to the backend at http://localhost:8080/FoodTracker/api/log-item w/ post request
// 4) if the request works --> go back to dashboard (/FoodTracker)
// 5) else show an error message

// import same layout wrapper as the dashboard
import DefaultLayout from "@/layouts/default";
import { PhotoScanView } from "@/components/photoScanView";

// react hooks for local state + navigation
// NOTE: added useEffect so we can read settings from localstorage
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// button component from heroui
import { Button, Input, Form } from "@heroui/react";

// *** new: storage key is the same as the one used in history/daygraph/settings ***
const STORAGE_KEY = "nutrientVisibility";

// nutrients the user can type in on this form (should be the same in all files)
const NUTRIENT_FIELDS = [
  { key: "energy_kcal", label: "Calories", unit: "kcal" },
  { key: "protein_g", label: "Protein", unit: "g" },
  { key: "carbs_g", label: "Carbs", unit: "g" },
  { key: "fat_g", label: "Fat", unit: "g" },
  { key: "fiber_g", label: "Fiber", unit: "g" },
  { key: "sodium_mg", label: "Sodium", unit: "mg" },
  { key: "sugars_g", label: "Sugars", unit: "g" },
];

// *** new: map between the nutrient keys and the logical keys used in settings ***
// settings object in localstorage uses keys like "calories", "protein", etc
const FIELD_TO_SETTINGS_KEY = {
  energy_kcal: "calories",
  protein_g: "protein",
  carbs_g: "carbs",
  fat_g: "fat",
  fiber_g: "fiber",
  sodium_mg: "sodium",
  sugars_g: "sugars",
};

// default visibility if localstorage is empty or broken
// same structure as in your other files: all on by default
const DEFAULT_VISIBILITY = {
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  fiber: true,
  sodium: true,
  sugars: true,
};

// base url for your tomcat backend
const API_BASE = "http://localhost:8080/food-tracker";

// *** new: small helper that reads the settings from localstorage ***
function loadVisibilityFromStorage() {
  if (typeof window === "undefined") return DEFAULT_VISIBILITY;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VISIBILITY;

    const parsed = JSON.parse(raw);
    // merge with defaults so missing keys are treated as "true"
    return { ...DEFAULT_VISIBILITY, ...parsed };
  } catch (e) {
    console.error("failed to load nutrientVisibility from localStorage", e);
    return DEFAULT_VISIBILITY;
  }
}

export default function AddFood() {
  // need a variable to navigate
  const navigate = useNavigate();

  // name of the food item the user is typing
  const [name, setName] = useState("");

  // number of servings the user ate (string)
  const [servings, setServings] = useState("1");

  // nutrient values for each field above (string)
  const [nutrients, setNutrients] = useState(() =>
    Object.fromEntries(NUTRIENT_FIELDS.map((f) => [f.key, ""]))
  );

  // *** new: visibility state for this page, loaded from localstorage ***
  const [visibility, setVisibility] = useState(DEFAULT_VISIBILITY);

  // flags status for ux:
  // true while the request is in flight
  const [saving, setSaving] = useState(false);
  // error message if something went wrong
  const [error, setError] = useState<string | null>(null);

  // toggle scanner visibility
  const [showScanner, setShowScanner] = useState(false);

  // *** new: on mount, read the latest settings from localstorage ***
  useEffect(() => {
    const vis = loadVisibilityFromStorage();
    setVisibility(vis);
  }, []);

  // handle barcode scan
  const handleCode = async (upc: string) => {
    console.log("Scanned UPC:", upc);
    try {
      const params = new URLSearchParams({ gtin: upc });
      const response = await fetch(
        `${API_BASE}/api/food-lookup?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();
      console.log("Food data:", data);

      // Populate form
      setName(data.description || "");

      // Map nutrients
      const newNutrients = { ...nutrients };

      const mapping: Record<string, string> = {
        Energy: "energy_kcal",
        Protein: "protein_g",
        "Carbohydrate, by difference": "carbs_g",
        "Total lipid (fat)": "fat_g",
        "Fiber, total dietary": "fiber_g",
        "Sodium, Na": "sodium_mg",
        "Sugars, total": "sugars_g",
      };

      if (data.nutrients) {
        data.nutrients.forEach((n: any) => {
          const key = mapping[n.name];
          if (key) {
            newNutrients[key] = String(n.amount);
          }
        });
      }

      setNutrients(newNutrients);
      setShowScanner(false); // Close scanner on success
    } catch (err: any) {
      console.log("ERROR fetching from /api/food-lookup: " + err.message);
      setError("Failed to fetch food data: " + err.message);
    }
  };

  // helper: update one nutrient field in state
  function handleNutrientChange(key: string, value: string) {
    setNutrients((prev) => ({ ...prev, [key]: value }));
  }

  // *** new: choose which nutrient fields to actually render based on settings ***
  // if a nutrient's logical key is turned off in settings, we hide that input
  const visibleFields = NUTRIENT_FIELDS.filter((field) => {
    const logicalKey =
      FIELD_TO_SETTINGS_KEY[field.key as keyof typeof FIELD_TO_SETTINGS_KEY];
    if (!logicalKey) return true; // if mapping missing, show it rather than hiding

    const flag = visibility[logicalKey as keyof typeof visibility];
    // follow same behavior as graphs: undefined means "on"
    return flag === undefined ? true : !!flag;
  });

  // handle form submit --> save food button
  async function handleSubmit(e: FormEvent) {
    // stop the browser from reloading the page and losing progress
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // build the payload that we will send to the backend
      const payload: any = {
        name,
        servings: Number(servings) || 1,
        nutrients: {},
      };

      // copy only numeric nutrient values into payload.nutrients
      // note: we loop over all fields, not just visibleFields,
      // so settings affect the ui only, not the json structure
      for (const field of NUTRIENT_FIELDS) {
        const raw = nutrients[field.key as keyof typeof nutrients];
        if (raw !== "" && !isNaN(Number(raw))) {
          payload.nutrients[field.key] = Number(raw);
        }
      }

      // make a post request to /api/log-item servlet
      // on the backend --> need to add a doPost that reads json from the request body and saves it in the database
      const res = await fetch(`${API_BASE}/api/log-item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      // if http status is not 2xx, then treat it as an error
      if (!res.ok) {
        throw new Error(`http ${res.status}`);
      }

      // if success, go back to the dashboard so the user can see the updated charts (after the backend reads from db)
      navigate("/dashboard");
    } catch (err) {
      // show a readable error message on the page
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  // jsx
  return (
    <DefaultLayout>
      <section className="max-w-2xl mx-auto my-8">
        {/* page title and scan button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Add food</h1>
          <Button
            size="sm"
            variant="flat"
            onPress={() => setShowScanner(!showScanner)}
          >
            {showScanner ? "Close Scanner" : "Scan Barcode"}
          </Button>
        </div>

        {/* scanner section */}
        {showScanner && (
          <div className="mb-6 p-4 border border-default-200 rounded-lg bg-content1">
            <PhotoScanView onCode={handleCode} />
          </div>
        )}

        {/* error message */}
        {error && (
          <p className="text-danger mb-4 text-sm">error saving food: {error}</p>
        )}

        {/* main form */}
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* food name input */}
          <Input
            label="Food Name"
            labelPlacement="outside"
            placeholder="e.g., chicken salad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isRequired
          />

          {/* servings input */}
          <Input
            label="Servings"
            labelPlacement="outside"
            type="number"
            min="0"
            step="any"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />

          {/* nutrient inputs laid out in a responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {visibleFields.map((field) => (
              <Input
                key={field.key}
                label={`${field.label} (${field.unit})`}
                labelPlacement="outside"
                type="number"
                min="0"
                step="any"
                value={nutrients[field.key]}
                onChange={(e) =>
                  handleNutrientChange(field.key, e.target.value)
                }
              />
            ))}
          </div>

          {/* buttons row: cancel + save */}
          <div className="flex justify-end gap-3 mt-4">
            {/* cancel just goes back to the dashboard without saving */}
            <Button
              variant="bordered"
              onPress={() => navigate("/dashboard")}
              disabled={saving}
            >
              cancel
            </Button>

            {/* submit triggers handleSubmit() above */}
            <Button
              color="primary"
              className="text-white"
              type="submit"
              isDisabled={saving}
            >
              {saving ? "saving…" : "save food"}
            </Button>
          </div>
        </Form>
      </section>
    </DefaultLayout>
  );
}
