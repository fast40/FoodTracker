import DefaultLayout from "@/layouts/default";
import { useEffect, useMemo, useState } from "react";
import { useTestData, useRangeData } from "@/hooks/dashboardData";
import { Button } from "@heroui/react";
import { BASE_NUTRIENTS } from "@/data";

const STORAGE_KEY = "nutrientVisibility";

//helper function --> add/bubtract days from a year-month-day string 
//                --> use this to calculate the date range for backend queries 
function addDays(start, n) 
{
  const d = new Date(start); 
  d.setDate(d.getDate() + n); 
  return d.toISOString();
}

//Nutrients: 
//logicalKey --> used in UI and visibility settings
//dataKey --> the key from backend data (energy_kcal, carbs_g, and more) 
//label --> UI label
//unit --> units for display
//id --> numeric nutrient ID from backend, using BASE_NUTRIENTS lookup
//
//this allows us to unify: backend naming, local naming, display
//need calories, protein, carbs, fat, fiber, sodium, sugars
const NUTRIENTS = [
  {
    logicalKey: "calories",
    dataKey: "energy_kcal",
    label: "Calories",
    unit: "kcal",
    id: BASE_NUTRIENTS.find((n) => n.settingsKey === "calories")?.id,
  },
  {
    logicalKey: "protein",
    dataKey: "protein_g",
    label: "Protein",
    unit: "g",
    id: BASE_NUTRIENTS.find((n) => n.settingsKey === "protein")?.id,
  },
  {
    logicalKey: "carbs",
    dataKey: "carbs_g",
    label: "Carbs",
    unit: "g",
    id: BASE_NUTRIENTS.find((n) => n.settingsKey === "carbs")?.id,
  },
  {
    logicalKey: "fat",
    dataKey: "fat_g",
    label: "Fat",
    unit: "g",
    id: BASE_NUTRIENTS.find((n) => n.settingsKey === "fat")?.id,
  },
  {
    logicalKey: "fiber",
    dataKey: "fiber_g",
    label: "Fiber",
    unit: "g",
    id: BASE_NUTRIENTS.find((n) => n.settingsKey === "fiber")?.id,
  },
  {
    logicalKey: "sodium",
    dataKey: "sodium_mg",
    label: "Sodium",
    unit: "mg",
    id: BASE_NUTRIENTS.find((n) => n.settingsKey === "sodium")?.id,
  },
  {
    logicalKey: "sugars",
    dataKey: "sugars_g",
    label: "Sugars",
    unit: "g",
    id: BASE_NUTRIENTS.find((n) => n.settingsKey === "sugars")?.id,
  },
];


//Top UI tabs for range selection (either all or the last 7 days)
const RANGE_OPTIONS = [
  { id: "all", label: "All history" },
  { id: "last7", label: "Last 7 days" },
];

//default on/off visibility for nutrients
const DEFAULT_VISIBILITY = {
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  fiber: true,
  sodium: true,
  sugars: true,
};

//daily values for computing %DV
//FDA Daily Recommended Values
const DAILY_VALUES = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fat: 78,
  fiber: 28,
  sodium: 2300,
  sugars: 50,
};


//create an empty object 
function createEmptyTotals() {
  const totals = {};
  NUTRIENTS.forEach((n) => {totals[n.dataKey] = 0;});
  return totals;
}

//compute the totals for a single day 
//then loop through each entry (food item) and multiply the values by the servings
function computeDayTotals(day) {
  //create an empty object with everything init to 0
  const totals = createEmptyTotals();

  //loop through every food entry for the given day
  (day.entries || []).forEach((entry) => {
    //get the number of servings for this food entry
    //if servings is missing, default to 1
    const servings = entry?.consumed?.servings ?? 1;

    //loop through every nutrient that are tracked (calories, protein, carbs, etc)
    NUTRIENTS.forEach((n) => {
      //pull the nutrient value for this food: ex: entry.nutrients["protein_g"]
      //if it's missing, default to 0
      const value = (entry?.nutrients?.[n.dataKey] || 0) * servings;
      totals[n.dataKey] += value;
    });
  });

  return totals;
}

