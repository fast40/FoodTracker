package database.wrappers;

import database.helpers.Enumerations;

public class Nutrient {
    private int nutrientId;
    private String name;
    private String number; // USDA nutrient number (e.g. "203")
    private float amount;
    private String unitName;

    public Nutrient(Enumerations.NutrientType nutrientType, float amount) {
        this.nutrientId = nutrientType.getId();
        // this.number = nutrientType.getNumber(); not implemented
        this.name = nutrientType.getName();
        this.unitName = nutrientType.getUnit();
        this.amount =  amount;
    }
    public Nutrient(int nutrientId, String name, String number, float amount, String unitName) {
        this.nutrientId = nutrientId;
        this.name = name;
        this.number = number;
        this.amount = amount;
        this.unitName = unitName;
    }

    // Setters / Getters
    public int getNutrientId() { return nutrientId; }
    public String getName() { return name; }
    public String getNumber() { return number; }
    public void setNutrientNumber(String nutrient) {number = nutrient;}
    public void setAmount(float amount) {this.amount = amount;}
    public float getAmount() { return amount; }
    public String getUnitName() { return unitName; }
}
