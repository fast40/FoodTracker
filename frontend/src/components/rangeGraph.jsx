import { useRangeData } from "@/hooks/dashboardData";
import { useMemo, useState } from "react";
import { Button, DatePicker } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { parseDate } from "@internationalized/date";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Legend,
  CartesianGrid,
} from "recharts";
import { BASE_NUTRIENTS, DEFAULT_DV, PALETTE } from "@/data";

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

function addDays(start, n) {
  const d = new Date(start);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export function RangeGraph({ date, setDate }) {

    const { startDate, endDate, weekLocalDates } = useMemo(() => {
        const d = new Date(date);
        const day = d.getDay(); // 0 = Sun, 1 = Mon, ...
        const diffToMonday = (day + 6) % 7; // 0 if Monday, 6 if Sunday
        const start = new Date(d);
        start.setDate(d.getDate() - diffToMonday);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 7);
        end.setHours(0, 0, 0, 0);
        const weekLocalDates = Array.from({ length: 7 }, (_, i) => {
            const dt = new Date(start);
            dt.setDate(start.getDate() + i);
            return dt.toISOString().slice(0, 10);
        });
        return {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            weekLocalDates,
        };
    }, [date]);

    // Get nutrient data via the dashboardData hook
    const rawData = useRangeData(startDate, endDate);
    const days = rawData ? rawData : [];

    const navigate = useNavigate();

    const nutrients = useMemo(
    () => {
        const visibility = loadVisibility();
        const filtered = BASE_NUTRIENTS.filter((n) => {
            const flag = visibility[n.settingsKey];
            return flag === undefined ? true : !!flag;
        });
        return filtered.map((n) => ({ id: n.id, label: n.label }));
    }, []);

    const data = useMemo(() => {
        // build lookup by local date string "YYYY-MM-DD"
        const lookup = (days || []).reduce((acc, d) => {
            const key = d.date?.slice(0, 10) ?? new Date(d.date).toISOString().slice(0, 10);
            acc[key] = d;
            return acc;
        }, {});

        return weekLocalDates.map(dateStr => {
            const day = lookup[dateStr] || { date: dateStr, foods: [] };

            const totals = nutrients.reduce((acc, n) => { acc[n.id] = 0; return acc; }, {});
            for (const entry of day.foods) {
                for (const n of nutrients) {
                    const factor = entry?.consumed?.servings ?? 1;
                    const nutrient = entry?.nutrients?.find((nut) => nut.nutrientId === n.id);
                    totals[n.id] += (nutrient?.amount || 0) * factor;
                }
            }

            const hasData = (day.foods && day.foods.length > 0);
            const dvPercents = {};
                for (const n of nutrients) {
                    const dv = DEFAULT_DV[n.id] ?? 1;
                    // if the day has no data, set null so Recharts will break the line
                    if (!hasData) {
                        dvPercents[n.id] = null;
                    } else {
                        const percent = (totals[n.id] / dv) * 100;
                        dvPercents[n.id] = Number.isFinite(percent) ? percent : 0;
                    }
            }

            return { date: dateStr, ...dvPercents };
        });
    }, [days, nutrients, weekLocalDates]);

    function ValueTooltip({ active, payload, label }) {
        if (!active || !payload?.length) return null;
        const sorted = [...payload].sort((a, b) => b.value - a.value);
        return (
            <div className="rounded-medium border bg-background p-2 text-sm">
                <div className="font-medium mb-1">{formatWeekday(label)} ({label.slice(5, 10)})</div>
                {sorted.map((p) => (
                    <div key={p.dataKey} className="flex items-center gap-2">
                    <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: p.color }}
                    />
                    <span>{p.name}:</span>
                    <span>{Math.round(p.value)}%</span>
                    </div>
                ))}
            </div>
        );
    }

    function CustomLegend({payload}) {
        return (
            <div
            style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "20px",
                marginLeft: "120px",
            }}
            >   
            {payload.map((entry) => (
                <div key={entry.value} style={{ display: "flex", alignItems: "center", marginLeft: "10px"}}>
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

    const formatWeekday = (yyyyMmDd) => {
        if (!yyyyMmDd) return "";
        const [y, m, d] = yyyyMmDd.split("-").map(Number);
        const dt = new Date(y, m - 1, d);                         // local date (avoids UTC offset issues)
        return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(dt);
    };

    function formatDay(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    //Bool to determine whether reference line is drawn at 100%
    const anyOver100 = data.some(entry => Object.values(entry).some(v => v > 100));


    return (
        <section className="flex flex-col gap-6 py-8 mt-2">
            
            {/* Header buttons */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                    <Button onPress={() => setDate(addDays(date, -7).slice(0, 10))} className="rounded-l-lg rounded-r-none text-xl font-semibold min-w-5" style={{ background: "rgb(40, 40, 40)" }}>&lt;</Button>
                    <Button onPress={() => setDate(addDays(date, 7).slice(0, 10))} className="rounded-l-none rounded-r-lg text-xl font-semibold min-w-5" style={{ background: "rgb(40, 40, 40)" }}>&gt;</Button>
                    <b className="ml-5">{formatDay(addDays(startDate, 1).slice(0, 10))} - {formatDay(endDate.slice(0, 10))}</b>
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
            <div className="w-full">
                <ResponsiveContainer width="100%" height={580} className="mt-1">
                <LineChart key={startDate} data={data} margin={{ top: 10, right: 0, left: -50, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="date"
                        tickFormatter={formatWeekday}
                        tick={{ dy: 4 }}
                    />
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
                        label={{ value: "100%", position: "left", style: { fontWeight: "bold " } }}
                    />
                    )}

                    {nutrients.map((n, i) => {
                        const color = PALETTE[i % PALETTE.length];
                        return (
                            <Line
                                key={n.id}
                                dataKey={n.id}
                                name={n.label}
                                type="linear"
                                stroke={color}
                                strokeWidth={3}
                                dot={false}
                            />
                        );
                    })}
                </LineChart>
                </ResponsiveContainer>
            </div>
            
            {/*<div>
                <p>TODO: add selectors for which nutrients to show?</p>
            </div>*/}
        </section>
    );
};
