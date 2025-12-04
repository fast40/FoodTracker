package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import com.google.gson.Gson;

import database.helpers.RequestJsonParser;

@WebServlet("/api/login")
public class Login extends HttpServlet {

        private final Gson gson = new Gson();

        private final class LoginForm {
                public String username;
                public String password;
        }

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().println("log the user in.");
	}

        @Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
                LoginForm loginForm = RequestJsonParser.parse(request, LoginForm.class);

                // TODO: if loginForm is null we're going to have a bad time

                String responseJson;

                try {
                        request.getSession(true);
                        request.login(loginForm.username, loginForm.password);
                        response.setStatus(HttpServletResponse.SC_OK);
                        responseJson = gson.toJson(java.util.Map.of("username", loginForm.username));

                        System.out.printf("logged user in with username: %s, password: %s\n", loginForm.username, loginForm.password);

                } catch (ServletException e) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        responseJson = gson.toJson(java.util.Map.of("message", "Invalid username or password"));

                        e.printStackTrace();
                }

                System.out.printf("Sending: %s\n", responseJson);

                response.setContentType("application/json");
                response.getWriter().write(responseJson);
	}
}
