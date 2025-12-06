package database.data_access;

import com.mysql.cj.log.Log;
import database.data_transfer.LogEntry;
import database.helpers.Enumerations;
import database.wrappers.FoodItem;     

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;    
import java.util.stream.IntStream;    


public class HistoryDAO {
    private static Integer PER_PAGE = 32;

    // defaulting to breakfast, add an option of not included
    public boolean AddToHistory(int user_id, int food_id, Timestamp timestamp) {
        return AddToHistory(user_id, food_id, 1, Enumerations.MealType.BREAKFAST, timestamp);
    }
    public boolean AddToHistory(int user_id, int food_id, int quantity, Enumerations.MealType meal_type, Timestamp timestamp) {
        String query = "INSERT INTO food_logs (user_id, food_id, quantity, meal_type, log_date)" + "VALUES(?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, user_id);
            stmt.setInt(2, food_id);
            stmt.setInt(3, quantity);
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
                Timestamp date = rs.getTimestamp("log_date");
                LogEntry entry = new LogEntry(date, foodID);
                history.add(entry);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return history;
    }

    /**
     * Multithreaded demo method:
     *  - takes a list of numbers (for example, quantities or multipliers)
     *  - and a list of FoodItem objects of the same length
     *  - converts each FoodItem to a numeric value
     *  - multiplies the pair (number, foodValue) for each index
     *
     * The work is done in parallel using a parallel stream, which means
     * Java will use multiple threads from the ForkJoinPool to process
     * different indices at the same time.
     */
    public List<Double> multiplyNumbersAndFoodsParallel(
            List<Double> numbers,
            List<FoodItem> foods
    ) {
        if (numbers == null || foods == null) {
            throw new IllegalArgumentException("Input lists must not be null");
        }
        if (numbers.size() != foods.size()) {
            throw new IllegalArgumentException("Lists must be the same size");
        }

        // IntStream.range(...).parallel() = multithreading
        return IntStream.range(0, numbers.size())
                .parallel()  // <--- this is what makes it run on multiple threads
                .mapToDouble(i -> {
                    double n = numbers.get(i);
                    
                    //The getter for FoodItem is getFood() if different, just change this line.
                    double foodValue = foods.get(i).getFoodID();

                    return n * foodValue;
                })
                .boxed()
                .collect(Collectors.toList());
    }

}
