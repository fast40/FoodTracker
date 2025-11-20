package database.wrappers;
import java.util.EnumSet;

public class FoodItem {
	// TO DO - Finish this
	public static enum NutrientTypes {
		calorie,
		trans_fat, saturated_fat,
		A,
		B1, B2, B3, B5, B6, B7, B9, B12; 
		public static final EnumSet<NutrientTypes> FAT = EnumSet.of(trans_fat, saturated_fat);
		public static final EnumSet<NutrientTypes> VITAMIN_A = EnumSet.of(A);
		public static final EnumSet<NutrientTypes> VITAMIN_B = EnumSet.of(B1, B1, B2, B3, B5, B6, B7, B9, B12);
	}
}