//this function loops through each day, it also computes that day's total and then adds them to the daily total 
//compute the totals across many days 
function computeTotalsForDays(days) {
  const totals = createEmptyTotals();

  days.forEach((day) => {
    const dayTotals = computeDayTotals(day);
    NUTRIENTS.forEach((n) => {
      totals[n.dataKey] += dayTotals[n.dataKey] || 0;
    });
  });

  return totals;
}


//this is from the browser's localStorage 
//allows the UI to remember the user's preference even after reefreshinf or closing the page 
//if anything goes wrong 
//load visibily settings this allows the UI to remember the user's preference even
function loadVisibilityFromStorage() {
  //if window doesn't exist 
  //we cannot access localStorage, so return defaults
  if (typeof window === "undefined") return DEFAULT_VISIBILITY;

  //read the raw string stored under STORAGE_KEY.
  //example: '{"calories":true,"protein":false}'
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    //if nothing is stored yet, use default visibility settings
    if (!raw) return DEFAULT_VISIBILITY;

    //convert the JSON string back into an object
    //raw --> parsed object
    const parsed = JSON.parse(raw);

    //merge parsed values with defaults.
    //this ensures any missing keys get default values.
    return { ...DEFAULT_VISIBILITY, ...parsed };
  } catch (e) {
    //if JSON.parse fails or localStorage is corrupted,
    //catch the error, log it, and safely return defaults
    console.error("failed to load nutrientVisibility from localStorage", e);
    return DEFAULT_VISIBILITY;
  }
}

//compute %DV = amount / dailyValue * 100
function getDailyValuePercent(logicalKey, amount) {
  const dv = DAILY_VALUES[logicalKey];
  if (!dv || amount == null) return null;
  return (amount / dv) * 100;
}

//convert different timestamp shapes into a HH:MM label
function getEntryTimeLabel(entry) {
  const raw =
    entry?.consumed?.time ??
    entry?.consumed?.timestamp ??
    entry?.timestamp ??
    entry?.loggedAt ??
    null;

  if (!raw) return "";
  const date = new Date(raw);

  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return typeof raw === "string" ? raw : "";
}

//converts the backend format into the local UI format
function transformBackendDays(rawDays) {
  //if the response is not an array, safely return an empty list
  if (!Array.isArray(rawDays)) return [];

  //map each backend "day" object into a new transformed "day" object
  return rawDays.map((day) => {
    //convert each food item (from backend) into a UI-friendly entry object
    const entries = (day.foods || []).map((food) => {
      //extract consumed info. If missing, default to an empty object
      const consumed = food.consumed || {};
      //use the logged servings; if missing, default to 1
      const servings = consumed.servings ?? 1;

      // Build nutrient mapping from backend IDs
      const nutrientsObj = {};
      //loop through all backend nutrients for this food
      (food.nutrients || []).forEach((nut) => {
        //find the matching nutrient definition from NUTRIENTS by nutrientId
        const match = NUTRIENTS.find((n) => n.id === nut.nutrientId);
        if (match) {
          nutrientsObj[match.dataKey] = nut.amount ?? 0;
        }
      });

      //return the transformed entry formatted exactly how the UI expects it
      return {
        //unique identifier for the food. Support both foodId and id
        id: food.foodId ?? food.id,
        name: food.description || food.name || "food",
        nutrients: nutrientsObj,
        consumed: {
          servings,
          time: consumed.time || consumed.timestamp || day.date,
        },
      };
    });

    return {
      date: day.date || day.day || null,
      entries,
    };
  });
}


