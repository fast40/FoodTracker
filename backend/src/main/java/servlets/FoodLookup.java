package servlets;

import java.io.IOException;
import java.io.PrintWriter;

import com.google.gson.Gson;

import database.data_access.FoodDAO;
import database.helpers.USDAFoodAPI;
import database.wrappers.FoodItem;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/food-lookup")
public class FoodLookup extends HttpServlet {

    private final Gson gson = new Gson();
    FoodDAO foodDAO = new FoodDAO();


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Enable CORS for frontend development
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String gtin = request.getParameter("gtin");
        if (gtin == null || gtin.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Missing GTIN parameter")));
            return;
        }

        try {
            FoodItem foodItem = null;

            // TODO: Database Lookup (Commented out as DB is not set up)
            /*
            // GTIN = barcode
            // Check if food exists in our DB first to avoid API call

            foodItem = FoodDatabaseHelper.getFoodByGTIN(gtin);
            if (foodItem != null) {
                out.print(gson.toJson(foodItem));
                return;
            }
            */


            // API Lookup
            foodItem = USDAFoodAPI.fetchFoodByGTIN(gtin);

            if (foodItem != null) {
                // TODO: Save to Database (Commented out as DB is not set up)
                /*
                // Cache the result in our DB for future lookups
                FoodDatabaseHelper.saveFoodItem(foodItem);
                */

                out.print(gson.toJson(foodItem));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(new ErrorResponse("Food not found for GTIN: " + gtin)));
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error fetching food data: " + e.getMessage())));
            e.printStackTrace();
        }
    }

    private static class ErrorResponse {
        @SuppressWarnings("unused")
        String error;

        ErrorResponse(String error) {
            this.error = error;
        }
    }
}
