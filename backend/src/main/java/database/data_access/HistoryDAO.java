package database.data_access;

import database.data_transfer.LogEntry;
import database.helpers.Enumerations;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;



public class HistoryDAO {
    private static Integer PER_PAGE = 32;

    // defaulting to breakfast, add an option of not included
    public boolean AddToHistory(int user_id, int food_id, Timestamp timestamp) {
        return AddToHistory(user_id, food_id, 1, Enumerations.MealType.BREAKFAST, timestamp);
    }
    public boolean AddToHistory(int user_id, int food_id, float quantity, Enumerations.MealType meal_type, Timestamp timestamp) {
        String query = "INSERT INTO food_logs (user_id, food_id, quantity, meal_type, log_date)" + "VALUES(?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, user_id);
            stmt.setInt(2, food_id);
            stmt.setFloat(3, quantity);
            stmt.setString(4, meal_type.GetName());
            stmt.setTimestamp(5, timestamp);
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

    public List<LogEntry> GetHistory(Integer UserID, Timestamp start, Timestamp end) throws SQLException {
        return GetHistory(UserID, start, end, 100);
    }

    public List<LogEntry> GetHistory(Integer UserID, Timestamp start, Timestamp end, Integer limit) throws SQLException {
        List<LogEntry> history = new ArrayList<>();
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
                Float quantity = rs.getFloat("quantity");
                Timestamp date = rs.getTimestamp("log_date");
                LogEntry entry = new LogEntry(date, quantity, foodID);
                history.add(entry);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return history;
    }
}
