// Helper Classes
// SizedStack<T> extends Stack<T>
// Login
// bool VerifyLogin(string UserName, string Password)
// User (Wrapper)
// — Variables —

// — Methods —
// SizedStack<FoodItem> SendFoodHistory(int start = 0, int end = 10)
// FoodItem Class (Item Wrapper)
// — Variables —
// static enum nutrientType
// string ItemName
// char[32] ItemID
// vector<pair<nutrientType, float>> NutritionInfo


package database.wrappers;

import database.helpers.SizedStack;

public class User {
	private char[] UserID = new char[32];
	private String Username;

	public SizedStack<FoodItem> GetFoodHistory() {GetFoodHistory(0, 10)}
	public SizedStack<FoodItem> GetFoodHistory(int start, int end) {
		SizedStack<FoodItem> history = new SizedStack<>(end - start);\
		// TO DO
		return history;
	}
}