CREATE TABLE trivia_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL
);

INSERT INTO trivia_questions (question, option_a, option_b, option_c, option_d, correct_option) VALUES
('What is the capital of France?', 'Berlin', 'Madrid', 'Paris', 'Rome', 'C'),
('What is 2 + 2?', '3', '4', '5', '6', 'B'),
('Who wrote "Romeo and Juliet"?', 'Charles Dickens', 'Mark Twain', 'William Shakespeare', 'Jane Austen', 'C'),
('What is the largest planet in our Solar System?', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'C'),
('What year did the Titanic sink?', '1912', '1905', '1898', '1920', 'A'),
('What is the chemical symbol for water?', 'H2O', 'CO2', 'O2', 'H2', 'A'),
('Who painted the Mona Lisa?', 'Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Michelangelo', 'C'),
('What is the tallest mountain in the world?', 'K2', 'Mount Everest', 'Kangchenjunga', 'Lhotse', 'B'),
('Which country is known as the Land of the Rising Sun?', 'China', 'Japan', 'South Korea', 'Vietnam', 'B'),
('What is the smallest prime number?', '1', '2', '3', '5', 'B');