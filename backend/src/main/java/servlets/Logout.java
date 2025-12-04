package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

import com.google.gson.Gson;

@WebServlet("/api/logout")
public class Logout extends HttpServlet {

        Gson gson = new Gson();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
                try {
                        request.logout();

                        response.setStatus(HttpServletResponse.SC_OK);
                        response.setContentType("application/json");
                        response.getWriter().write(gson.toJson(Map.of("message", "Logged the user out")));
                } catch (ServletException e) {
                        e.printStackTrace();

                        response.setContentType("application/json");
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        response.getWriter().write(gson.toJson(Map.of("message", "Some error occurred")));
                }
	}
}

