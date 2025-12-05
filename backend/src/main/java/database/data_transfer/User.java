package database.data_transfer;

import java.sql.Timestamp;

public record User(
    int id,
    String username,
    String email,
    boolean darkMode,
    boolean notificationsEnabled,
    String languageCode,
    boolean showCalories,
    int dailyCalorieGoal,
    Timestamp createdAt
) {
}
