package database.helpers;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Test
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import database.wrappers.FoodItem;

public class USDAFoodAPITest {

    private HttpClient mockClient;
    private HttpResponse<String> mockResponse;

    @SuppressWarnings("unchecked")
    @Before
    public void setUp() {
        mockClient = mock(HttpClient.class);
        mockResponse = mock(HttpResponse.class);
        USDAFoodAPI.setHttpClient(mockClient);
        USDAFoodAPI.setApiKey("TEST_KEY");
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testFetchFoodByGTIN_Success() throws Exception {
        String jsonResponse = """
                {
                  "foods": [
                    {
                      "fdcId": 123456,
                      "description": "Test Food Item",
                      "dataType": "Branded",
                      "brandOwner": "Test Brand",
                      "gtinUpc": "0123456789",
                      "servingSize": 100.0,
                      "servingSizeUnit": "g",
                      "foodNutrients": [
                        {
                          "nutrientId": 1003,
                          "nutrientName": "Protein",
                          "value": 10.5,
                          "unitName": "g"
                        }
                      ]
                    }
                  ]
                }""";

        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn(jsonResponse);
        when(mockClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockResponse);

        FoodItem item = USDAFoodAPI.fetchFoodByGTIN("0123456789");

        assertNotNull(item);
        assertEquals(Integer.valueOf(123456), item.getFdcId());
        assertEquals("Test Food Item", item.getDescription());
        assertEquals("Test Brand", item.getBrandOwner());
        assertEquals(1, item.getNutrients().size());
        assertEquals("Protein", item.getNutrients().get(0).getName());
        assertEquals(10.5f, item.getNutrients().get(0).getAmount(), 0.01f);
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testFetchFoodByGTIN_NotFound() throws Exception {
        String jsonResponse = "{\"foods\": []}";

        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn(jsonResponse);
        when(mockClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockResponse);

        FoodItem item = USDAFoodAPI.fetchFoodByGTIN("0000000000");

        assertEquals(null, item);
    }

    /*@Test
    public void testFetchFoodByGTIN_Integration_RealAPI() throws Exception {
        // Use a real HTTP client for this test
        USDAFoodAPI.setHttpClient(HttpClient.newHttpClient());
        
        // Reset API Key to real key (or DEMO_KEY) for integration test
        String envKey = System.getenv("USDA_API_KEY");
        if (envKey != null && !envKey.isEmpty()) {
            USDAFoodAPI.setApiKey(envKey);
        } else {
            USDAFoodAPI.setApiKey("DEMO_KEY");
        }
        
        // Use a known valid GTIN (Cheddar Cheese)
        // Note: This relies on the DEMO_KEY or a valid env var being set
        String validGtin = "828653282457"; 
        
        FoodItem item = USDAFoodAPI.fetchFoodByGTIN(validGtin);

        assertNotNull("Should return a food item for valid GTIN", item);
        assertEquals("828653282457", item.getGtinUpc());
        assertEquals(Integer.valueOf(2095236), item.getFdcId());
        assertEquals("CHEDDAR CHEESE", item.getDescription());
        assertEquals("Branded", item.getDataType());
        assertEquals("MDS Foods Inc.", item.getBrandOwner());
        assertEquals(28.0f, item.getServingSize(), 0.01f);
        assertEquals("g", item.getServingSizeUnit());
        assertEquals("1 ONZ", item.getHouseholdServingFullText());

        // Verify Nutrients
        assertNotNull(item.getNutrients());
        assertEquals(10, item.getNutrients().size()); // Based on the API response seen

        // Helper to find nutrient by ID
        java.util.Map<Integer, database.wrappers.Nutrient> nutrientMap = new java.util.HashMap<>();
        for (database.wrappers.Nutrient n : item.getNutrients()) {
            nutrientMap.put(n.getNutrientId(), n);
        }

        // Protein (ID 1003)
        assertTrue(nutrientMap.containsKey(1003));
        assertEquals("Protein", nutrientMap.get(1003).getName());
        assertEquals(25.0f, nutrientMap.get(1003).getAmount(), 0.01f);
        assertEquals("G", nutrientMap.get(1003).getUnitName());

        // Total lipid (fat) (ID 1004)
        assertTrue(nutrientMap.containsKey(1004));
        assertEquals(35.7f, nutrientMap.get(1004).getAmount(), 0.01f);

        // Energy (ID 1008)
        assertTrue(nutrientMap.containsKey(1008));
        assertEquals(432.0f, nutrientMap.get(1008).getAmount(), 0.01f);
        assertEquals("KCAL", nutrientMap.get(1008).getUnitName());

        // Sodium (ID 1093)
        assertTrue(nutrientMap.containsKey(1093));
        assertEquals(686.0f, nutrientMap.get(1093).getAmount(), 0.01f);
        assertEquals("MG", nutrientMap.get(1093).getUnitName());
    }*/
}
