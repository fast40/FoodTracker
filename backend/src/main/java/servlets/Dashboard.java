package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.Principal;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

import database.data_access.FoodDAO;
import database.data_access.HistoryDAO;
import database.data_access.UserDAO;
import database.data_transfer.DailyFoodLog;
import database.data_transfer.FoodLogEntry;
import database.data_transfer.LogEntry;
import database.data_transfer.User;
import database.helpers.RequestJsonParser;
import database.wrappers.FoodItem;
import database.wrappers.Nutrient;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/dashboard")
public class Dashboard extends HttpServlet {
    final String startRequest = "startDate";
    final String endRequest = "endDate";
    final String entryLimitRequest = "entryLimit";
    final String timezoneRequest = "timezone";

    private Gson gson = new Gson();
    private HistoryDAO historyDAO = new HistoryDAO();
    private FoodDAO foodDAO = new FoodDAO();

    private record RequestData (String startDate, String endDate, String timezone) {}

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Principal principal = request.getUserPrincipal();

        if (principal == null) {
                System.out.println("tried to add food with no user logged in"); 

                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write(gson.toJson(Map.of("message", "no user logged in")));

                return;
        }

        UserDAO userDAO = new UserDAO();
        User user = userDAO.getUserByUsername(principal.getName());

        RequestData requestData = RequestJsonParser.parse(request, RequestData.class);

        PrintWriter out = response.getWriter();

        // @ Ian :D
        /* request schema
            UserID // Integer -- this can be changed to something else but we'd have to do a 2nd table lookup
            start timestamp // ISO 8601 Standard
            end timestamp // ISO 8601 Standard
            timezone // IANA timezone identifier
         */

        // read start date and end date from request
        // ISO 8601 Standard Timestamps
        // YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DDTHH:mm:ss.sss±HH:mm
        // this should be the default

        // query database for data
        String iso_start = requestData.startDate();
        String iso_end = requestData.endDate();

        Instant instant = Instant.parse(iso_start);
        Timestamp mysql_start = Timestamp.from(instant);

        instant = Instant.parse(iso_end);
        Timestamp mysql_end = Timestamp.from(instant);

        String limitParam = null; // the frontend was never sending this anyway; this can be a todo item if it actually matters
        String tzParam = requestData.timezone();
        ZoneId userZone = (tzParam != null) ? ZoneId.of(tzParam) : ZoneId.of("UTC");

        List<LogEntry> history;
        Integer entryLimit = (limitParam != null) ? Integer.parseInt(limitParam) : 100;
        try {
            //get a log of all the foodIDs within the range
            history = historyDAO.GetHistory(user.id(), mysql_start, mysql_end, entryLimit);
            Map<LocalDate, DailyFoodLog> dailyFoodLog = new LinkedHashMap<>();

            //for each foodID, get the associated FoodItem
            for (LogEntry log : history)  {
                FoodItem item = foodDAO.getFoodById(log.foodId());
                LocalDate localDate = log.date().toInstant().atZone(userZone).toLocalDate();
                
                FoodLogEntry entry = new FoodLogEntry(
                    log.logId(),
                    item,
                    log.quantity(),
                    log.date().toInstant().toString(),
                    log.mealType()
                );

                dailyFoodLog.computeIfAbsent(localDate, date -> new DailyFoodLog(date.toString())).addFood(entry);
            }

            List<DailyFoodLog> dailyHistory = new ArrayList<>(dailyFoodLog.values());
            String json = gson.toJson(dailyHistory);
            System.out.printf("json: %s", json);
            out.write(json);        

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\": \"Database error\"}");
        }
    }
}
