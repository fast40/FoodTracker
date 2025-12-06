package servlets;

import java.io.IOException;
import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

import database.data_access.FoodDAO;
import database.data_access.HistoryDAO;
import database.data_access.UserDAO;
import database.data_transfer.User;
import database.helpers.Enumerations;
import database.helpers.Enumerations.NutrientType;
import database.helpers.RequestJsonParser;
import database.wrappers.FoodItem;
import database.wrappers.Nutrient;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/log-item")
public class LogItem extends HttpServlet {
        Gson gson = new Gson();

        private final record FoodEntry(String name, float servings, Map<String, Float> nutrients) { }
        
        private static final Map<String, NutrientType> NUTRIENT_KEY_MAP = new HashMap<>();
        static {
            NUTRIENT_KEY_MAP.put("energy_kcal", NutrientType.ENERGY);
            NUTRIENT_KEY_MAP.put("protein_g", NutrientType.PROTEIN);
            NUTRIENT_KEY_MAP.put("carbs_g", NutrientType.CARBOHYDRATE);
            NUTRIENT_KEY_MAP.put("fat_g", NutrientType.TOTAL_FAT);
            NUTRIENT_KEY_MAP.put("fiber_g", NutrientType.FIBER);
            NUTRIENT_KEY_MAP.put("sodium_mg", NutrientType.SODIUM);
            NUTRIENT_KEY_MAP.put("sugars_g", NutrientType.SUGARS_TOTAL);
        }

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
                
                if (foodEntry.nutrients() != null) {
                    for (Map.Entry<String, Float> entry : foodEntry.nutrients().entrySet()) {
                        NutrientType type = NUTRIENT_KEY_MAP.get(entry.getKey());
                        if (type != null && entry.getValue() != null) {
                            nutrients.add(new Nutrient(type, entry.getValue()));
                        }
                    }
                }
                
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
