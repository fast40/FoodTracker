package servlets;

import java.io.IOException;
import java.security.Principal;
import java.util.Map;

import com.google.gson.Gson;

import database.data_access.UserDAO;
import database.data_transfer.FoodLogEntry;
import database.data_transfer.User;
import database.helpers.RequestJsonParser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import services.FoodService;

@WebServlet("/api/log-item")
public class LogItem extends HttpServlet {
        Gson gson = new Gson();
        FoodService foodService = new FoodService();

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

                // Parse the Unified FoodLogEntry directly
                FoodLogEntry logEntry = RequestJsonParser.parse(request, FoodLogEntry.class);
                
                foodService.logFood(user.id(), logEntry);

                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(gson.toJson(Map.of("message", "added food")));
        }
}
