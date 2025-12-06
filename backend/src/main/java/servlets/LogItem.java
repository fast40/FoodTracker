package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

import database.data_access.FoodDAO;
import database.data_access.HistoryDAO;
import database.data_access.UserDAO;
import database.data_transfer.User;
import database.helpers.Enumerations;
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

                FoodDAO foodDAO = new FoodDAO();
                HistoryDAO historyDAO = new HistoryDAO();

                FoodItem foodItem = new FoodItem();
                List<Nutrient> nutrients = new ArrayList<>();

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

                historyDAO.AddToHistory(user.id(), foodId, foodEntry.servings(), Enumerations.MealType.BREAKFAST, Timestamp.from(Instant.now()));

                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(gson.toJson(Map.of("message", "added food")));
        }
}
