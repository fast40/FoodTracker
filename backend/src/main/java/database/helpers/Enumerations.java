package database.helpers;

public class Enumerations {
    public enum MealType {
        EMPTY("empty", 0),
        BREAKFAST("breakfast", 1),
        LUNCH("lunch", 2),
        DINNER("dinner", 3),
        SNACK("snack", 4);

        private final String sql_string;
        private final int sql_code;

        MealType(String name, int code) {
            this.sql_string = name;
            this.sql_code = code;
        }

        public String GetName() {
            return this.sql_string;
        }

        public int GetID() {
            return this.sql_code;
        }
    }

    // TODO - add enumeration connecting NutrientIDs
}
