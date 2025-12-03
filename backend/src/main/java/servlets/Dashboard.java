package servlets;

import database.data_access.HistoryDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.time.Instant;
import java.sql.Timestamp;
import java.util.List;

import com.google.gson.JsonObject;

@WebServlet("/api/dashboard")
public class Dashboard extends HttpServlet {
    final String startRequest = "start"; //TODO - Ian define request parameter names here
    final String endRequest = "end"; // TODO - This one too
    final String userIDRequest = "userID";
    final String entryLimitRequest = "entryLimit";

    private Gson gson = new Gson();
    private HistoryDAO historyDAO = new HistoryDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JsonObject result = new JsonObject();
        PrintWriter out = response.getWriter();


        /* request schema
            UserID // Integer -- this can be changed to something else but we'd have to do a 2nd table lookup
            start timestamp // ISO 8601 Standard
            end timestamp // ISO 8601 Standard
         */

        result.addProperty("success", true); // why is this here so early -sid

        // read start date and end date from request
        // ISO 8601 Standard Timestamps
        // YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DDTHH:mm:ss.sss±HH:mm
        // this should be the default

        // query database for data
        String iso_start = request.getParameter(startRequest);
        String iso_end = request.getParameter(endRequest);

        Instant instant = Instant.parse(iso_start);
        Timestamp mysql_start = Timestamp.from(instant);

        instant = Instant.parse(iso_end);
        Timestamp mysql_end = Timestamp.from(instant);

        Integer userID = Integer.parseInt(request.getParameter(userIDRequest));

        String limitParam = request.getParameter(entryLimitRequest);
        Integer entryLimit = (limitParam != null) ? Integer.parseInt(limitParam) : 100;
        try {
            List<Integer> history = historyDAO.GetHistory(userID, mysql_start, mysql_end, entryLimit);
            out.write(gson.toJson(history));
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Database error\"}");
        }


        //TODO: construct a list of days, each with a list of foods (instead of returning via properties)
        //placeholder values to test but the values should be listed generically in nested json objects
        // Im leaving this here for you to test
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
