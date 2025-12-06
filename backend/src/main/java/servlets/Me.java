package servlets;

import java.io.IOException;
import java.security.Principal;
import java.util.Map;

import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/me")
public class Me extends HttpServlet {
        private final Gson gson = new Gson();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
                Principal principal = request.getUserPrincipal();

                if (principal != null) {
                        database.data_access.UserDAO userDAO = new database.data_access.UserDAO();
                        database.data_transfer.User user = userDAO.getUserByUsername(principal.getName());
                        
                        response.setStatus(HttpServletResponse.SC_OK);
                        response.setContentType("application/json");
                        response.getWriter().write(gson.toJson(user));
                } else {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write(gson.toJson(Map.of("message", "There is no user currently logged in.")));
                }

	}
}

