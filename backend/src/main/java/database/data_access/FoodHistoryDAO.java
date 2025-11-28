package database.data_access;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FoodHistoryDAO {
    private static Integer PER_PAGE = 32;
    public boolean AddToHistory(int UserID, int FoodID) {
        // TO DO
        return false;
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