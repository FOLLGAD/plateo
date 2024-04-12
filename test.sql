DROP TABLE IF EXISTS foods;

CREATE TABLE foods (
    food_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    title TEXT,
    date TIMESTAMP,
    proteins DECIMAL(5,2),
    ingredients TEXT,
    images TEXT,
    allergens TEXT,
    carbs DECIMAL(5,2),
    fats DECIMAL(5,2),
    salt DECIMAL(5,2),
    fiber DECIMAL(5,2),
    calories INT,
    sugars DECIMAL(5,2)
);