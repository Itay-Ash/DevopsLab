-- Create database
CREATE DATABASE IF NOT EXISTS login_app;

-- Use the created database
USE login_app;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insert initial user
INSERT INTO users (username, password) VALUES ('${INITIAL_USERNAME}', '${INITIAL_PASSWORD}');
