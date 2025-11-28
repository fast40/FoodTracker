-- User Generated Data

CREATE TABLE food_data (
    food_id INT UNIQUE PRIMARY KEY NOT NULL,
    created_by INT FOREIGN KEY DEFAULT NULL, -- UserID
    calories INT DEFAULT 0,
    total_fat INT DEFAULT 0,
    trans_fat INT DEFAULT 0,
    saturated_fat INT DEFAULT 0,
    vitamin_a INT DEFAULT 0,
    vitamin_b1 INT DEFAULT 0,
    vitamin_b2 INT DEFAULT 0,
    vitamin_b3 INT DEFAULT 0,
    vitamin_b5 INT DEFAULT 0,
    vitamin_b6 INT DEFAULT 0,
    vitamin_b7 INT DEFAULT 0,
    vitamin_b9 INT DEFAULT 0,
    vitamin_b12 INT DEFAULT 0,
    vitamin_c INT DEFAULT 0,
    vitamin_d INT DEFAULT 0,
    vitamin_d2 INT DEFAULT 0,
    vitamin_d3 INT DEFAULT 0,
    vitamin_e INT DEFAULT 0,
    vitamin_k INT DEFAULT 0,
    calcium INT DEFAULT 0,
    iron INT DEFAULT 0,
    potassium INT DEFAULT 0,
    cholesterol INT DEFAULT 0,
    sodium INT DEFAULT 0,
    protein INT DEFAULT 0,
    total_sugar INT DEFAULT 0,
    added_sugar INT DEFAULT 0,
    dietary_fiber INT DEFAULT 0
)
