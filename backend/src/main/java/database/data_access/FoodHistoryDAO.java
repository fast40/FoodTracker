package database.data_access;

import database.helpers.Enumerations;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;


public class FoodHistoryDAO {
    private static Integer PER_PAGE = 32;
    // defaulting to breakfast, add an option of not included
    public boolean AddToHistory(int user_id, int food_id) {return AddToHistory(user_id, food_id, 1, Enumerations.MealType.BREAKFAST); }
    public boolean AddToHistory(int user_id, int food_id, int quantity, Enumerations.MealType meal_type) {
        String query = "INSERT INTO food_logs (user_id, food_id, quantity, meal_type)" + "VALUES(?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, user_id);
            stmt.setInt(2, food_id);
            stmt.setInt(3, quantity);
            stmt.setString(4, meal_type.GetName());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            // do something
            // if (e.getErrorCode() == ___ ) {
            //      return false;
            // }
            //throw e;
            return false;
        }
    }

    public List<Integer> GetHistory(Integer UserID, Integer page) throws SQLException {
        List<Integer> history = new ArrayList<>();
        String query = "SELECT * FROM food_logs WHERE user_id = ? ORDER BY log_date DESC LIMIT ";
        query += PER_PAGE.toString() + ", " + ((page - 1) * PER_PAGE);
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, UserID);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Integer foodID = rs.getInt("food_id");
                history.add(foodID);
            }
        }
        return history;
    }
}