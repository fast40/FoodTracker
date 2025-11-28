CREATE TABLE user (
    user_id INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR[64] UNIQUE, -- arbitrary char limit
    email VARCHAR[320] UNIQUE,
    hashed_pw VARCHAR[255]
)