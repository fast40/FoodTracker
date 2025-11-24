package servlets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import com.google.gson.JsonObject;

@WebServlet("/api/data-viz")
public class DataViz extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		JsonObject result = new JsonObject();
        result.addProperty("message", "successfully queried data-viz servlet!");
        response.setContentType("application/json");
        response.getWriter().write(result.toString());
	}
}
