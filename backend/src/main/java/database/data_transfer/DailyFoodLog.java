package database.data_transfer;

import database.wrappers.FoodItem;

import java.util.ArrayList;
import java.util.List;

public class DailyFoodLog {
    private String date;
    private List<FoodLogEntry> foods;

    public DailyFoodLog(String date) {
        this.date = date;
        this.foods = new ArrayList<FoodLogEntry>();
    }

    public void addFood(FoodLogEntry food) {
        foods.add(food);
    }

    public String getDate() { return date; }
    public List<FoodLogEntry> getFoods() { return foods; }
}
