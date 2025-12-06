package database.wrappers;

import database.data_access.HistoryDAO;
import database.data_transfer.LogEntry;

import java.sql.Timestamp;
import java.util.List;

public class User {
    private Integer userId;
    private String username;
    private String email;
    private String passwordHash;

    // Constructors
    public User() {}

    public User(Integer userId, String username, String email, String passwordHash) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // Setters / Getters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    // Food History Methods
    public List<LogEntry> getFoodHistory() {
        return getFoodHistory(null, null, 10);
    }

    public List<LogEntry> getFoodHistory(int limit) {
        return getFoodHistory(null, null, limit);
    }

    public List<LogEntry> getFoodHistory(Timestamp start, Timestamp end) {
        return getFoodHistory(start, end, 100);
    }

    public List<LogEntry> getFoodHistory(Timestamp start, Timestamp end, int limit) {
        if (this.userId == null) {
            throw new IllegalStateException("User ID is not set");
        }

        HistoryDAO historyDAO = new HistoryDAO();
        try {
            // If start/end are null, you might want to set defaults
            if (start == null) {
                start = new Timestamp(0); // Beginning of time
            }
            if (end == null) {
                end = new Timestamp(System.currentTimeMillis()); // Current time
            }
            return historyDAO.GetHistory(this.userId, start, end, limit);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
