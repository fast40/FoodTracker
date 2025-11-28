CREATE TABLE user_preferences (
    user_id INT PRIMARY KEY,
    dark_mode BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT FALSE,
    language_code VARCHAR(10) DEFAULT 'en-US',
    show_calories BOOLEAN DEFAULT TRUE,
    daily_calorie_goal INT DEFAULT 2000,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);