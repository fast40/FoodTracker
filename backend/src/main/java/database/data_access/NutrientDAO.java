package database.data_access;

import database.wrappers.Nutrient;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class NutrientDAO {
    public boolean isCustom(int food_id) {
        String query = "SELECT COUNT(*) FROM food_nutrient_values WHERE food_id = ?";

        try (Connection conn = DatabaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, food_id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Nutrient> getCustomNutrients(int food_id) {
        List<Nutrient> nutrients = new ArrayList<>();

        String query = "SELECT nd.nutrient_id, nd.name, fnv.amount, nd.unit_name, nd.is_macronutrient FROM food_nutrient_values fnv JOIN nutrient_definitions nd ON fnv.nutrient_id = nd.nutrient_id WHERE fnv.food_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, food_id);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Nutrient nutrient = new Nutrient(rs.getInt("nutrient_id"),
                        rs.getString("name"), rs.getString("number"),
                        rs.getFloat("amount"), rs.getString("unit_name"));

                nutrients.add(nutrient);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return nutrients;
    }

    public List<Nutrient> getNutrientsFromAPI(int fdc_id) {
        List<Nutrient> nutrients = new ArrayList<>();

        return nutrients;
    }
}
