package database.data_transfer;

import database.wrappers.FoodItem;

import java.util.ArrayList;
import java.util.List;

public class DailyFoodLog {
    private String date;
    private List<FoodItem> foods;

    public DailyFoodLog(String date) {
        this.date = date;
        this.foods = new ArrayList<FoodItem>();
    }

    public synchronized void addFood(FoodItem food) {
        foods.add(food);
    }

    public String getDate() { return date; }
    public List<FoodItem> getFoods() { return foods; }
}
