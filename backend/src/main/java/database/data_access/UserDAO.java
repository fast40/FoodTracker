package database.data_access;

import database.data_transfer.User;

import java.sql.*;


public class UserDAO {
    public User getUserByUsername(String username) {
        String query = "SELECT user_id, username, email, dark_mode, notifications_enabled, language_code, show_calories, daily_calorie_goal, created_at FROM users WHERE username = ?";

        try (
            Connection connection = DatabaseConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement(query)
        ) {
            statement.setString(1, username);
            ResultSet resultSet = statement.executeQuery();

            if (!resultSet.next()) {
                System.out.println("Query executed but no user by that username exists");
                return null;
            }

            return new User(
                resultSet.getInt("user_id"),
                resultSet.getString("username"),
                resultSet.getString("email"),
                resultSet.getBoolean("dark_mode"),
                resultSet.getBoolean("notifications_enabled"),
                resultSet.getString("language_code"),
                resultSet.getBoolean("show_calories"),
                resultSet.getInt("daily_calorie_goal"),
                resultSet.getTimestamp("created_at")
            );
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}
