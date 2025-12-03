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

    public enum NutrientType {
        // Proximates
        PROTEIN(1003, "Protein", "g"),
        TOTAL_FAT(1004, "Total lipid (fat)", "g"),
        CARBOHYDRATE(1005, "Carbohydrate, by difference", "g"),
        ENERGY(1008, "Energy", "kcal"),
        ALCOHOL(1018, "Alcohol, ethyl", "g"),
        WATER(1051, "Water", "g"),
        CAFFEINE(1057, "Caffeine", "mg"),
        THEOBROMINE(1058, "Theobromine", "mg"),
        SUGARS_TOTAL(2000, "Sugars, total", "g"),
        FIBER(1079, "Fiber, total dietary", "g"),

        // Minerals
        CALCIUM(1087, "Calcium, Ca", "mg"),
        IRON(1089, "Iron, Fe", "mg"),
        MAGNESIUM(1090, "Magnesium, Mg", "mg"),
        PHOSPHORUS(1091, "Phosphorus, P", "mg"),
        POTASSIUM(1092, "Potassium, K", "mg"),
        SODIUM(1093, "Sodium, Na", "mg"),
        ZINC(1095, "Zinc, Zn", "mg"),
        COPPER(1098, "Copper, Cu", "mg"),
        SELENIUM(1103, "Selenium, Se", "µg"),

        // Vitamins
        RETINOL(1105, "Retinol", "µg"),
        VITAMIN_A_RAE(1106, "Vitamin A, RAE", "µg"),
        CAROTENE_BETA(1107, "Carotene, beta", "µg"),
        CAROTENE_ALPHA(1108, "Carotene, alpha", "µg"),
        VITAMIN_E(1109, "Vitamin E (alpha-tocopherol)", "mg"),
        VITAMIN_D(1114, "Vitamin D (D2 + D3)", "µg"),
        CRYPTOXANTHIN_BETA(1120, "Cryptoxanthin, beta", "µg"),
        LYCOPENE(1122, "Lycopene", "µg"),
        LUTEIN_ZEAXANTHIN(1123, "Lutein + zeaxanthin", "µg"),
        VITAMIN_C(1162, "Vitamin C, total ascorbic acid", "mg"),
        THIAMIN(1165, "Thiamin", "mg"),
        RIBOFLAVIN(1166, "Riboflavin", "mg"),
        NIACIN(1167, "Niacin", "mg"),
        VITAMIN_B6(1175, "Vitamin B-6", "mg"),
        FOLATE_TOTAL(1177, "Folate, total", "µg"),
        VITAMIN_B12(1178, "Vitamin B-12", "µg"),
        CHOLINE(1180, "Choline, total", "mg"),
        VITAMIN_K(1185, "Vitamin K (phylloquinone)", "µg"),
        FOLIC_ACID(1186, "Folic acid", "µg"),
        FOLATE_FOOD(1187, "Folate, food", "µg"),
        FOLATE_DFE(1190, "Folate, DFE", "µg"),
        VITAMIN_E_ADDED(1242, "Vitamin E, added", "mg"),
        VITAMIN_B12_ADDED(1246, "Vitamin B-12, added", "µg"),

        // Lipids
        CHOLESTEROL(1253, "Cholesterol", "mg"),
        FATTY_ACIDS_SATURATED(1258, "Fatty acids, total saturated", "g"),
        FATTY_ACID_4_0(1259, "4:0 Butyric acid", "g"),
        FATTY_ACID_6_0(1260, "6:0 Caproic acid", "g"),
        FATTY_ACID_8_0(1261, "8:0 Caprylic acid", "g"),
        FATTY_ACID_10_0(1262, "10:0 Capric acid", "g"),
        FATTY_ACID_12_0(1263, "12:0 Lauric acid", "g"),
        FATTY_ACID_14_0(1264, "14:0 Myristic acid", "g"),
        FATTY_ACID_16_0(1265, "16:0 Palmitic acid", "g"),
        FATTY_ACID_18_0(1266, "18:0 Stearic acid", "g"),
        FATTY_ACID_18_1(1268, "18:1 Oleic acid", "g"),
        FATTY_ACID_18_2(1269, "18:2 Linoleic acid", "g"),
        FATTY_ACID_18_3(1270, "18:3 Linolenic acid", "g"),
        FATTY_ACID_20_4(1271, "20:4 Arachidonic acid", "g"),
        FATTY_ACID_22_6_DHA(1272, "22:6 n-3 DHA", "g"),
        FATTY_ACID_16_1(1275, "16:1 Palmitoleic acid", "g"),
        FATTY_ACID_18_4(1276, "18:4 Parinaric acid", "g"),
        FATTY_ACID_20_1(1277, "20:1 Gadoleic acid", "g"),
        FATTY_ACID_20_5_EPA(1278, "20:5 n-3 EPA", "g"),
        FATTY_ACID_22_1(1279, "22:1 Erucic acid", "g"),
        FATTY_ACID_22_5_DPA(1280, "22:5 n-3 DPA", "g"),
        FATTY_ACIDS_MONOUNSATURATED(1292, "Fatty acids, total monounsaturated", "g"),
        FATTY_ACIDS_POLYUNSATURATED(1293, "Fatty acids, total polyunsaturated", "g");

        private final int id;
        private final String name;
        private final String unit;

        NutrientType(int id, String name, String unit) {
            this.id = id;
            this.name = name;
            this.unit = unit;
        }

        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getUnit() {
            return unit;
        }

        // Lookup by USDA nutrient ID
        public static NutrientType fromId(int id) {
            for (NutrientType type : values()) {
                if (type.id == id) {
                    return type;
                }
            }
            return null;
        }
    }
}
