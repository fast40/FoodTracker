package database.helpers;

import jakarta.servlet.http.HttpServletRequest;

import java.io.BufferedReader;
import java.io.IOException;

import com.google.gson.Gson;

public class RequestJsonParser {
        private static final Gson gson = new Gson();

        public static <T> T parse(HttpServletRequest request, Class<T> container) {
                StringBuilder jsonBuilder = new StringBuilder();

                try (BufferedReader reader = request.getReader()) {
                        String line;

                        while ((line = reader.readLine()) != null) {
                                jsonBuilder.append(line);
                        }
                } catch (IOException e) {
                        e.printStackTrace();
                }

                String json = jsonBuilder.toString();

                T data = gson.fromJson(json, container); 

                return data;
        }
}
