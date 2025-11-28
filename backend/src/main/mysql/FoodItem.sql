CREATE TABLE food_item (
    food_id INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    user_generated BOOLEAN,
    api_url TEXT,
    data_id INT,

    FOREIGN KEY (data_id) ON DELETE CASCADE
)