--Custom Foods (User Generated)
CREATE TABLE food_nutrient_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_id INT NOT NULL,
    nutrient_id INT NOT NULL,
    amount FLOAT NOT NULL,
    
    FOREIGN KEY (food_id) REFERENCES food_items(food_id) ON DELETE CASCADE,
    FOREIGN KEY (nutrient_id) REFERENCES nutrient_definitions(nutrient_id) ON DELETE CASCADE,
    UNIQUE(food_id, nutrient_id)
);
