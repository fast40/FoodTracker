package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import database.data_access.DatabaseConnection;
import database.helpers.RequestJsonParser;

@WebServlet("/api/register")
public class Register extends HttpServlet {

        private final class RegisterForm {
                public String username;
                public String email;
                public String password;
        }

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().println("register a new user account.");
	}

        @Override
        public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
                RegisterForm registerForm = RequestJsonParser.parse(request, RegisterForm.class);

                System.out.println(registerForm.username);
                System.out.println(registerForm.email);
                System.out.println(registerForm.password);

                try (
                        Connection conn = DatabaseConnection.getConnection();
                        PreparedStatement checkUser = conn.prepareStatement("SELECT username FROM users WHERE username = ?");
                        PreparedStatement addUser = conn.prepareStatement("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
                        PreparedStatement addRole = conn.prepareStatement("INSERT INTO user_roles (username) VALUES (?)");
                ) {
                        checkUser.setString(1, registerForm.username);

                        try (ResultSet rs = checkUser.executeQuery()) {
                                if (rs.next()) {
                                        // TODO: return json (username taken)
                                        System.out.println("username taken");
                                        return;
                                }
                        }

                        addUser.setString(1, registerForm.username);
                        addUser.setString(2, registerForm.email);
                        addUser.setString(3, registerForm.password);

                        addRole.setString(1, registerForm.username);

                        addUser.executeUpdate();
                        addRole.executeUpdate();

                        request.login(registerForm.username, registerForm.password);
                        System.out.printf("username: %s email: %s password: %s\n", registerForm.username, registerForm.email, registerForm.password);

                        // TODO: return some json (success)
                } catch (SQLException e) {
                        e.printStackTrace();

                        response.sendRedirect(request.getContextPath() + "/login");
                }
        }
}
