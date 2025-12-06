import { useEffect, useState } from "react";
import { DailyFoodLog } from "../types";

// Fetches from the /api/dashboard servlet to get values for a given date range
// @return: list of days (each has foods, each with nutrient values, name, and servings)
export function useRangeData(start: string | Date, end: string | Date) {
  const offset = new Date().getTimezoneOffset(); // in minutes
  const startDate = new Date(
    new Date(start).getTime() + offset * 60000
  ).toISOString();
  const endDate = new Date(
    new Date(end).getTime() + offset * 60000
  ).toISOString();

  const [data, setData] = useState<DailyFoodLog[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "http://localhost:8080/food-tracker/api/dashboard",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              startDate,
              endDate,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
          }
        );
        if (!res.ok) throw new Error("Request failed");

        const json: DailyFoodLog[] = await res.json();
        setData(json);
      } catch (err) {
        console.log("ERROR fetching from /api/dashboard: " + err.message);
      }
    }

    load();
  }, [startDate, endDate]);

  return data;
}
