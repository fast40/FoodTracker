import { useEffect, useState } from "react";

// Fetches from the /api/dashboard servlet to get totals for a given day
// - currently does not use the dayDate parameter
export function useDayData(dayDate) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:8080/food-tracker/api/dashboard");
        if (!res.ok)
          throw new Error("Request failed");

        const json = await res.json();
        if (!json.success)
          throw new Error("Missing data");

        setData({
          totals: {},
          entries: [
            {
              id: "1",
              name: "Daily Totals",
              consumed: { servings: 1 },
              nutrients: {
                energy_kcal: json.calories,
                protein_g: json.protein,
                carbs_g: json.carbohydrates,
                fat_g: json.fat,
                sugars_g: json.sugar,
                fiber_g: json.fiber,
                sodium_mg: json.sodium
              }
            }
          ]
        });

      } catch (err) {
        console.log("ERROR fetching from /api/dashboard:" + err.message);
      }
    }

    load();
  }, []);

  return data;
}

// Returns placeholder data for testing purposes
export function useTestData() {
  return {
    totals: {},
    entries: [
      {
        id: "1",
        name: "Sample Food A",
        consumed: { servings: 1 },
        nutrients: {
          energy_kcal: 200,
          protein_g: 10,
          carbs_g: 30,
          fat_g: 5,
          fiber_g: 4,
          sodium_mg: 300,
          sugars_g: 12,
        },
      },
      {
        id: "2",
        name: "Sample Food B",
        consumed: { servings: 1 },
        nutrients: {
          energy_kcal: 150,
          protein_g: 5,
          carbs_g: 20,
          fat_g: 7,
          fiber_g: 3,
          sodium_mg: 200,
          sugars_g: 10,
        },
      },
    ],
  };
}