import { useRangeData } from "@/hooks/dashboardData";
import { useTestData } from "@/hooks/dashboardData";
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
import { DEFAULT_DV, UNITS, PALETTE } from "@/data";


export const RangeGraph = () => {

    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const dayDate = useMemo(() => new Date(date), [date]);

    //TODO: get startDate
    // - start with current week (query today's date and day of week)
    // - let user click arrows/date picker to set manually

    // Get nutrient data via the dashboardData hook
    // - useRangeData(startDate) to fetch from tomcat server
    // - useTestData() for local placeholder values
    const rawData = useTestData();
    const days = rawData ? rawData.days : [];

    const nutrients = useMemo(
    () => [
        { key: "energy_kcal", label: "Calories" },
        { key: "protein_g", label: "Protein" },
        { key: "carbs_g", label: "Carbs" },
        { key: "fat_g", label: "Fat" },
        { key: "fiber_g", label: "Fiber" },
        { key: "sodium_mg", label: "Sodium" },
        { key: "sugars_g", label: "Sugars" },
    ]);

    const data = useMemo(() => {
        return days.map(day => {
            // build empty totals object from the nutrient list
            const totals = nutrients.reduce((acc, n) => {
                acc[n.key] = 0;
                return acc;
            }, {});

            // accumulate values for each nutrient key
            for (const entry of day.entries) {
                for (const n of nutrients) {
                    const factor = entry?.consumed?.servings ?? 1;
                    totals[n.key] += entry.nutrients[n.key] * factor ?? 0;
                }
            }

            const dvPercents = {};

            for (const n of nutrients) {
                const dv = DEFAULT_DV[n.key] ?? 1;  // avoid divide-by-zero
                dvPercents[n.key] = (totals[n.key] / dv) * 100;
            }

            return {
                date: day.date,
                ...dvPercents,
            }
        });
    }, [days, nutrients]);

    const anyOver100 = data.some(entry => Object.values(entry).some(v => v > 100));


    return (
        <section className="flex flex-col gap-6 py-8 mt-2">
            
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
            <div className="w-full">
                <ResponsiveContainer width="100%" height={550} className="mt-1">
                <LineChart data={data} margin={{ top: 10, right: 0, left: -50, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />
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

                    {/*<Tooltip />*/}
                    <Legend />

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
                                key={n.key}
                                dataKey={n.key}
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
            
            <div>
                <p>TODO: add selectors for which nutrients to show</p>
            </div>
        </section>
    );
}