package database.wrappers;

public class Nutrient {
    private int nutrientId;
    private String name;
    private String number; // USDA nutrient number (e.g. "203")
    private float amount;
    private String unitName;

    public Nutrient(int nutrientId, String name, String number, float amount, String unitName) {
        this.nutrientId = nutrientId;
        this.name = name;
        this.number = number;
        this.amount = amount;
        this.unitName = unitName;
    }

    public int getNutrientId() { return nutrientId; }
    public String getName() { return name; }
    public String getNumber() { return number; }
    public float getAmount() { return amount; }
    public String getUnitName() { return unitName; }
}
