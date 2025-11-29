package servlets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import com.google.gson.JsonObject;

@WebServlet("/api/dashboard")
public class Dashboard extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		JsonObject result = new JsonObject();
		
		result.addProperty("success", true);
		
		//TODO: read start date and end date from request
		
		//TODO: query database for data
		
		//TODO: construct a list of days, each with a list of foods (instead of returning via properties)
		//placeholder values to test
		result.addProperty("calories", 800);
		result.addProperty("protein", 30);
		result.addProperty("carbohydrates", 222);
		result.addProperty("fat", 14);
		result.addProperty("sugar", 22);
		result.addProperty("fiber", 12);
		result.addProperty("sodium", 1200);

        response.setContentType("application/json");
        response.getWriter().write(result.toString());

		
        //response.setContentType("text/html;charset=UTF-8");
		//response.getWriter().println("show data viz page.");
	}
}
