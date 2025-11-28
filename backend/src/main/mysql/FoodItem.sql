CREATE TABLE food_item (
    food_id INT UNIQUE AUTO_INCREMENT
    user_generated BOOLEAN
    api_url TEXT
    data_id INT

    PRIMARY KEY (food_item)
    FOREIGN KEY (data_id)
)