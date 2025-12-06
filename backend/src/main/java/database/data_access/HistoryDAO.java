package database.data_access;

import com.mysql.cj.log.Log;
import database.data_transfer.LogEntry;
import database.helpers.Enumerations;
import database.wrappers.FoodItem; 

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
     * Convert a FoodItem into a numeric value.
     * Change this to whatever makes sense for your project
     * (calories, protein, id, etc.).
     */
    private double getFoodNumericValue(FoodItem food) {
        // TODO: replace this with a real property:
        // e.g. return food.getCalories();
        // I’m using getFoodID() as a placeholder.
        return food.getFoodID();
    }


        /**
     * Multithreaded multiplication using explicit Thread objects.
     *
     * - numbers: list of doubles (e.g., quantities or multipliers)
     * - foods:   list of FoodItem objects (same size as numbers)
     *
     * For each index i, it computes:
     *   result[i] = numbers[i] * getFoodNumericValue(foods[i])
     *
     * Work is split across several Worker threads, each handling a
     * different chunk of indices in parallel.
     */
    public List<Double> multiplyNumbersAndFoodsWithThreads(
            List<Double> numbers,
            List<FoodItem> foods
    ) throws InterruptedException {

        if (numbers == null || foods == null) {
            throw new IllegalArgumentException("Input lists must not be null");
        }
        if (numbers.size() != foods.size()) {
            throw new IllegalArgumentException("Lists must have the same size");
        }

        int size = numbers.size();
        double[] results = new double[size];

        // Decide how many worker threads to use.
        // Use up to one thread per CPU core, but not more than list size.
        int cores = Runtime.getRuntime().availableProcessors();
        int numThreads = Math.min(size, cores);
        if (numThreads == 0) {
            return new ArrayList<>();
        }

        // Inner worker class that extends Thread and processes a chunk
        class Worker extends Thread {
            private final int startIndex;
            private final int endIndex; // exclusive

            Worker(int startIndex, int endIndex) {
                this.startIndex = startIndex;
                this.endIndex = endIndex;
            }

            @Override
            public void run() {
                for (int i = startIndex; i < endIndex; i++) {
                    double n = numbers.get(i);
                    double foodValue = getFoodNumericValue(foods.get(i));
                    results[i] = n * foodValue;
                }
            }
        }

        Worker[] workers = new Worker[numThreads];

        // Compute chunk sizes (divide work across threads)
        int chunkSize = (int) Math.ceil(size / (double) numThreads);
        int currentStart = 0;

        // Create and start each worker thread
        for (int t = 0; t < numThreads; t++) {
            int start = currentStart;
            int end = Math.min(size, start + chunkSize);
            if (start >= end) {
                workers[t] = null; // no work for this one
                continue;
            }
            workers[t] = new Worker(start, end);
            workers[t].start();
            currentStart = end;
        }

        // Wait for all worker threads to finish
        for (Worker worker : workers) {
            if (worker != null) {
                worker.join();
            }
        }

        // Convert primitive array to List<Double>
        List<Double> resultList = new ArrayList<>(size);
        for (double v : results) {
            resultList.add(v);
        }
        return resultList;
    }



}
