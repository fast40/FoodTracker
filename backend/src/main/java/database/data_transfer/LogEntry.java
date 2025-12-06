package database.data_transfer;

import java.sql.Timestamp;

public record LogEntry(int logId, Timestamp date, int foodId, float quantity, String mealType) {
}
