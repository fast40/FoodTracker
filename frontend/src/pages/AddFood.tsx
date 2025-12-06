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
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { FoodLogEntry, NutrientID } from "@/types";
import { api } from "@/services/api";
import { NUTRIENT_DEFINITIONS, STORAGE_KEY, DEFAULT_VISIBILITY } from "@/data";

// button component from heroui
import {
  Button,
  Input,
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";

// default visibility if localstorage is empty or broken
// same structure as in your other files: all on by default

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
  const { user } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // name of the food item the user is typing
  const [name, setName] = useState("");

  // number of servings the user ate (string)
  const [servings, setServings] = useState("1");

  // serving size details from scan
  const [servingSize, setServingSize] = useState<number | null>(null);
  const [servingSizeUnit, setServingSizeUnit] = useState<string | null>(null);

  // nutrient values for each field above (string)
  const [nutrients, setNutrients] = useState(() =>
    Object.fromEntries(NUTRIENT_DEFINITIONS.map((f) => [f.dataKey, ""]))
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

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

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
      setServingSize(data.servingSize || null);
      setServingSizeUnit(data.servingSizeUnit || null);

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
  const visibleFields = NUTRIENT_DEFINITIONS.filter((field) => {
    const logicalKey = field.settingsKey;
    if (!logicalKey) return true; // if mapping missing, show it rather than hiding

    const flag = visibility[logicalKey as keyof typeof visibility];
    // follow same behavior as graphs: undefined means "on"
    return flag === undefined ? true : !!flag;
  });

  // handle form submit --> save food button
  async function handleSubmit(e: FormEvent) {
    // stop the browser from reloading the page and losing progress
    e.preventDefault();

    if (!user) {
      onOpen();
      return;
    }

    setError(null);
    setSaving(true);

    // 2. build the payload using the Unified FoodLogEntry structure
    const payload: FoodLogEntry = {
      quantity: parseFloat(servings) || 1,
      mealType: "snack", // TODO: Add meal selector to UI
      logDate: new Date().toISOString(), // TODO: Add date selector to UI
      food: {
        description: name,
        servingSize: servingSize || 1,
        servingSizeUnit: servingSizeUnit || "serving",
        nutrients: NUTRIENT_DEFINITIONS.map((field) => ({
          nutrientId: field.id,
          amount:
            parseFloat(nutrients[field.dataKey as keyof typeof nutrients]) || 0,
        })).filter((n) => n.amount > 0),
      },
    };

    try {
      await api.food.log(payload);

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
          <h1 className="text-2xl font-semibold">Add Food</h1>
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
          <p className="text-danger mb-8 mt-[-10px] text-sm">Error Saving Food! {error}</p>
        )}

        {/* main form */}
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-5">
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
          <div style={{width: "100%"}}>
            <span className="text-sm font-medium">
              Servings
            </span>
            <Input
              type="number"
              min="0"
              step="any"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>

          {/* nutrient inputs laid out in a responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {visibleFields.map((field) => (
              <div>
                <span className="text-sm font-medium">
                  {field.label} ({field.unit})
                </span>
                <Input
                  key={field.dataKey}
                  type="number"
                  min="0"
                  step="any"
                  value={nutrients[field.dataKey]}
                  onChange={(e) =>
                    handleNutrientChange(field.dataKey, e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          {/* buttons row: cancel + save */}
          <div className="flex justify-end gap-3 mt-4">
            {/* cancel just goes back to the dashboard without saving */}
            <Button
              variant="bordered"
              onPress={() => navigate(user ? "/dashboard" : "/")}
              disabled={saving}
            >
              Cancel
            </Button>

            {/* submit triggers handleSubmit() above */}
            <Button
              color="primary"
              className="text-white"
              type="submit"
              isDisabled={saving}
            >
              {saving ? "saving…" : "Save Food"}
            </Button>
          </div>
        </Form>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {authMode === "login" ? "Login" : "Register"}
                </ModalHeader>
                <ModalBody>
                  {authMode === "login" ? (
                    <LoginForm onSuccess={onClose} />
                  ) : (
                    <RegisterForm onSuccess={onClose} />
                  )}
                  <div className="flex justify-center mt-2">
                    <Button
                      variant="light"
                      onPress={() =>
                        setAuthMode(authMode === "login" ? "register" : "login")
                      }
                    >
                      {authMode === "login"
                        ? "Need an account? Register"
                        : "Have an account? Login"}
                    </Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </section>
    </DefaultLayout>
  );
}
