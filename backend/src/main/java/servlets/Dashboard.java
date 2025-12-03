package servlets;

import database.data_access.FoodDAO;
import database.data_access.HistoryDAO;
import database.data_transfer.DailyFoodLog;
import database.data_transfer.LogEntry;
import database.wrappers.FoodItem;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import com.google.gson.JsonObject;

@WebServlet("/api/dashboard")
public class Dashboard extends HttpServlet {
    final String startRequest = "start"; //TODO - Ian define request parameter names here
    final String endRequest = "end"; // TODO - This one too
    final String userIDRequest = "userID";
    final String entryLimitRequest = "entryLimit";
    final String timezoneRequest = "timezone";

    private Gson gson = new Gson();
    private HistoryDAO historyDAO = new HistoryDAO();
    private FoodDAO foodDAO = new FoodDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JsonObject result = new JsonObject();
        PrintWriter out = response.getWriter();

        // @ Ian :D
        /* request schema
            UserID // Integer -- this can be changed to something else but we'd have to do a 2nd table lookup
            start timestamp // ISO 8601 Standard
            end timestamp // ISO 8601 Standard
            timezone // IANA timezone identifier
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
        String tzParam = request.getParameter(timezoneRequest);
        ZoneId userZone = (tzParam != null) ? ZoneId.of(tzParam) : ZoneId.of("UTC");


        List<LogEntry> history;
        Integer entryLimit = (limitParam != null) ? Integer.parseInt(limitParam) : 100;
        try {
            history = historyDAO.GetHistory(userID, mysql_start, mysql_end, entryLimit);
            Map<LocalDate, DailyFoodLog> dailyFoodLog = new LinkedHashMap<>();

            for (LogEntry log : history)  {
                FoodItem item = foodDAO.getFoodById(log.foodId());
                LocalDate localDate = log.date().toInstant().atZone(userZone).toLocalDate();
                dailyFoodLog.computeIfAbsent(localDate, date -> new DailyFoodLog(date.toString())).addFood(item);
            }

            List<DailyFoodLog> dailyHistory = new ArrayList<>(dailyFoodLog.values());
            String json = gson.toJson(dailyHistory);
            out.write(json);

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\": \"Database error\"}");
        }

        //placeholder values to test but the values should be listed generically in nested json objects
        /*
        result.addProperty("calories", 800);
        result.addProperty("protein", 30);
        result.addProperty("carbohydrates", 222);
        result.addProperty("fat", 14);
        result.addProperty("sugar", 22);
        result.addProperty("fiber", 12);
        result.addProperty("sodium", 1200);

        response.setContentType("application/json");
        response.getWriter().write(result.toString());
        */


        //response.setContentType("text/html;charset=UTF-8");
        //response.getWriter().println("show data viz page.");
    }
}
