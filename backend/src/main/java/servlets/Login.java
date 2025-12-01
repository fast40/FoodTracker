package servlets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;

import com.google.gson.Gson;

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
                StringBuilder jsonBuilder = new StringBuilder();

                try (BufferedReader reader = request.getReader()) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                                jsonBuilder.append(line);
                        }
                }

                String json = jsonBuilder.toString();
                LoginForm loginForm = gson.fromJson(json, LoginForm.class);

                try {
                        request.login(loginForm.username, loginForm.password);
                        System.out.println("logged the user in");
                        System.out.printf("username: %s, password: %s", loginForm.username, loginForm.password);
                } catch (Exception e) {
                        e.printStackTrace();
                }
	}
}
