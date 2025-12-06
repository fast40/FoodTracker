import { useRangeData } from "@/hooks/dashboardData";
import { useMemo } from "react";
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
import { BASE_NUTRIENTS, DEFAULT_DV, UNITS, PALETTE } from "@/data";

const STORAGE_KEY = "nutrientVisibility";

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

function addDays(start: string | Date, n: number) {
  const d = new Date(start);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export function DayGraph({
  date,
  setDate,
}: {
  date: string;
  setDate: (d: string) => void;
}) {
  const startDate = useMemo(() => new Date(date).toISOString(), [date]);
  const endDate = useMemo(() => addDays(new Date(date), 1), [date]);

  // Get nutrient data via the dashboardData hook
  const rawData = useRangeData(startDate, endDate);
  //console.log(JSON.stringify(rawData, null, 2));
  const day = rawData ? rawData[0] : undefined;
  const entries = day ? day.foods : [];

  const navigate = useNavigate();

  // Nutrient categories (bars on X-axis)
  const nutrients = useMemo(() => {
    const visibility = loadVisibility();
    const filtered = BASE_NUTRIENTS.filter((n) => {
      const flag = visibility[n.settingsKey];
      return flag === undefined ? true : !!flag;
    });
    return filtered.map((n) => ({ id: n.id, label: n.label }));
  }, []);

  const foods = (entries || []).map((e: any, i: number) => ({
    id: e.food.foodId || String(i),
    name: e.food.description,
  }));
  const foodsSorted = [...foods]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((f, idx) => ({
      ...f,
      color: PALETTE[idx % PALETTE.length],
    }));

  // Build stacked data rows: one row per nutrient, columns per food id with %DV values
  const data = useMemo(() => {
    const rows: any[] = nutrients.map((n) => ({
      name: n.label,
      nutrientId: n.id,
    }));
    (entries || []).map((e: any, i: number) => {
      const foodId = foods[i]?.id;
      if (!foodId) return;
      const factor = e.quantity ?? 1;

      nutrients.forEach((n) => {
        const nutrient = e.food.nutrients?.find(
          (nut: any) => nut.nutrientId === n.id
        );
        const abs = (nutrient?.amount || 0) * factor;
        const dv = DEFAULT_DV[n.id as keyof typeof DEFAULT_DV] || 0;
        const uncappedPct = dv ? Math.max(0, (abs / dv) * 100) : 0;
        const pct = Math.min(100, uncappedPct);
        const row = rows.find((r) => r.nutrientId === n.id) || {};
        row[foodId] = pct;
        row[`${foodId}__abs`] = abs;
        row.totalPctUncapped = (row.totalPctUncapped || 0) + uncappedPct;
      });
    });
    return rows;
  }, [entries, nutrients, foods]); // Tooltip: show absolute values with units for the hovered nutrient
  function ValueTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const row = data.find((d) => d.name === label);
    const nutrientId = row?.nutrientId;
    const unit = nutrientId
      ? UNITS[nutrientId as keyof typeof UNITS] || ""
      : "";
    return (
      <div className="rounded-medium border bg-background p-2 text-sm">
        <div className="font-medium mb-1">{label}</div>
        {payload.map((p: any) => {
          const foodId = p.dataKey;
          const abs = p?.payload?.[`${foodId}__abs`] ?? 0;
          const food = foods.find((f: any) => f.id === foodId);
          return (
            <div key={foodId} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: p.color }}
              />
              <span>{food?.name || foodId}:</span>
              <span className="tabular-nums">
                {abs}
                {unit ? `${unit}` : ""}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  function CustomLegend({ payload }: any) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "12px",
          marginLeft: "120px",
        }}
      >
        {payload.map((entry: any) => (
          <div
            key={entry.value}
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                background: entry.color,
                marginRight: 6,
              }}
            />
            {entry.value}
          </div>
        ))}
      </div>
    );
  }

  const formatWeekday = (yyyyMmDd: string) => {
    if (!yyyyMmDd) return "";
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    const dt = new Date(y, m - 1, d); // local date (avoids UTC offset issues)
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(dt);
  };

  function formatDay(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  //Bool to determine whether reference line is drawn at 100%
  const anyOver100 = data.some((r: any) => (r.totalPctUncapped || 0) > 100);

  return (
    <section className="flex flex-col gap-6 mt-10">
      {/* Header buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <Button
            onPress={() => setDate(addDays(date, -1).slice(0, 10))}
            className="rounded-l-lg rounded-r-none text-xl font-semibold min-w-5"
            style={{ background: "rgb(40, 40, 40)" }}
          >
            &lt;
          </Button>
          <Button
            onPress={() => setDate(addDays(date, 1).slice(0, 10))}
            className="rounded-l-none rounded-r-lg text-xl font-semibold min-w-5"
            style={{ background: "rgb(40, 40, 40)" }}
          >
            &gt;
          </Button>
          <b className="ml-5">
            {formatWeekday(startDate.slice(0, 10))},{" "}
            {formatDay(addDays(startDate, 1).slice(0, 10))}
          </b>
        </div>
        <div className="flex items-center gap-3">
          <DatePicker
            aria-label="Pick date"
            className="max-w-60"
            value={parseDate(date)}
            onChange={(v) => v && setDate(v.toString())}
          />
          <Button
            color="primary"
            onPress={() => navigate("/add")}
            style={{ color: "white" }}
          >
            Add Food
          </Button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          key={foodsSorted.map((f) => f.id).join("_")}
          data={data}
          margin={{ top: 10, right: 0, left: -50, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${Math.round(v)}%`}
            width={130}
            label={{
              value: "Daily Value (%)",
              angle: -90,
              position: "center",
            }}
          />
          <Tooltip content={<ValueTooltip />} />
          <Legend content={CustomLegend} />

          {anyOver100 && (
            <ReferenceLine
              y={100}
              stroke="#ffffffff"
              strokeWidth={3}
              label={{
                value: "100%",
                position: "left",
                style: { fontWeight: "bold " },
              }}
            />
          )}

          {foodsSorted.map((f) => (
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
}
