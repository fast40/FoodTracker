package servlets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/register")
public class Register extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().println("register a new user account.");
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
                String username = request.getParameter("username");
                String password = request.getParameter("password");

		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().printf("{\"username\": \"%s\", \"password\": \"%s\"}\n", username, password);
	}
}
