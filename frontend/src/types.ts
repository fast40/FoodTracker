export interface Nutrient {
  nutrientId: number;
  name: string;
  number: string; // USDA nutrient number (e.g. "203")
  amount: number;
  unitName: string;
}

export interface FoodItem {
  foodId?: number; // Database ID (optional for new items)
  fdcId?: number; // USDA ID
  description: string;
  dataType?: string; // 'Branded', 'Foundation', 'User', etc.
  brandOwner?: string;
  gtinUpc?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  nutrients: Nutrient[];
}

export interface FoodLogEntry {
  logId: number;
  food: FoodItem;
  quantity: number; // Number of servings
  logDate: string; // ISO timestamp
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}
