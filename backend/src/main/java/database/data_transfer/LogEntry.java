package database.data_transfer;

import java.sql.Timestamp;

public record LogEntry(Timestamp date, int foodId) {
}
