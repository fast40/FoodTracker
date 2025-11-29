import { useEffect, useState } from "react";

// Fetches from the /api/dashboard servlet to get values for a given day
// @return: list of foods, each with nutrient values, name, and servings
export function useDayData(dayDate) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        //TODO: add dayDat to request
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


// Fetches from the /api/dashboard servlet to get values for a given date range (week or month)
// @return: list of days (each has foods, each with nutrient values, name, and servings)
export function useRangeData(startDate, endDate) {
  
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
          energy_kcal: 320,
          protein_g: 10,
          carbs_g: 30,
          fat_g: 8,
          fiber_g: 4,
          sodium_mg: 300,
          sugars_g: 17,
        },
      },
      {
        id: "2",
        name: "Sample Food B",
        consumed: { servings: 1 },
        nutrients: {
          energy_kcal: 150,
          protein_g: 0,
          carbs_g: 20,
          fat_g: 2,
          fiber_g: 3,
          sodium_mg: 200,
          sugars_g: 10,
        },
      },
      {
        id: "3",
        name: "Sample Food C",
        consumed: { servings: 5 },
        nutrients: {
          energy_kcal: 90,
          protein_g: 2,
          carbs_g: 22,
          fat_g: 6,
          fiber_g: 3,
          sodium_mg: 180,
          sugars_g: 8,
        },
      },
      {
        id: "4",
        name: "Sample Food D",
        consumed: { servings: 1 },
        nutrients: {
          energy_kcal: 140,
          protein_g: 12,
          carbs_g: 18,
          fat_g: 8,
          fiber_g: 2,
          sodium_mg: 220,
          sugars_g: 9,
        },
      },
      {
        id: "5",
        name: "Sample Food E",
        consumed: { servings: 1 },
        nutrients: {
          energy_kcal: 200,
          protein_g: 3,
          carbs_g: 25,
          fat_g: 5,
          fiber_g: 6,
          sodium_mg: 150,
          sugars_g: 4,
        },
      },
    ],
  };
}