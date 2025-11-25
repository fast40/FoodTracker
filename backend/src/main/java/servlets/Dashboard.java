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
		
		//placeholder values to test
		result.addProperty("calories", 2000);
		result.addProperty("protein", 50);
		result.addProperty("carbohydrates", 275);
		result.addProperty("fat", 78);
		result.addProperty("sugar", 50);
		result.addProperty("fiber", 28);
		result.addProperty("sodium", 2300);
        
        response.setContentType("application/json");
        response.getWriter().write(result.toString());
		
        //response.setContentType("text/html;charset=UTF-8");
		//response.getWriter().println("show data viz page.");
	}
}
