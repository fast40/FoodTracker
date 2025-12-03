//AddFood.jsx will:
//	1) show a form (name, serving, nutrients)
//	2) when user click "save food" it will buils a JSON object
//	3) send this JSON to the backend at http://localhost:8080/FoodTracker/api/log-item w/ POST request
//	4) if the request works --> go back to dashboard (/FoodTracker)
//	5) else show an error message


//import same layout wrapper as the dashboard
import DefaultLayout from "@/layouts/default";

//React hooks for local state + navigation
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//button component from HeroUI 
import { Button } from "@heroui/button";

//units map so user can label the inputs with (g, mg, kcal…)
import { UNITS } from "@/data";


//nutrients the user can type in on this form (should be the same in all files):
const NUTRIENT_FIELDS = 
[
  { key: "energy_kcal", label: "Calories" },
  { key: "protein_g", label: "Protein" },
  { key: "carbs_g", label: "Carbs" },
  { key: "fat_g", label: "Fat" },
  { key: "fiber_g", label: "Fiber" },
  { key: "sodium_mg", label: "Sodium" },
  { key: "sugars_g", label: "Sugars" },
];

//base URL for your Tomcat backend
const API_BASE = "http://localhost:8080/FoodTracker";


export default function AddFood() 
{
  //need a variable to navigate
  const navigate = useNavigate();

  //name of the food item the user is typing
  const [name, setName] = useState("");

  //number of servings the user ate (string)
  const [servings, setServings] = useState("1");

  //nutrient values for each field above (string)
  const [nutrients, setNutrients] = useState(() =>
    Object.fromEntries(NUTRIENT_FIELDS.map((f) => [f.key, ""]))
  );

  //flags status for UX:
  //TRUE while the request is in flight
  const [saving, setSaving] = useState(false); 
  //ERROR message if something went wrong
  const [error, setError] = useState(null); 
  
  
  //helper: update one nutrient field in state
  function handleNutrientChange(key, value) {
    setNutrients((prev) => ({ ...prev, [key]: value }));
  }

  //handle form submit --> Save Food button
  async function handleSubmit(e) {
	//stop the browser from reloading the page and loosing progress
    e.preventDefault(); 
    setError(null);
    setSaving(true);

    try {
      //build the payload that we will send to the backend
      const payload = {
        name,
        servings: Number(servings) || 1,
        nutrients: {},
      };

      //copy only numeric nutrient values into payload.nutrients
      for (const field of NUTRIENT_FIELDS) {
        const raw = nutrients[field.key];
        if (raw !== "" && !isNaN(Number(raw))) 
		{
          payload.nutrients[field.key] = Number(raw);
        }
      }

      //make a POST request to /api/log-item servlet
      //On the backend --> need to add a doPost that reads JSON from the request body and saves it in the database.
      const res = await fetch(`${API_BASE}/api/log-item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      //if HTTP status is not 2xx, then treat it as an error
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      //If success, go back to the dashboard so the user can see the updated charts (after the backend reads from DB).
      navigate("/dashboard");
    } catch (err) {
      //show a readable error message on the page
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  //JSX 
  return (
    <DefaultLayout>
      <section style={{ maxWidth: 640, margin: "2rem auto" }}>
        {/* Page title */}
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          Add Food
        </h1>

        {/* Error message */}
        {error && (
          <p
            style={{
              color: "red",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            Error saving food: {error}
          </p>
        )}

        {/* Main form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Food name input */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <label style={{ fontWeight: 500 }}>Food name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chicken salad"
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
              }}
            />
          </div>

          {/* Servings input */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <label style={{ fontWeight: 500 }}>Servings</label>
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

          {/* Nutrient inputs laid out in a responsive grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {NUTRIENT_FIELDS.map((field) => (
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

          {/* Buttons row: Cancel + Save */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            {/* Cancel just goes back to the dashboard without saving */}
            <Button
              variant="bordered"
              onPress={() => navigate("/dashboard")}
              disabled={saving}
            >
              Cancel
            </Button>

            {/* Submit triggers handleSubmit() above */}
            <Button color="primary" style={{ color: "white" }} type="submit" isDisabled={saving}>
              {saving ? "Saving…" : "Save Food"}
            </Button>
          </div>
        </form>
      </section>
    </DefaultLayout>
  );
}
