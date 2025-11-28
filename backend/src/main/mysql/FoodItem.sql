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