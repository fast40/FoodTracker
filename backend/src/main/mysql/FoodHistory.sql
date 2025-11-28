CREATE TABLE food_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity FLOAT NOT NULL DEFAULT 1.0, -- Number of servings
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    meal_type VARCHAR(20), -- Breakfast, Lunch, Dinner, Snack
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food_items(food_id) ON DELETE CASCADE
);
