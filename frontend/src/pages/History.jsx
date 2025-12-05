import DefaultLayout from "@/layouts/default";
import { useEffect, useMemo, useState } from "react";
import { useTestData } from "@/hooks/dashboardData";
import { Button } from "@heroui/react";


const STORAGE_KEY = "nutrientVisibility";

// Map between Settings keys and the keys used in the test data.
const NUTRIENTS = [
  {
    logicalKey: "calories", // key used in Settings
    dataKey: "energy_kcal", // key in entry.nutrients
    label: "Calories",
    unit: "kcal",
  },
  { logicalKey: "protein", dataKey: "protein_g", label: "Protein", unit: "g" },
  { logicalKey: "carbs", dataKey: "carbs_g", label: "Carbs", unit: "g" },
  { logicalKey: "fat", dataKey: "fat_g", label: "Fat", unit: "g" },
  { logicalKey: "fiber", dataKey: "fiber_g", label: "Fiber", unit: "g" },
  {
    logicalKey: "sodium",
    dataKey: "sodium_mg",
    label: "Sodium",
    unit: "mg",
  },
  { logicalKey: "sugars", dataKey: "sugars_g", label: "Sugars", unit: "g" },
];

// Tabs for the top range selector (All / Last 7 days)
const RANGE_OPTIONS = [
  { id: "all", label: "All history" },
  { id: "last7", label: "Last 7 days" },
];

// Default visibility if localStorage is empty or broken
const DEFAULT_VISIBILITY = {
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  fiber: true,
  sodium: true,
  sugars: true,
};

/**
 * Utility: create an object with every nutrient total initialized to 0.
 * Example: { energy_kcal: 0, protein_g: 0, ... }
 */
function createEmptyTotals() {
  const totals = {};
  NUTRIENTS.forEach((n) => {
    totals[n.dataKey] = 0;
  });
  return totals;
}

/**
 * Utility: given a "day" object from useTestData(),
 * sum all nutrients across its entries (taking servings into account).
 */
function computeDayTotals(day) {
  const totals = createEmptyTotals();

  (day.entries || []).forEach((entry) => {
    const servings = entry?.consumed?.servings ?? 1;

    NUTRIENTS.forEach((n) => {
      const value = (entry?.nutrients?.[n.dataKey] || 0) * servings;
      totals[n.dataKey] += value;
    });
  });

  return totals;
}

/**
 * Utility: sum nutrient totals across many days.
 * Used for the big "Overview" row at the top.
 */
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

/**
 * Utility: read nutrientVisibility from localStorage.
 * We always merge with DEFAULT_VISIBILITY so missing keys default to true.
 */
function loadVisibilityFromStorage() {
  if (typeof window === "undefined") return DEFAULT_VISIBILITY;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VISIBILITY;

    const parsed = JSON.parse(raw);
    return { ...DEFAULT_VISIBILITY, ...parsed };
  } catch (e) {
    console.error("Failed to load nutrientVisibility from localStorage", e);
    return DEFAULT_VISIBILITY;
  }
}

export default function History() {
  // Test data hook from your project (same as used in graphs)
  const data = useTestData();
  const allDays = data ? data.days || [] : [];

  // Which tab is selected: all history or last 7 days
  const [range, setRange] = useState("all");

  // Nutrient visibility loaded from Settings
  const [visibility, setVisibility] = useState(DEFAULT_VISIBILITY);

  // Load visibility once on mount
  useEffect(() => {
    setVisibility(loadVisibilityFromStorage());
  }, []);

  // Filter which days are visible based on the selected range
  const visibleDays = useMemo(() => {
    if (range === "last7") {
      // assume test data is already in reverse-chronological order
      return allDays.slice(0, 7);
    }
    return allDays;
  }, [range, allDays]);

  // Totals across all visible days for the top summary cards
  const overviewTotals = useMemo(
    () => computeTotalsForDays(visibleDays),
    [visibleDays]
  );

  // Whether calories are turned on in Settings (used for per-day header)
  const caloriesVisible = visibility.calories !== false;

  return (
    <DefaultLayout>
      {/* Outer page container.
          mt-4 gives a little breathing room below the navbar */}
      <div className="max-w-6xl mx-auto px-4 py-6 mt-4 space-y-8">
        {/*  HEADER + RANGE TABS  */}
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

          {/* Range tabs styled similar to the Day/Week/Month buttons */}
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

        {/* OVERVIEW CARDS */}
        <section>
          <h2 className="text-sm font-semibold text-default-500 mb-3">
            Overview ({visibleDays.length || 0} day
            {visibleDays.length === 1 ? "" : "s"} selected)
          </h2>

          {visibleDays.length === 0 ? (
            <p className="text-sm text-default-500">
              No history yet. Once you add foods, your summary will appear here.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {NUTRIENTS.map((n) => {
                //skip cards for nutrients that are hidden in Settings
                if (!visibility[n.logicalKey]) return null;

                const value = overviewTotals[n.dataKey] || 0;

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
                        total
                      </span>
                    </div>
                    <div className="text-xl font-semibold text-white">
                      {Math.round(value)}
                      {n.unit && (
                        <span className="ml-1 text-xs text-default-400">
                          {n.unit}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* PER-DAY CARDS */}
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
                  {/*  Card header: date + total calories  */}
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

                  {/* Macro "pill" chips for visible non-calorie nutrients  */}
                  <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    {NUTRIENTS.filter(
                      (n) =>
                        n.logicalKey !== "calories" &&
                        visibility[n.logicalKey]
                    ).map((n) => (
                      <div
                        key={n.logicalKey}
                        className="inline-flex items-center gap-1 rounded-full bg-default-100/10 border border-default-100/30 px-3 py-1"
                      >
                        <span className="text-default-500">{n.label}</span>
                        <span className="font-semibold text-white">
                          {Math.round(totals[n.dataKey] || 0)}
                          {n.unit && (
                            <span className="ml-0.5 text-[10px] text-default-400">
                              {n.unit}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Entries table*/}
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      {/* table header: slightly lighter background to stand out */}
                      <thead className="border-b border-default-100/40 bg-default-100/10">
                        <tr>
                          <th className="px-2 py-1 text-left font-medium text-default-400">
                            Food
                          </th>
                          <th className="px-2 py-1 text-left font-medium text-default-400">
                            Servings
                          </th>
                          {/* dynamic columns for any visible nutrient */}
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

                      {/* body: brighter values + zebra striping */}
                      <tbody>
                        {entries.map((entry) => {
                          const servings = entry?.consumed?.servings ?? 1;
                          const nutrients = entry?.nutrients || {};

                          return (
                            <tr
                              key={entry.id}
                              className="border-b border-default-100/20 odd:bg-default-50/40 even:bg-default-50/20 hover:bg-default-100/30 transition-colors"
                            >
                              {/* Food name: brightest */}
                              <td className="px-2 py-1 text-white">
                                {entry.name}
                              </td>

                              {/* Servings: slightly dimmer but readable */}
                              <td className="px-2 py-1 text-default-300">
                                {servings}
                              </td>

                              {/* Nutrient numbers: brighter than before */}
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
