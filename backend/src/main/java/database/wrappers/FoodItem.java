package database.wrappers;

import java.util.ArrayList;
import java.util.List;

// public record FoodItem (int foodId, String name, List<Nutrient> nutrients) {}

public class FoodItem {
    private Integer foodId; // Database ID
    private Integer fdcId; // USDA ID
    private String description;
    private String dataType; // 'Branded', 'Foundation', etc.
    private String brandOwner;
    private String gtinUpc;
    private Float servingSize;
    private String servingSizeUnit;
    private String householdServingFullText;
    private Integer createdBy;
    private List<Nutrient> nutrients = new ArrayList<>();

    public FoodItem() {}

    public FoodItem(String description, String gtinUpc) {
        this.description = description;
        this.gtinUpc = gtinUpc;
    }

    // Getters and Setters
    public Integer getFoodId() { return foodId; }
    public void setFoodId(Integer foodId) { this.foodId = foodId; }

    public Integer getFdcId() { return fdcId; }
    public void setFdcId(Integer fdcId) { this.fdcId = fdcId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }

    public String getBrandOwner() { return brandOwner; }
    public void setBrandOwner(String brandOwner) { this.brandOwner = brandOwner; }

    public String getGtinUpc() { return gtinUpc; }
    public void setGtinUpc(String gtinUpc) { this.gtinUpc = gtinUpc; }

    public Float getServingSize() { return servingSize; }
    public void setServingSize(Float servingSize) { this.servingSize = servingSize; }

    public String getServingSizeUnit() { return servingSizeUnit; }
    public void setServingSizeUnit(String servingSizeUnit) { this.servingSizeUnit = servingSizeUnit; }

    public String getHouseholdServingFullText() { return householdServingFullText; }
    public void setHouseholdServingFullText(String householdServingFullText) { this.householdServingFullText = householdServingFullText; }

    public Integer getCreatorID() { return this.createdBy; }
    public void setCreatorID(Integer creator) {this.createdBy = creator; }

    public List<Nutrient> getNutrients() { return nutrients; }
    public void setNutrients(List<Nutrient> nutrients) { this.nutrients = nutrients; }
    public void addNutrient(Nutrient nutrient) { this.nutrients.add(nutrient); }
}
