package database.data_transfer;

import database.wrappers.FoodItem;

public record FoodLogEntry(int logId, FoodItem food, float quantity, String logDate, String mealType) {}
