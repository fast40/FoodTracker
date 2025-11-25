/* eslint-disable */
import DefaultLayout from "@/layouts/default";
import { useDayData } from "@/hooks/useDashboardData";
import { useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { DEFAULT_DV } from "@/data/dv";
import { UNITS } from "@/data/units";


export default function Dashboard() {
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  // Memorize Date instance so useDayData's effect doesn't re-run every render
  const dayDate = useMemo(() => new Date(date), [date]);
  const { totals: _totals, entries } = useDayData(dayDate);
  const navigate = useNavigate();

  // Nutrient categories (bars on X-axis)
  const nutrients = useMemo(
    () => [
      { key: "energy_kcal", label: "Calories" },
      { key: "protein_g", label: "Protein" },
      { key: "carbs_g", label: "Carbs" },
      { key: "fat_g", label: "Fat" },
      { key: "fiber_g", label: "Fiber" },
      { key: "sodium_mg", label: "Sodium" },
      { key: "sugars_g", label: "Sugars" },
    ],
    []
  );

  // Color palette and per-food mapping
  const palette = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#22d3ee",
  ];
  const foods = (entries || []).map((e, i) => ({
    id: e.id || String(i),
    name: e.name,
    color: palette[i % palette.length],
  }));

  // Build stacked data rows: one row per nutrient, columns per food id with %DV values
  const data = useMemo(() => {
    const rows = nutrients.map(
      (n) => ({ name: n.label, nutrientKey: n.key })
    );
    (entries || []).map((e, i) => {
      const foodId = foods[i]?.id;
      if (!foodId) return;
      const factor = e?.consumed?.servings ?? 1;
      nutrients.forEach((n) => {
        const abs = ((e?.nutrients || {})[n.key] || 0) * factor;
        const dv = DEFAULT_DV[n.key] || 0;
        const pct = dv ? Math.min(100, Math.max(0, (abs / dv) * 100)) : 0;
        const row = rows.find((r) => r.nutrientKey === n.key) || {};
        row[foodId] = pct;
        row[`${foodId}__abs`] = abs;
      });
    });
    return rows;
  }, [entries, nutrients]);

  // Tooltip: show absolute values with units for the hovered nutrient
  function ValueTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const row = data.find((d) => d.name === label);
    const nutrientKey = row?.nutrientKey;
    const unit = nutrientKey ? UNITS[nutrientKey] || "" : "";
    return (
      <div className="rounded-medium border bg-background p-2 text-sm">
        <div className="font-medium mb-1">{label}</div>
        {payload.map((p) => {
          const foodId = p.dataKey;
          const abs = p?.payload?.[`${foodId}__abs`] ?? 0;
          const food = foods.find((f) => f.id === foodId);
          return (
            <div key={foodId} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: p.color }}
              />
              <span>{food?.name || foodId}:</span>
              <span className="tabular-nums">
                {abs}
                {unit ? ` ${unit}` : ""}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <DatePicker
              aria-label="Pick date"
              className="max-w-60"
              value={parseDate(date)}
              onChange={(v) => v && setDate(v.toString())}
            />
            <Button color="primary" onPress={() => navigate("/add")}>
              Add Food
            </Button>
          </div>
        </div>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                width={50}
                label={{
                  value: "Daily Value (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<ValueTooltip />} />
              <Legend />
              {foods.map((f) => (
                <Bar
                  key={f.id}
                  dataKey={f.id}
                  name={f.name}
                  stackId="a"
                  fill={f.color}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </DefaultLayout>
  );
}