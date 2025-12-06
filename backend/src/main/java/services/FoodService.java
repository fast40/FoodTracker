package services;

import java.sql.Timestamp;
import java.time.Instant;

import database.data_access.FoodDAO;
import database.data_access.HistoryDAO;
import database.data_transfer.FoodLogEntry;
import database.helpers.Enumerations;
import database.wrappers.FoodItem;

public class FoodService {
    private final FoodDAO foodDAO = new FoodDAO();
    private final HistoryDAO historyDAO = new HistoryDAO();

    public void logFood(int userId, FoodLogEntry logEntry) {
        FoodItem foodItem = logEntry.food();
        int foodId;

        // 1. Determine Food ID (Reuse or Create)
        if (foodItem.getFoodId() != null) {
            foodId = foodItem.getFoodId();
        } else {
            // Create new food
            foodItem.setCreatorID(userId);
            foodItem.setDataType("User");

            // Ensure defaults
            if (foodItem.getServingSize() == null) foodItem.setServingSize(1.0f);
            if (foodItem.getServingSizeUnit() == null) foodItem.setServingSizeUnit("serving");
            if (foodItem.getHouseholdServingFullText() == null) {
                foodItem.setHouseholdServingFullText(foodItem.getServingSize() + " " + foodItem.getServingSizeUnit());
            }

            foodId = foodDAO.insertFoodItem(foodItem);
        }

        // 2. Parse Meal Type
        Enumerations.MealType mealType = Enumerations.MealType.SNACK;
        if (logEntry.mealType() != null) {
            try {
                mealType = Enumerations.MealType.valueOf(logEntry.mealType().toUpperCase());
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid meal type: " + logEntry.mealType());
            }
        }

        // 3. Parse Date
        Timestamp timestamp = Timestamp.from(Instant.now());
        if (logEntry.logDate() != null) {
            try {
                timestamp = Timestamp.from(Instant.parse(logEntry.logDate()));
            } catch (Exception e) {
                System.out.println("Invalid date format: " + logEntry.logDate());
            }
        }

        // 4. Add to History
        historyDAO.AddToHistory(userId, foodId, logEntry.quantity(), mealType, timestamp);
    }
}
