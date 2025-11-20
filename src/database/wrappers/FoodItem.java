package database.wrappers;
import java.util.EnumSet;

public class FoodItem {
	// TO DO - Finish this
	public static enum NutrientTypes {
		CALORIES,
		trans_fat, saturated_fat,
		A, B1, B2, B3, B5, B6, B7, B9, B12, C, D, D2, D3, E, K,
		calcium, iron, potassium,
		CHOLESTEROL,
		SODIUM,
		PROTEIN,
		total_sugar, added_sugar, dietary_fiber;

		public static final EnumSet<NutrientTypes> FAT = EnumSet.of(trans_fat, saturated_fat);
		public static final EnumSet<NutrientTypes> VITAMINS = EnumSet.of(A, B1, B1, B2, B3, B5, B6, B7, B9, B12, C, D, D2, D3, E, K);
		public static final EnumSet<NutrientTypes> MINERALS = EnumSet.of(calcium, iron, potassium);
		public static final EnumSet<NutrientTypes> CARBOHYDRATES = EnumSet.of(total_sugar, added_sugar, dietary_fiber);
	}
}