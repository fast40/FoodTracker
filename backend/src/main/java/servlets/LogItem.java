package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.security.Principal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

import database.data_access.DatabaseConnection;
import database.data_access.FoodDAO;
import database.data_access.HistoryDAO;
import database.data_access.UserDAO;
import database.data_transfer.User;
import database.helpers.RequestJsonParser;
import database.helpers.Enumerations.NutrientType;
import database.wrappers.FoodItem;
import database.wrappers.Nutrient;

@WebServlet("/api/log-item")
public class LogItem extends HttpServlet {
        Gson gson = new Gson();

        private final record FoodEntry(String name, float servings, Nutrients nutrients) { }
        private final record Nutrients(int energy_kcal, int protein_g, int carbs_g, int fat_g, int fiber_g, int sodium_mg, int sugars_g) { }

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().println("log a food entry for a logged in user.");
	}

        @Override
        public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
                Principal principal = request.getUserPrincipal();

                if (principal == null) {
                        System.out.println("tried to add food with no user logged in"); 

                        response.setContentType("application/json");
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.getWriter().write(gson.toJson(Map.of("message", "no user logged in")));

                        return;
                }

                UserDAO userDAO = new UserDAO();
                User user = userDAO.getUserByUsername(principal.getName());

                FoodEntry foodEntry = RequestJsonParser.parse(request, FoodEntry.class);

                // try (
                //         Connection connection = DatabaseConnection.getConnection();
                //         PreparedStatement addItem = connection.prepareStatement("INSERT INTO simple_food_items (name, energy_kcal, protein_g, carbs_g, fat_g, fiber_g, sodium_mg, sugars_g, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
                //         PreparedStatement addLog = connection.prepareStatement("INSERT INTO simple_food_logs (user_id, food_id, quantity) VALUES (?, ?, ?)");
                // ) {
                //
                //         addItem.setString(1, foodEntry.name);
                //         addItem.setInt(2, foodEntry.nutrients.energy_kcal);
                //         addItem.setInt(3, foodEntry.nutrients.protein_g);
                //         addItem.setInt(4, foodEntry.nutrients.carbs_g);
                //         addItem.setInt(5, foodEntry.nutrients.fat_g);
                //         addItem.setInt(6, foodEntry.nutrients.fiber_g);
                //         addItem.setInt(7, foodEntry.nutrients.sodium_mg);
                //         addItem.setInt(8, foodEntry.nutrients.sugars_g);
                //         addItem.setInt(9, user.id());
                //
                //         addItem.executeUpdate();
                //
                //         ResultSet resultSet = addItem.getGeneratedKeys();
                //         resultSet.next();
                //         long foodId = resultSet.getLong(1);
                //
                //         addLog.setInt(1, user.id());
                //         addLog.setLong(2, foodId);
                //         addLog.setFloat(3, foodEntry.servings());
                //
                //         addLog.executeUpdate();
                //
                //         System.out.println("added food item and log");
                //
                //         // TODO: return some json (success)
                // } catch (SQLException e) {
                //         e.printStackTrace();
                //
                //         response.sendRedirect(request.getContextPath() + "/login");
                // }

                FoodDAO foodDAO = new FoodDAO();
                HistoryDAO historyDAO = new HistoryDAO();

                FoodItem foodItem = new FoodItem();
                List<Nutrient> nutrients = new ArrayList<>();

                // foodItem.setCreatorID(1);
                // foodItem.setDescription("Apple");
                // foodItem.setDataType("User");
                // foodItem.setServingSize(1.0f);
                // foodItem.setServingSizeUnit("Apple");
                // foodItem.setHouseholdServingFullText("1 Apple");
                // nutrients.add(new Nutrient(NutrientType.ENERGY, 95));
                // nutrients.add(new Nutrient(NutrientType.PROTEIN, 0.5f));
                // nutrients.add(new Nutrient(NutrientType.CARBOHYDRATE, 25));
                // nutrients.add(new Nutrient(NutrientType.FIBER, 4.4f));
                // nutrients.add(new Nutrient(NutrientType.SUGARS_TOTAL, 19));
                // nutrients.add(new Nutrient(NutrientType.VITAMIN_C, 8));
                // foodItem.setNutrients(nutrients);
                // System.out.println("Description: " + foodItem.getDescription());
                // System.out.println("Serving Size: " + foodItem.getServingSize());
                // System.out.println("Creator ID: " + foodItem.getCreatorID());
                // System.out.println("Nutrients: " + foodItem.getNutrients().size());
                // foodDAO.insertFoodItem(foodItem);
                // System.out.println("added");

                foodItem.setCreatorID(user.id());
                foodItem.setDescription(foodEntry.name());
                foodItem.setDataType("User");
                foodItem.setServingSize(1.0f);
                foodItem.setServingSizeUnit(foodEntry.name());
                foodItem.setHouseholdServingFullText("1 " + foodEntry.name());
                nutrients.add(new Nutrient(NutrientType.ENERGY, foodEntry.nutrients.energy_kcal()));
                nutrients.add(new Nutrient(NutrientType.PROTEIN, foodEntry.nutrients.protein_g()));
                nutrients.add(new Nutrient(NutrientType.CARBOHYDRATE, foodEntry.nutrients.carbs_g()));
                nutrients.add(new Nutrient(NutrientType.TOTAL_FAT, foodEntry.nutrients.fat_g()));
                nutrients.add(new Nutrient(NutrientType.FIBER, foodEntry.nutrients.fiber_g()));
                nutrients.add(new Nutrient(NutrientType.SODIUM, foodEntry.nutrients.sodium_mg()));
                nutrients.add(new Nutrient(NutrientType.SUGARS_TOTAL, foodEntry.nutrients.sugars_g()));
                foodItem.setNutrients(nutrients);

                System.out.println("Description: " + foodItem.getDescription());
                System.out.println("Serving Size: " + foodItem.getServingSize());
                System.out.println("Creator ID: " + foodItem.getCreatorID());
                System.out.println("Nutrients: " + foodItem.getNutrients().size());

                int foodId = foodDAO.insertFoodItem(foodItem);

                historyDAO.AddToHistory(user.id(), foodId, Timestamp.from(Instant.now()));

                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(gson.toJson(Map.of("message", "added food")));
        }
}
