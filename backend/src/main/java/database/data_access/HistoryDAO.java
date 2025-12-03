package database.data_access;

import database.helpers.Enumerations;

import javax.print.PrintException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;


public class HistoryDAO {
    private static Integer PER_PAGE = 32;

    // defaulting to breakfast, add an option of not included
    public boolean AddToHistory(int user_id, int food_id) {
        return AddToHistory(user_id, food_id, 1, Enumerations.MealType.BREAKFAST);
    }

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

    public List<Integer> GetHistory(Integer UserID, Timestamp start, Timestamp end) throws SQLException {
        return GetHistory(UserID, start, end, 100);
    }

    public List<Integer> GetHistory(Integer UserID, Timestamp start, Timestamp end, Integer limit) throws SQLException {
        List<Integer> history = new ArrayList<>();
        String query = "SELECT * FROM food_logs WHERE user_id = ? AND log_date BETWEEN ? AND ? ORDER BY log_date DESC LIMIT ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, UserID);
            stmt.setTimestamp(2, start);
            stmt.setTimestamp(3, end);
            stmt.setInt(4, limit);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Integer foodID = rs.getInt("food_id");
                history.add(foodID);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return history;
    }
}