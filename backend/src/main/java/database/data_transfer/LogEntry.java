package database.data_transfer;

import java.sql.Timestamp;

public record LogEntry(Timestamp date, float quantity, int foodId) {
}
