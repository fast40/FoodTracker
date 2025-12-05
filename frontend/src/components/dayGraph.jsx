import { useRangeData } from "@/hooks/dashboardData";
import { useTestData } from "@/hooks/dashboardData";
import { useMemo, useState } from "react";
import { Button, DatePicker } from "@heroui/react";
import { useNavigate } from "react-router-dom";
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
  ReferenceLine,
} from "recharts";
import { DEFAULT_DV, UNITS, PALETTE } from "@/data";

const STORAGE_KEY = "nutrientVisibility";

const BASE_NUTRIENTS = [
  { key: "energy_kcal", label: "Calories", settingsKey: "calories" },
  { key: "protein_g", label: "Protein", settingsKey: "protein" },
  { key: "carbs_g", label: "Carbs", settingsKey: "carbs" },
  { key: "fat_g", label: "Fat", settingsKey: "fat" },
  { key: "fiber_g", label: "Fiber", settingsKey: "fiber" },
  { key: "sodium_mg", label: "Sodium", settingsKey: "sodium" },
  { key: "sugars_g", label: "Sugars", settingsKey: "sugars" },
];

function loadVisibility() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function addDays(start, n) {
  const d = new Date(start);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export const DayGraph = () => {

    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const dayDate = useMemo(() => new Date(date).toISOString(), [date]);

    // Get nutrient data via the dashboardData hook
    //const rawData = useTestData();
    const rawData = useRangeData(dayDate, addDays(dayDate, 365));
    const day = rawData ? rawData.days[0] : [];
    const entries = day ? day.entries : [];

    const navigate = useNavigate();

    // Nutrient categories (bars on X-axis)
    const nutrients = useMemo(
    () => {
        const visibility = loadVisibility();
        const filtered = BASE_NUTRIENTS.filter((n) => {
            const flag = visibility[n.settingsKey];
            return flag === undefined ? true : !!flag;
        });
        return filtered.map((n) => ({ key: n.key, label: n.label }));
    }, []);

    const foods = (entries || []).map((e, i) => ({
        id: e.id || String(i),
        name: e.name,
        color: PALETTE[i % PALETTE.length],
    }));

    // Build stacked data rows: one row per nutrient, columns per food id with %DV values
    const data = useMemo(() => {
    const rows = nutrients.map((n) => ({ name: n.label, nutrientKey: n.key }));
    (entries || []).map((e, i) => {
        const foodId = foods[i]?.id;
        if (!foodId) return;
        const factor = e?.consumed?.servings ?? 1;

        nutrients.forEach((n) => {
            const abs = ((e?.nutrients || {})[n.key] || 0) * factor;
            const dv = DEFAULT_DV[n.key] || 0;
            const uncappedPct = dv ? Math.max(0, (abs / dv) * 100) : 0;
            const pct = Math.min(100, uncappedPct);
            const row = rows.find((r) => r.nutrientKey === n.key) || {};
            row[foodId] = pct;
            row[`${foodId}__abs`] = abs;
            row.totalPctUncapped = (row.totalPctUncapped || 0) + uncappedPct;
        });
    });
    return rows;
    }, [entries, nutrients, foods]);

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
    //Bool to determine whether reference line is drawn at 100%
    const anyOver100 = data.some(r => (r.totalPctUncapped || 0) > 100);

    
    return (
        <section className="flex flex-col gap-6 mt-10">
            
            {/* Header buttons */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                    <Button className="rounded-l-lg rounded-r-none text-xl font-semibold min-w-5" style={{ background: "rgb(40, 40, 40)" }}>&lt;</Button>
                    <Button className="rounded-l-none rounded-r-lg text-xl font-semibold min-w-5" style={{ background: "rgb(40, 40, 40)" }}>&gt;</Button>
                </div>
                <div className="flex items-center gap-3">
                    <DatePicker
                        aria-label="Pick date"
                        className="max-w-60"
                        value={parseDate(date)}
                        onChange={(v) => v && setDate(v.toString())}
                    />
                    <Button color="primary" onPress={() => navigate("/add")} style={{ color: "white" }}>
                        Add Food
                    </Button>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={600}>
            <BarChart data={data} margin={{ top: 10, right: 0, left: -50, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    width={130}
                    label={{
                        value: "Daily Value (%)",
                        angle: -90,
                        position: "center",
                    }}
                />
                <Tooltip content={<ValueTooltip />} />
                <Legend />

                {anyOver100 && (
                <ReferenceLine
                    y={100}
                    stroke="#ffffffff"
                    strokeWidth={3}
                    label={{ value: "100%", position: "left", style: { fontWeight: "bold " } }}
                />
                )}

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
        </section>
    );
};
