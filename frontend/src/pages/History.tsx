import DefaultLayout from "@/layouts/default";
import { useEffect, useMemo, useState } from "react";
import { useRangeData } from "@/hooks/dashboardData";
import { Button } from "@heroui/react";
import { NUTRIENT_DEFINITIONS, STORAGE_KEY, DEFAULT_VISIBILITY } from "@/data";

//helper function --> add/bubtract days from a year-month-day string
//                --> use this to calculate the date range for backend queries
function addDays(start: string | Date, n: number) {
  const d = new Date(start);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

//daily values for computing %DV
//FDA Daily Recommended Values
const DAILY_VALUES = NUTRIENT_DEFINITIONS.reduce(
  (acc, n) => ({ ...acc, [n.settingsKey]: n.defaultDV }),
  {} as Record<string, number>
);

//Top UI tabs for range selection (either all or the last 7 days)
const RANGE_OPTIONS = [
  { id: "all", label: "All history" },
  { id: "last7", label: "Last 7 days" },
];

//create an empty object
function createEmptyTotals() {
  const totals: Record<string, number> = {};
  NUTRIENT_DEFINITIONS.forEach((n) => {
    totals[n.dataKey] = 0;
  });
  return totals;
}

//compute the totals for a single day
//then loop through each entry (food item) and multiply the values by the servings
function computeDayTotals(day: any) {
  //create an empty object with everything init to 0
  const totals = createEmptyTotals();

  //loop through every food entry for the given day
  (day.entries || []).forEach((entry: any) => {
    //get the number of servings for this food entry
    //if servings is missing, default to 1
    const servings = entry?.consumed?.servings ?? 1;

    //loop through every nutrient that are tracked (calories, protein, carbs, etc)
    NUTRIENT_DEFINITIONS.forEach((n) => {
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
function computeTotalsForDays(days: any[]) {
  const totals = createEmptyTotals();

  days.forEach((day) => {
    const dayTotals = computeDayTotals(day);
    NUTRIENT_DEFINITIONS.forEach((n) => {
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
function getDailyValuePercent(logicalKey: string, amount: number) {
  const dv = DAILY_VALUES[logicalKey as keyof typeof DAILY_VALUES];
  if (!dv || amount == null) return null;
  return (amount / dv) * 100;
}

//convert different timestamp shapes into a HH:MM label
function getEntryTimeLabel(entry: any) {
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

import { DailyFoodLog } from "@/types";

//converts the backend format into the local UI format
function transformBackendDays(rawDays: DailyFoodLog[]) {
  //if the response is not an array, safely return an empty list
  if (!Array.isArray(rawDays)) return [];

  //map each backend "day" object into a new transformed "day" object
  return rawDays.map((day) => {
    //convert each food item (from backend) into a UI-friendly entry object
    const entries = (day.foods || []).map((entry) => {
      //use the logged servings; if missing, default to 1
      const servings = entry.quantity ?? 1;

      // Build nutrient mapping from backend IDs
      const nutrientsObj: Record<string, number> = {};
      //loop through all backend nutrients for this food
      (entry.food.nutrients || []).forEach((nut) => {
        //find the matching nutrient definition from NUTRIENT_DEFINITIONS by nutrientId
        const match = NUTRIENT_DEFINITIONS.find((n) => n.id === nut.nutrientId);
        if (match) {
          nutrientsObj[match.dataKey] = nut.amount ?? 0;
        }
      });

      //return the transformed entry formatted exactly how the UI expects it
      return {
        //unique identifier for the food. Support both foodId and id
        id: entry.logId || entry.food.foodId,
        name: entry.food.description,
        nutrients: nutrientsObj,
        consumed: {
          servings,
          time: entry.logDate,
        },
      };
    });

    return {
      date: day.date,
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

  //Prefer backend if available; otherwise show placeholder data
  const allDays = backendDays.length > 0 ? backendDays : [];
  // If backend returned empty → show empty. DO NOT use test data on History page.
  // const allDays = backendDays;

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

    NUTRIENT_DEFINITIONS.forEach((n) => {
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
              {NUTRIENT_DEFINITIONS.map((n) => {
                if (!visibility[n.settingsKey as keyof typeof visibility])
                  return null;

                const avg = overviewAverages[n.dataKey] || 0;
                const total = overviewTotals[n.dataKey] || 0;
                const percentDV = getDailyValuePercent(n.settingsKey, avg);

                return (
                  <div
                    key={n.settingsKey}
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
                    {NUTRIENT_DEFINITIONS.filter(
                      (n) =>
                        n.settingsKey !== "calories" &&
                        visibility[n.settingsKey as keyof typeof visibility]
                    ).map((n) => {
                      const amount = totals[n.dataKey] || 0;
                      const percentDV = getDailyValuePercent(
                        n.settingsKey,
                        amount
                      );

                      return (
                        <div
                          key={n.settingsKey}
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
                          {NUTRIENT_DEFINITIONS.filter(
                            (n) =>
                              visibility[
                                n.settingsKey as keyof typeof visibility
                              ]
                          ).map((n) => (
                            <th
                              key={n.settingsKey}
                              className="px-2 py-1 text-right font-medium text-default-400"
                            >
                              {n.label}
                              {n.settingsKey !== "calories" && n.unit
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
                              {NUTRIENT_DEFINITIONS.filter(
                                (n) =>
                                  visibility[
                                    n.settingsKey as keyof typeof visibility
                                  ]
                              ).map((n) => (
                                <td
                                  key={n.settingsKey}
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