//main component
export default function History() {
  //which tab is selected? ("all" or "last7")
  const [range, setRange] = useState("all");


  //compute which start/end dates to request from backend. useMemo ensures this only recalculates when range changes 
  const { startDateIso, endDateIso } = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    //up to tomorrow
    const end = addDays(todayStr, 1); 
    const start =
      range === "last7"
        ? addDays(todayStr, -7) // last 7 days
        : addDays(todayStr, -30); // last 30 days for "all history"

    return { startDateIso: start, endDateIso: end };
  }, [range]);

  //Fetch backend SQL history 
  const backendRange = useRangeData(startDateIso, endDateIso);
  const backendDays = transformBackendDays(backendRange || []);

  //debug
  console.log("backendRange raw:", backendRange);
  console.log("backendDays transformed:", backendDays); 

  //Test data fallback 
  const testData = useTestData();
  const testDays = testData ? testData.days || [] : [];

  //Prefer backend if available; otherwise show placeholder data
  // const allDays =
  //   backendDays.length > 0
  //     ? backendDays
  //     : Array.isArray(testDays)
  //     ? testDays
  //     : [];
  // If backend returned empty → show empty. DO NOT use test data on History page.
  const allDays = backendDays;

  //nutrient visibility (calories, protein, etc)
  const [visibility, setVisibility] = useState(DEFAULT_VISIBILITY);

  //Load visibility once on mount
  useEffect(() => {
    setVisibility(loadVisibilityFromStorage());
  }, []);


  //visibleDays = days to display based on the selected tab even through backend already returns the righ range, we explicitly slice last 7 days to match UI logic
  const visibleDays = useMemo(() => {
    if (range === "last7") {
      return allDays.slice(0, 7);
    }
    return allDays;
  }, [range, allDays]);

  //compute totals and averages across visible days 
  //useMemo ensures recalculation only when visibleDays change 
  const { overviewTotals, overviewAverages } = useMemo(() => {
    const totals = computeTotalsForDays(visibleDays);
    const averages = createEmptyTotals();
    const dayCount = visibleDays.length || 1;

    NUTRIENTS.forEach((n) => {
      averages[n.dataKey] = totals[n.dataKey] / dayCount;
    });

    return { overviewTotals: totals, overviewAverages: averages };
  }, [visibleDays]);

  //whether to show calories as a top-line metric
  const caloriesVisible = visibility.calories !== false;

  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 mt-4 space-y-8">
        
        {/*HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              History
            </h1>
            <p className="mt-1 text-sm text-default-500">
              Review your logged days and see how your nutrients add up over
              time.
            </p>
          </div>

          {/* Range selection buttons */}
          <div className="inline-flex rounded-full bg-default-50/10 p-1">
            {RANGE_OPTIONS.map((opt) => (
              <Button
                key={opt.id}
                size="sm"
                auto
                radius="full"
                color={range === opt.id ? "primary" : "default"}
                variant={range === opt.id ? "solid" : "light"}
                className="px-4"
                onPress={() => setRange(opt.id)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </header>

        {/* OVERVIEW  */}
        <section>
          <h2 className="text-sm font-semibold text-default-500 mb-3">
            Overview (averages over {visibleDays.length || 0} day
            {visibleDays.length === 1 ? "" : "s"})
          </h2>

          {visibleDays.length === 0 ? (
            <p className="text-sm text-default-500">
              No history yet. Once you add foods, your summary will appear here.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {NUTRIENTS.map((n) => {
                if (!visibility[n.logicalKey]) return null;

                const avg = overviewAverages[n.dataKey] || 0;
                const total = overviewTotals[n.dataKey] || 0;
                const percentDV = getDailyValuePercent(n.logicalKey, avg);

                return (
                  <div
                    key={n.logicalKey}
                    className="rounded-2xl border border-default-100/40 bg-default-50 px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium uppercase tracking-wide text-default-500">
                        {n.label}
                      </span>
                      <span className="text-[11px] text-default-400">
                        avg / day
                      </span>
                    </div>

                    <div className="text-xl font-semibold text-white">
                      {Math.round(avg)}
                      {n.unit && (
                        <span className="ml-1 text-xs text-default-400">
                          {n.unit}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-default-400">
                      <span>
                        Total: {Math.round(total)}
                        {n.unit ? ` ${n.unit}` : ""}
                      </span>
                      {percentDV != null && (
                        <span>{Math.round(percentDV)}% DV</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/*  DAILY DETAILS  */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-default-500">
            Daily details
          </h2>

          {visibleDays.length === 0 ? (
            <p className="text-sm text-default-500">
              When you log foods, each day will appear here with its nutrient
              breakdown.
            </p>
          ) : (
            visibleDays.map((day) => {
              const totals = computeDayTotals(day);
              const entries = day.entries || [];
              const dateLabel = new Date(day.date).toLocaleDateString(
                undefined,
                { weekday: "short", month: "short", day: "numeric" }
              );

              return (
                <div
                  key={day.date}
                  className="rounded-2xl border border-default-100/40 bg-default-50 px-4 py-3 shadow-sm"
                >
                  {/* Header row: date, entry count, calories */}
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {dateLabel}
                      </span>
                      <span className="text-xs text-default-500">
                        {entries.length} entr
                        {entries.length === 1 ? "y" : "ies"}
                      </span>
                    </div>

                    {caloriesVisible && (
                      <div className="text-xs text-default-500">
                        Total:{" "}
                        <span className="font-semibold text-purple-300">
                          {Math.round(totals.energy_kcal || 0)} kcal
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Chip badges showing nutrient totals */}
                  <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    {NUTRIENTS.filter(
                      (n) =>
                        n.logicalKey !== "calories" &&
                        visibility[n.logicalKey]
                    ).map((n) => {
                      const amount = totals[n.dataKey] || 0;
                      const percentDV = getDailyValuePercent(
                        n.logicalKey,
                        amount
                      );

                      return (
                        <div
                          key={n.logicalKey}
                          className="inline-flex items-center gap-1 rounded-full bg-default-100/10 border border-default-100/30 px-3 py-1"
                        >
                          <span className="text-default-500">{n.label}</span>
                          <span className="font-semibold text-white">
                            {Math.round(amount)}
                            {n.unit && (
                              <span className="ml-0.5 text-[10px] text-default-400">
                                {n.unit}
                              </span>
                            )}
                          </span>
                          {percentDV != null && (
                            <span className="ml-1 text-[10px] text-default-400">
                              ({Math.round(percentDV)}% DV)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Food table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead className="border-b border-default-100/40 bg-default-100/10">
                        <tr>
                          <th className="px-2 py-1 text-left font-medium text-default-400">
                            Food
                          </th>
                          <th className="px-2 py-1 text-left font-medium text-default-400">
                            Time
                          </th>
                          <th className="px-2 py-1 text-left font-medium text-default-400">
                            Servings
                          </th>

                          {/* Create a column for each visible nutrient */}
                          {NUTRIENTS.filter(
                            (n) => visibility[n.logicalKey]
                          ).map((n) => (
                            <th
                              key={n.logicalKey}
                              className="px-2 py-1 text-right font-medium text-default-400"
                            >
                              {n.label}
                              {n.logicalKey !== "calories" && n.unit
                                ? ` (${n.unit})`
                                : ""}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {entries.map((entry) => {
                          const servings = entry?.consumed?.servings ?? 1;
                          const nutrients = entry?.nutrients || {};
                          const timeLabel = getEntryTimeLabel(entry);

                          return (
                            <tr
                              key={entry.id}
                              className="border-b border-default-100/20 odd:bg-default-50/40 even:bg-default-50/20 hover:bg-default-100/30 transition-colors"
                            >
                              <td className="px-2 py-1 text-white">
                                {entry.name}
                              </td>
                              <td className="px-2 py-1 text-default-300">
                                {timeLabel || "-"}
                              </td>
                              <td className="px-2 py-1 text-default-300">
                                {servings}
                              </td>

                              {/* Every visible nutrient is shown per food entry */}
                              {NUTRIENTS.filter(
                                (n) => visibility[n.logicalKey]
                              ).map((n) => (
                                <td
                                  key={n.logicalKey}
                                  className="px-2 py-1 text-right text-default-200"
                                >
                                  {Math.round(
                                    (nutrients[n.dataKey] || 0) * servings
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </DefaultLayout>
  );
}
