CREATE TABLE user_data (
    user_id INT PRIMARY KEY,
    dark_mode BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT FALSE,
    language VARCHAR[10] DEFAULT 'EN',

    show_calories BOOLEAN DEFAULT TRUE
)