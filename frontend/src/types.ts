export enum NutrientID {
  Protein = 1003,
  Fat = 1004,
  Carbs = 1005,
  Energy = 1008,
  Fiber = 1079,
  Sodium = 1093,
  Sugar = 2000,
}

export interface Nutrient {
  nutrientId: number;
  name?: string;
  number?: string;
  amount: number;
  unitName?: string;
}

export interface FoodItem {
  foodId?: number;
  fdcId?: number;
  description: string;
  dataType?: string;
  brandOwner?: string;
  gtinUpc?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  nutrients: Nutrient[];
}

// Unified Model: Used for both Reading History and Writing New Logs
export interface FoodLogEntry {
  logId?: number; // Optional for new logs
  food: FoodItem;
  quantity: number; // Servings
  logDate: string; // ISO timestamp
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface User {
  id: number;
  username: string;
  email: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  languageCode: string;
  showCalories: boolean;
  dailyCalorieGoal: number;
  createdAt: string;
}

// Current API Response Structure
export interface DailyFoodLog {
  date: string;
  foods: FoodLogEntry[];
}
