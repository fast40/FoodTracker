CREATE DATABASE IF NOT EXISTS food_tracker;
USE food_tracker;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(320) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dark_mode BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT FALSE,
    language_code VARCHAR(10) DEFAULT 'en-US',
    show_calories BOOLEAN DEFAULT TRUE,
    daily_calorie_goal INT DEFAULT 2000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    username VARCHAR(64) PRIMARY KEY,
    role VARCHAR(64) NOT NULL DEFAULT 'USER'
);

CREATE TABLE food_items (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    fdc_id INT UNIQUE, -- USDA ID. UNIQUE ensures we only store one copy of each USDA food.
    description VARCHAR(255) NOT NULL,
    data_type VARCHAR(50), -- 'Branded', 'Foundation', 'SR Legacy', 'User'
    brand_owner VARCHAR(100),
    gtin_upc VARCHAR(20), -- Barcode
    serving_size FLOAT,
    serving_size_unit VARCHAR(20),
    household_serving_full_text VARCHAR(100), -- e.g. "1 cup"
    created_by INT, -- NULL for USDA/API foods (Read-Only). Set to user_id for user-created foods.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_gtin (gtin_upc) -- Optimization for looking up foods by barcode scan
);

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

-- Custom Foods (User Generated)
CREATE TABLE food_nutrient_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_id INT NOT NULL,
    nutrient_id INT NOT NULL,
    amount FLOAT NOT NULL,

    FOREIGN KEY (food_id) REFERENCES food_items(food_id) ON DELETE CASCADE,
    UNIQUE(food_id, nutrient_id)
);

