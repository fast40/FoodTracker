//AddFood.jsx will:
// 1) show a form (name, serving, nutrients)
// 2) when user click "save food" it will build a json object
// 3) send this json to the backend at http://localhost:8080/FoodTracker/api/log-item w/ post request
// 4) if the request works --> go back to dashboard (/FoodTracker)
// 5) else show an error message

// import same layout wrapper as the dashboard
import DefaultLayout from "@/layouts/default";

// react hooks for local state + navigation
// NOTE: added useEffect so we can read settings from localstorage
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// button component from heroui
import { Button } from "@heroui/react";

// units map so user can label the inputs with (g, mg, kcal…)
import { UNITS } from "@/data";

// *** new: storage key is the same as the one used in history/daygraph/settings ***
const STORAGE_KEY = "nutrientVisibility";

// nutrients the user can type in on this form (should be the same in all files)
const NUTRIENT_FIELDS = [
  { key: "energy_kcal", label: "Calories" },
  { key: "protein_g", label: "Protein" },
  { key: "carbs_g", label: "Carbs" },
  { key: "fat_g", label: "Fat" },
  { key: "fiber_g", label: "Fiber" },
  { key: "sodium_mg", label: "Sodium" },
  { key: "sugars_g", label: "Sugars" },
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
  const [error, setError] = useState(null);

  // *** new: on mount, read the latest settings from localstorage ***
  useEffect(() => {
    const vis = loadVisibilityFromStorage();
    setVisibility(vis);
  }, []);

  // helper: update one nutrient field in state
  function handleNutrientChange(key, value) {
    setNutrients((prev) => ({ ...prev, [key]: value }));
  }

  // *** new: choose which nutrient fields to actually render based on settings ***
  // if a nutrient's logical key is turned off in settings, we hide that input
  const visibleFields = NUTRIENT_FIELDS.filter((field) => {
    const logicalKey = FIELD_TO_SETTINGS_KEY[field.key];
    if (!logicalKey) return true; // if mapping missing, show it rather than hiding

    const flag = visibility[logicalKey];
    // follow same behavior as graphs: undefined means "on"
    return flag === undefined ? true : !!flag;
  });

  // handle form submit --> save food button
  async function handleSubmit(e) {
    // stop the browser from reloading the page and losing progress
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // build the payload that we will send to the backend
      const payload = {
        name,
        servings: Number(servings) || 1,
        nutrients: {},
      };

      // copy only numeric nutrient values into payload.nutrients
      // note: we loop over all fields, not just visibleFields,
      // so settings affect the ui only, not the json structure
      for (const field of NUTRIENT_FIELDS) {
        const raw = nutrients[field.key];
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
      <section style={{ maxWidth: 640, margin: "2rem auto" }}>
        {/* page title */}
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          Add food
        </h1>

        {/* error message */}
        {error && (
          <p
            style={{
              color: "red",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            error saving food: {error}
          </p>
        )}

        {/* main form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* food name input */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <label style={{ fontWeight: 500 }}>food name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., chicken salad"
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
              }}
            />
          </div>

          {/* servings input */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <label style={{ fontWeight: 500 }}>servings</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
              }}
            />
          </div>

          {/* nutrient inputs laid out in a responsive grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {visibleFields.map((field) => (
              <div
                key={field.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <label style={{ fontSize: "0.9rem" }}>
                  {field.label} ({UNITS[field.key] || ""})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={nutrients[field.key]}
                  onChange={(e) =>
                    handleNutrientChange(field.key, e.target.value)
                  }
                  style={{
                    padding: "0.45rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            ))}
          </div>

          {/* buttons row: cancel + save */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
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
              style={{ color: "white" }}
              type="submit"
              isDisabled={saving}
            >
              {saving ? "saving…" : "save food"}
            </Button>
          </div>
        </form>
      </section>
    </DefaultLayout>
  );
}
