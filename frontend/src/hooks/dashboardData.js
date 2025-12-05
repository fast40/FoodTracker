import { useEffect, useState } from "react";

// Fetches from the /api/dashboard servlet to get values for a given date range
// @return: list of days (each has foods, each with nutrient values, name, and servings)
export function useRangeData(start, end) {

  const offset = new Date().getTimezoneOffset(); // in minutes
  const startDate = new Date(new Date(start).getTime() + offset * 60000).toISOString();
  const endDate = new Date(new Date(end).getTime() + offset * 60000).toISOString();

  const [data, setData] = useState([]);

  useEffect(() => {

    async function load() {
      try {

        //get current userid

        const params = new URLSearchParams({
          startDate,
          endDate,
          userID: 456, //TODO: get actual user data - wait for Advait's user servlet?
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        const res = await fetch(`http://localhost:8080/food-tracker/api/dashboard?${params.toString()}`);
        if (!res.ok)
          throw new Error("Request failed");

        const json = await res.json();
        setData(json);

      } catch (err) {
        console.log("ERROR fetching from /api/dashboard: " + err.message);
      }
    }

    load();
  }, [startDate, endDate]);

  return data;
}