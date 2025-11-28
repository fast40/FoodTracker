CREATE TABLE food_history (
    user_id INT,
    food_id INT,
    position INT,
    occupied BOOLEAN DEFAULT FALSE,

    PRIMARY KEY (user_id, position),
    FOREIGN KEY (user_id) REFERENCES user_db(user_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food_item(food_id) ON DELETE CASCADE
)
