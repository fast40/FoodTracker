package database.wrappers;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public class FoodItem {
	// TO DO - Finish this
	public static enum NutrientType {
		CALORIES,
		trans_fat, saturated_fat,
		A, B1, B2, B3, B5, B6, B7, B9, B12, C, D, D2, D3, E, K,
		calcium, iron, potassium,
		CHOLESTEROL,
		SODIUM,
		PROTEIN,
		total_sugar, added_sugar, dietary_fiber;

		public static final EnumSet<NutrientType> FAT = EnumSet.of(trans_fat, saturated_fat);
		public static final EnumSet<NutrientType> VITAMINS = EnumSet.of(A, B1, B1, B2, B3, B5, B6, B7, B9, B12, C, D, D2, D3, E, K);
		public static final EnumSet<NutrientType> MINERALS = EnumSet.of(calcium, iron, potassium);
		public static final EnumSet<NutrientType> CARBOHYDRATES = EnumSet.of(total_sugar, added_sugar, dietary_fiber);
	}
	// Member Variables
	// I preface my private members with "m" out of habit from another class
	// - Sid
	private char[] mItemID = new char[32];
	private char[] mOwnerID = new char[32];
	private String mName;
	private Map<NutrientType, Float> mNutrients = new HashMap<>();

	// Functions
	public FoodItem(String name, char[] foodID, char[] ownerID) {
		mName = name;
		mItemID = foodID;
		mOwnerID = ownerID;
	}
	public void SetName(String newName){
		mName = newName;
	}
	public String GetName() {return mName;}

	// Helper Functions
	private boolean PullNutrientData() {
		// return true on successfully pulling data from database else false
		// TO DO
		return false;
	}


}