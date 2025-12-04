package database.test;

import database.data_access.DatabaseConnection;
import database.data_access.FoodDAO;
import database.data_access.HistoryDAO;
import database.helpers.Enumerations.NutrientType;
import database.wrappers.FoodItem;
import database.wrappers.Nutrient;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class PopulateDummies {
    public static final int dummyUserID = 456;
    private final FoodDAO foodDAO;
    private final HistoryDAO historyDAO;
    private final List<Integer> foodIds = new ArrayList<>();

    PopulateDummies() {
        foodDAO = new FoodDAO();
        historyDAO = new HistoryDAO();
    }

    private void addDummyFoods() {
        FoodItem foodItem = new FoodItem();
        List<Nutrient> nutrients = new ArrayList<>();

        // 0: Apple
        foodItem.setCreatorID(dummyUserID);
        foodItem.setDescription("Apple");
        foodItem.setDataType("User");
        foodItem.setServingSize(1.0f);
        foodItem.setServingSizeUnit("Apple");
        foodItem.setHouseholdServingFullText("1 Apple");
        nutrients.add(new Nutrient(NutrientType.ENERGY, 95));
        nutrients.add(new Nutrient(NutrientType.PROTEIN, 0.5f));
        nutrients.add(new Nutrient(NutrientType.CARBOHYDRATE, 25));
        nutrients.add(new Nutrient(NutrientType.FIBER, 4.4f));
        nutrients.add(new Nutrient(NutrientType.SUGARS_TOTAL, 19));
        nutrients.add(new Nutrient(NutrientType.VITAMIN_C, 8));
        foodItem.setNutrients(nutrients);
        System.out.println("Description: " + foodItem.getDescription());
        System.out.println("Serving Size: " + foodItem.getServingSize());
        System.out.println("Creator ID: " + foodItem.getCreatorID());
        System.out.println("Nutrients: " + foodItem.getNutrients().size());
        foodIds.add(foodDAO.insertFoodItem(foodItem));

        // 1: Chicken Breast
        nutrients.clear();
        foodItem.setDescription("Chicken Breast");
        foodItem.setServingSize(100f);
        foodItem.setServingSizeUnit("g");
        foodItem.setHouseholdServingFullText("100g cooked");
        nutrients.add(new Nutrient(NutrientType.ENERGY, 165));
        nutrients.add(new Nutrient(NutrientType.PROTEIN, 31));
        nutrients.add(new Nutrient(NutrientType.TOTAL_FAT, 3.6f));
        nutrients.add(new Nutrient(NutrientType.CHOLESTEROL, 85));
        nutrients.add(new Nutrient(NutrientType.SODIUM, 74));
        foodItem.setNutrients(nutrients);
        System.out.println("Description: " + foodItem.getDescription());
        System.out.println("Serving Size: " + foodItem.getServingSize());
        System.out.println("Creator ID: " + foodItem.getCreatorID());
        System.out.println("Nutrients: " + foodItem.getNutrients().size());
        foodIds.add(foodDAO.insertFoodItem(foodItem));

        // 2: Brown Rice
        nutrients.clear();
        foodItem.setDescription("Brown Rice");
        foodItem.setServingSize(1.0f);
        foodItem.setServingSizeUnit("cup");
        foodItem.setHouseholdServingFullText("1 cup cooked");
        nutrients.add(new Nutrient(NutrientType.ENERGY, 216));
        nutrients.add(new Nutrient(NutrientType.PROTEIN, 5));
        nutrients.add(new Nutrient(NutrientType.CARBOHYDRATE, 45));
        nutrients.add(new Nutrient(NutrientType.FIBER, 3.5f));
        nutrients.add(new Nutrient(NutrientType.MAGNESIUM, 84));
        foodItem.setNutrients(nutrients);
        System.out.println("Description: " + foodItem.getDescription());
        System.out.println("Serving Size: " + foodItem.getServingSize());
        System.out.println("Creator ID: " + foodItem.getCreatorID());
        System.out.println("Nutrients: " + foodItem.getNutrients().size());
        foodIds.add(foodDAO.insertFoodItem(foodItem));

        // 3: Broccoli
        nutrients.clear();
        foodItem.setDescription("Broccoli");
        foodItem.setServingSize(1.0f);
        foodItem.setServingSizeUnit("cup");
        foodItem.setHouseholdServingFullText("1 cup chopped");
        nutrients.add(new Nutrient(NutrientType.ENERGY, 55));
        nutrients.add(new Nutrient(NutrientType.PROTEIN, 3.7f));
        nutrients.add(new Nutrient(NutrientType.CARBOHYDRATE, 11));
        nutrients.add(new Nutrient(NutrientType.FIBER, 5.1f));
        nutrients.add(new Nutrient(NutrientType.VITAMIN_C, 135));
        nutrients.add(new Nutrient(NutrientType.VITAMIN_K, 116));
        foodItem.setNutrients(nutrients);
        System.out.println("Description: " + foodItem.getDescription());
        System.out.println("Serving Size: " + foodItem.getServingSize());
        System.out.println("Creator ID: " + foodItem.getCreatorID());
        System.out.println("Nutrients: " + foodItem.getNutrients().size());
        foodIds.add(foodDAO.insertFoodItem(foodItem));

        // 4: Salmon
        nutrients.clear();
        foodItem.setDescription("Salmon");
        foodItem.setServingSize(100f);
        foodItem.setServingSizeUnit("g");
        foodItem.setHouseholdServingFullText("100g fillet");
        nutrients.add(new Nutrient(NutrientType.ENERGY, 208));
        nutrients.add(new Nutrient(NutrientType.PROTEIN, 20));
        nutrients.add(new Nutrient(NutrientType.TOTAL_FAT, 13));
        nutrients.add(new Nutrient(NutrientType.FATTY_ACID_22_6_DHA, 1.1f));
        nutrients.add(new Nutrient(NutrientType.FATTY_ACID_20_5_EPA, 0.8f));
        nutrients.add(new Nutrient(NutrientType.VITAMIN_D, 11));
        foodItem.setNutrients(nutrients);
        System.out.println("Description: " + foodItem.getDescription());
        System.out.println("Serving Size: " + foodItem.getServingSize());
        System.out.println("Creator ID: " + foodItem.getCreatorID());
        System.out.println("Nutrients: " + foodItem.getNutrients().size());
        foodIds.add(foodDAO.insertFoodItem(foodItem));

        // 5: Banana
        nutrients.clear();
        foodItem.setDescription("Banana");
        foodItem.setServingSize(1.0f);
        foodItem.setServingSizeUnit("banana");
        foodItem.setHouseholdServingFullText("1 medium banana");
        nutrients.add(new Nutrient(NutrientType.ENERGY, 105));
        nutrients.add(new Nutrient(NutrientType.PROTEIN, 1.3f));
        nutrients.add(new Nutrient(NutrientType.CARBOHYDRATE, 27));
        nutrients.add(new Nutrient(NutrientType.FIBER, 3.1f));
        nutrients.add(new Nutrient(NutrientType.POTASSIUM, 422));
        nutrients.add(new Nutrient(NutrientType.VITAMIN_B6, 0.4f));
        foodItem.setNutrients(nutrients);
        System.out.println("Description: " + foodItem.getDescription());
        System.out.println("Serving Size: " + foodItem.getServingSize());
        System.out.println("Creator ID: " + foodItem.getCreatorID());
        System.out.println("Nutrients: " + foodItem.getNutrients().size());
        foodIds.add(foodDAO.insertFoodItem(foodItem));

        // 6: Eggs
        nutrients.clear();
        foodItem.setDescription("Eggs");
        foodItem.setServingSize(1.0f);
        foodItem.setServingSizeUnit("egg");
        foodItem.setHouseholdServingFullText("1 large egg");
        nutrients.add(new Nutrient(NutrientType.ENERGY, 78));
        nutrients.add(new Nutrient(NutrientType.PROTEIN, 6));
        nutrients.add(new Nutrient(NutrientType.TOTAL_FAT, 5));
        nutrients.add(new Nutrient(NutrientType.CHOLESTEROL, 186));
        nutrients.add(new Nutrient(NutrientType.VITAMIN_D, 1));
        nutrients.add(new Nutrient(NutrientType.VITAMIN_B12, 0.6f));
        foodItem.setNutrients(nutrients);
        System.out.println("Description: " + foodItem.getDescription());
        System.out.println("Serving Size: " + foodItem.getServingSize());
        System.out.println("Creator ID: " + foodItem.getCreatorID());
        System.out.println("Nutrients: " + foodItem.getNutrients().size());
        foodIds.add(foodDAO.insertFoodItem(foodItem));

        // 7: Oatmeal
        nutrients.clear();
        foodItem.setDescription("Oatmeal");
        foodItem.setServingSize(1.0f);
        foodItem.setServingSizeUnit("cup");
        foodItem.setHouseholdServingFullText("1 cup cooked");
        nutrients.add(new Nutrient(NutrientType.ENERGY, 150));
        nutrients.add(new Nutrient(NutrientType.PROTEIN, 5));
        nutrients.add(new Nutrient(NutrientType.CARBOHYDRATE, 27));
        nutrients.add(new Nutrient(NutrientType.FIBER, 4));
        nutrients.add(new Nutrient(NutrientType.IRON, 2));
        nutrients.add(new Nutrient(NutrientType.MAGNESIUM, 56));
        foodItem.setNutrients(nutrients);
        System.out.println("Description: " + foodItem.getDescription());
        System.out.println("Serving Size: " + foodItem.getServingSize());
        System.out.println("Creator ID: " + foodItem.getCreatorID());
        System.out.println("Nutrients: " + foodItem.getNutrients().size());
        foodIds.add(foodDAO.insertFoodItem(foodItem));
    }

    public void run() {
        clearDummyData();
        createDummyUser();  // Add this
        addDummyFoods();
        logFoodToDummy();
        System.out.println("Dummy data populated successfully!");
    }

    private void createDummyUser() {
        String sql = "INSERT INTO users (user_id, username, email, password) VALUES (?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, dummyUserID);
            stmt.setString(2, "dummy_user");
            stmt.setString(3, "dummy@test.com");
            stmt.setString(4, "password123");

            stmt.executeUpdate();
            System.out.println("Created dummy user with ID: " + dummyUserID);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void clearDummyData() {
        try (Connection conn = DatabaseConnection.getConnection()) {

            // 1. Delete history/logs for dummy user
            String deleteHistory = "DELETE FROM food_logs WHERE user_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(deleteHistory)) {
                stmt.setInt(1, dummyUserID);
                int deleted = stmt.executeUpdate();
                System.out.println("Deleted " + deleted + " history entries");
            }

            // 2. Delete nutrients for foods created by dummy user
            String deleteNutrients = "DELETE FROM food_nutrient_values WHERE food_id IN (SELECT food_id FROM food_items WHERE created_by = ?)";
            try (PreparedStatement stmt = conn.prepareStatement(deleteNutrients)) {
                stmt.setInt(1, dummyUserID);
                int deleted = stmt.executeUpdate();
                System.out.println("Deleted " + deleted + " nutrient entries");
            }

            // 3. Delete foods created by dummy user
            String deleteFoods = "DELETE FROM food_items WHERE created_by = ?";
            try (PreparedStatement stmt = conn.prepareStatement(deleteFoods)) {
                stmt.setInt(1, dummyUserID);
                int deleted = stmt.executeUpdate();
                System.out.println("Deleted " + deleted + " food entries");
            }

            // 4. Delete the dummy user
            String deleteUser = "DELETE FROM users WHERE user_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(deleteUser)) {
                stmt.setInt(1, dummyUserID);
                int deleted = stmt.executeUpdate();
                System.out.println("Deleted " + deleted + " user entries");
            }

            System.out.println("Cleared existing dummy data");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    private void logFoodToDummy() {
        Instant now = Instant.now();

        // Today
        logEntry(foodIds.get(7), now.minus(10, ChronoUnit.HOURS));  // Oatmeal - breakfast
        logEntry(foodIds.get(0), now.minus(9, ChronoUnit.HOURS));   // Apple - snack
        logEntry(foodIds.get(1), now.minus(5, ChronoUnit.HOURS));   // Chicken - lunch
        logEntry(foodIds.get(2), now.minus(5, ChronoUnit.HOURS));   // Brown Rice - lunch

        // Yesterday
        Instant yesterday = now.minus(1, ChronoUnit.DAYS);
        logEntry(foodIds.get(6), yesterday.minus(10, ChronoUnit.HOURS));  // Eggs - breakfast
        logEntry(foodIds.get(5), yesterday.minus(6, ChronoUnit.HOURS));   // Banana - snack
        logEntry(foodIds.get(4), yesterday.minus(4, ChronoUnit.HOURS));   // Salmon - lunch
        logEntry(foodIds.get(3), yesterday.minus(1, ChronoUnit.HOURS));   // Broccoli - dinner

        // 2 days ago
        Instant twoDaysAgo = now.minus(2, ChronoUnit.DAYS);
        logEntry(foodIds.get(7), twoDaysAgo.minus(10, ChronoUnit.HOURS)); // Oatmeal
        logEntry(foodIds.get(0), twoDaysAgo.minus(6, ChronoUnit.HOURS));  // Apple
        logEntry(foodIds.get(1), twoDaysAgo.minus(4, ChronoUnit.HOURS));  // Chicken
        logEntry(foodIds.get(2), twoDaysAgo.minus(4, ChronoUnit.HOURS));  // Brown Rice
        logEntry(foodIds.get(3), twoDaysAgo.minus(1, ChronoUnit.HOURS));  // Broccoli

        // 3 days ago
        Instant threeDaysAgo = now.minus(3, ChronoUnit.DAYS);
        logEntry(foodIds.get(6), threeDaysAgo.minus(9, ChronoUnit.HOURS)); // Eggs
        logEntry(foodIds.get(5), threeDaysAgo.minus(5, ChronoUnit.HOURS)); // Banana
        logEntry(foodIds.get(4), threeDaysAgo.minus(2, ChronoUnit.HOURS)); // Salmon
    }

    private void logEntry(Integer foodId, Instant timestamp) {
        historyDAO.AddToHistory(dummyUserID, foodId, Timestamp.from(timestamp));
    }

    public static void main(String[] args) {
        PopulateDummies populator = new PopulateDummies();
        populator.run();
    }
}