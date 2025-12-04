package servlets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;
import java.security.Principal;

import com.google.gson.Gson;

@WebServlet("/api/me")
public class Me extends HttpServlet {
        private final Gson gson = new Gson();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
                Principal principal = request.getUserPrincipal();

                if (principal != null) {
                        response.setStatus(HttpServletResponse.SC_OK);
                        response.setContentType("application/json");
                        response.getWriter().write(gson.toJson(Map.of("username", request.getUserPrincipal().getName())));
                } else {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write(gson.toJson(Map.of("message", "There is no user currently logged in.")));
                }

	}
}

