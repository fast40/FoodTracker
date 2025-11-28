CREATE TABLE nutrient_definitions (
    nutrient_id INT PRIMARY KEY, -- USDA Nutrient ID
    nutrient_number VARCHAR(10), -- USDA Nutrient Number (e.g. "203")
    name VARCHAR(255) NOT NULL,
    unit_name VARCHAR(20) NOT NULL, -- g, mg, kcal, etc.
    is_macronutrient BOOLEAN DEFAULT FALSE
);