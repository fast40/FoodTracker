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
  //return useTestData();
}


// Returns placeholder data for testing purposes
export function useTestData() {
  return {
    days: [
      //DAY 1
      {
        date: "2025-12-03",
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
      },
      
      //DAY 2
      {
        date: "2025-12-02",
        entries: [
        {
          id: "1",
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
          id: "2",
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
          id: "3",
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
      ]},

      //DAY 3
      {
        date: "2025-12-01",
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
          consumed: { servings: 2 },
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
      ]},
      
      //DAY 4
      {
        date: "2025-11-30",
        entries: [
        {
          id: "1",
          name: "Sample Food A",
          consumed: { servings: 4 },
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
      ]},
    ]
  };
}