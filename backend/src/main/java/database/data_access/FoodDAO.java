package database.data_access;

import database.helpers.Enumerations;
import database.wrappers.FoodItem;
import database.wrappers.Nutrient;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FoodDAO {
    public FoodItem getFoodById(int food_id) {
        String query = "SELECT * FROM food_items WHERE food_id = ?";
        try (Connection conn = DatabaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, food_id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                FoodItem food = new FoodItem();
                food.setFoodId(rs.getInt("food_id"));

                Integer fdc_id = rs.getObject("fdc_id", Integer.class);
                food.setFdcId(fdc_id);

                food.setDescription(rs.getString("description"));
                food.setDataType(rs.getString("data_type"));
                food.setBrandOwner(rs.getString("brand_owner"));
                food.setGtinUpc(rs.getString("gtin_upc"));
                food.setServingSize(rs.getFloat("serving_size"));
                food.setServingSizeUnit(rs.getString("serving_size_unit"));
                food.setHouseholdServingFullText(rs.getString("household_serving_full_text"));

                Integer createdBy = rs.getObject("created_by", Integer.class);
                food.setCreatorID(createdBy);

                return food;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public FoodItem getFoodByGTIN(String gtin) {
        String query = "SELECT * FROM food_items WHERE food_gtin = ?";
        try (Connection conn = DatabaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, gtin);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                FoodItem food = new FoodItem();
                Integer food_id = rs.getInt("food_id");
                food.setFoodId(food_id);

                Integer fdc_id = rs.getObject("fdc_id", Integer.class);
                food.setFdcId(fdc_id);

                food.setDescription(rs.getString("description"));
                food.setDataType(rs.getString("data_type"));
                food.setBrandOwner(rs.getString("brand_owner"));
                food.setGtinUpc(rs.getString("gtin_upc"));
                food.setServingSize(rs.getFloat("serving_size"));
                food.setServingSizeUnit(rs.getString("serving_size_unit"));
                food.setHouseholdServingFullText(rs.getString("household_serving_full_text"));

                food.setNutrients(GetNutrients(food_id));

                Integer createdBy = rs.getObject("created_by", Integer.class);
                food.setCreatorID(createdBy);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }


    public List<FoodItem> searchFoods(String search_query) {
        List<FoodItem> foods = new ArrayList<>();
        String sql_query = "SELECT * FROM food_items WHERE description LIKE ? " + " OR brand_owner LIKE ? LIMIT 50";

        try (Connection conn = DatabaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql_query)) {
            String search_pattern = "%" + search_query + "%";
            stmt.setString(1, search_pattern);
            stmt.setString(2, search_pattern);

            ResultSet rs = stmt.executeQuery();

            // possible runaway while loop, maybe limit scope
            while (rs.next()) {
                FoodItem food = new FoodItem();
                food.setDescription(rs.getString("description"));
                food.setDataType(rs.getString("data_type"));
                food.setBrandOwner(rs.getString("brand_owner"));
                food.setGtinUpc(rs.getString("gtin_upc"));
                food.setServingSize(rs.getFloat("serving_size"));
                food.setServingSizeUnit(rs.getString("serving_size_unit"));
                food.setHouseholdServingFullText(rs.getString("household_serving_full_text"));

                foods.add(food);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return foods;
    }

    public int insertFoodItem(FoodItem food) {
        String sql = "INSERT INTO food_items (fdc_id, description, data_type, brand_owner, serving_size, serving_size_unit, household_serving_full_text, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setObject(1, food.getFdcId());
            stmt.setString(2, food.getDescription());
            stmt.setString(3, food.getDataType());
            stmt.setString(4, food.getBrandOwner());
            stmt.setFloat(5, food.getServingSize());
            stmt.setString(6, food.getServingSizeUnit());
            stmt.setString(7, food.getHouseholdServingFullText());
            stmt.setObject(8, food.getCreatorID());

            int rowsAffected = stmt.executeUpdate();

            if (rowsAffected > 0) {
                ResultSet generatedKeys = stmt.getGeneratedKeys();
                if (generatedKeys.next()) {
                    int foodId = generatedKeys.getInt(1);

                    if (food.getNutrients() != null && !food.getNutrients().isEmpty()) {
                        insertNutrientsByFood(foodId, food.getNutrients());
                    }

                    return foodId;
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    public boolean insertNutrientsByFood(int foodId, List<Nutrient> nutrients) {
        String sql = "INSERT INTO food_nutrient_values (food_id, nutrient_id, amount) VALUES (?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            for (Nutrient nutrient : nutrients) {
                stmt.setInt(1, foodId);
                stmt.setInt(2, nutrient.getNutrientId());
                stmt.setFloat(3, nutrient.getAmount());
                stmt.addBatch();
            }

            stmt.executeBatch();
            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public Integer getFoodIdByFdcId(int fdcId) {
        String query = "SELECT food_id FROM food_items WHERE fdc_id = ?";

        try (Connection conn = DatabaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, fdcId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt("food_id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private List<Nutrient> GetNutrients(Integer food_id) {
        String  query = "SELECT * FROM food_nutrient_values WHERE food_id = ?";
        List<Nutrient> nutrients = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, food_id);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Integer nutrientID = rs.getInt("nutrient_id");
                String name  = Enumerations.NutrientType.values()[nutrientID].getName();
                // nutrient number is being ignored right now becuase I dont want to do a third lookup
                String nutrientNumber = "";
                Float amount = rs.getFloat("amount");
                String unitName = rs.getString("unit_name");

                Nutrient nutrient = new Nutrient(nutrientID, name, nutrientNumber, amount, unitName);
                nutrients.add(nutrient);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
