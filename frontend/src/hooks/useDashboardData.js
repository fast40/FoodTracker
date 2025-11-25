export function useDayData() {
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