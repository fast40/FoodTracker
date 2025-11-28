package database.helpers;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import database.wrappers.FoodItem;
import database.wrappers.Nutrient;
import io.github.cdimascio.dotenv.Dotenv;

public class USDAFoodAPI {
    private static String apiKey;
    private static final String BASE_URL = "https://api.nal.usda.gov/fdc/v1";
    private static HttpClient client = HttpClient.newHttpClient();

    static {
        // Try to load from .env file first
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            apiKey = dotenv.get("USDA_API_KEY");
        } catch (Exception e) {
            // Ignore if .env fails (e.g. in production)
        }

        // Fallback to System environment variable
        if (apiKey == null) {
            apiKey = System.getenv("USDA_API_KEY");
        }

        // Fallback to Demo key
        if (apiKey == null) {
            apiKey = "DEMO_KEY";
        }
    }

    public static void setApiKey(String key) {
        apiKey = key;
    }

    public static void setHttpClient(HttpClient httpClient) {
        client = httpClient;
    }

    public static FoodItem fetchFoodByGTIN(String gtinUpc) throws Exception {
        // 1. Search for the food by GTIN
        String query = URLEncoder.encode(gtinUpc, StandardCharsets.UTF_8);
        String searchUrl = String.format("%s/foods/search?query=%s&api_key=%s", BASE_URL, query, apiKey);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(searchUrl))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Failed to fetch data from USDA API: " + response.statusCode());
        }

        JsonObject jsonResponse = JsonParser.parseString(response.body()).getAsJsonObject();
        JsonArray foods = jsonResponse.getAsJsonArray("foods");

        if (foods.size() == 0) {
            return null; // Not found
        }

        // 2. Parse the first result
        JsonObject foodData = foods.get(0).getAsJsonObject();
        return parseFoodJson(foodData);
    }

    private static FoodItem parseFoodJson(JsonObject foodData) {
        FoodItem item = new FoodItem();
        
        item.setFdcId(foodData.get("fdcId").getAsInt());
        item.setDescription(foodData.get("description").getAsString());
        item.setDataType(foodData.has("dataType") ? foodData.get("dataType").getAsString() : "Unknown");
        item.setBrandOwner(foodData.has("brandOwner") ? foodData.get("brandOwner").getAsString() : null);
        item.setGtinUpc(foodData.has("gtinUpc") ? foodData.get("gtinUpc").getAsString() : null);
        
        if (foodData.has("servingSize")) {
            item.setServingSize(foodData.get("servingSize").getAsFloat());
        }
        if (foodData.has("servingSizeUnit")) {
            item.setServingSizeUnit(foodData.get("servingSizeUnit").getAsString());
        }
        if (foodData.has("householdServingFullText")) {
            item.setHouseholdServingFullText(foodData.get("householdServingFullText").getAsString());
        }

        // Parse Nutrients
        List<Nutrient> nutrients = new ArrayList<>();
        if (foodData.has("foodNutrients")) {
            JsonArray nutrientArray = foodData.getAsJsonArray("foodNutrients");
            for (JsonElement elem : nutrientArray) {
                JsonObject n = elem.getAsJsonObject();
                
                int nutrientId = n.has("nutrientId") ? n.get("nutrientId").getAsInt() : 0;
                String name = n.has("nutrientName") ? n.get("nutrientName").getAsString() : "";
                String number = n.has("nutrientNumber") ? n.get("nutrientNumber").getAsString() : "";
                float amount = n.has("value") ? n.get("value").getAsFloat() : 0f;
                String unitName = n.has("unitName") ? n.get("unitName").getAsString() : "";

                nutrients.add(new Nutrient(nutrientId, name, number, amount, unitName));
            }
        }
        item.setNutrients(nutrients);

        return item;
    }
}
