package database.helpers;

import database.data_access.FoodDAO;
import database.wrappers.FoodItem;

import java.util.List;

public class FoodService {
    private FoodDAO food_dao;

    public FoodService() {
        this.food_dao = new FoodDAO();
    }

    public List<FoodItem> search
}
