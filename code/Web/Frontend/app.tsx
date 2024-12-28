import React, { useState, useEffect } from 'react';
import './App.css';

interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

const App: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const fetchQuestion = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/question');
      if (!response.ok) {
        throw new Error('No more questions available.');
      }
      const data: Question = await response.json();
      setQuestion(data);
      setSelectedOption(null);
    } catch (error) {
      setQuestion(null);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSubmit = () => {
    if (selectedOption && question) {
      if (selectedOption === question.options[question.options.correctOption]) {
        setScore(score + 1);
      }
      fetchQuestion();
    }
  };

  return (
    <div className="App">
      <h1>Trivia Game</h1>
      {question ? (
        <div>
          <p>{question.question}</p>
          {Object.entries(question.options).map(([key, value]) => (
            <div key={key}>
              <label>
                <input
                  type="radio"
                  name="option"
                  value={key}
                  checked={selectedOption === key}
                  onChange={() => setSelectedOption(key)}
                />
                {key}: {value}
              </label>
            </div>
          ))}
          <button onClick={handleSubmit} disabled={!selectedOption}>
            Submit Answer
          </button>
        </div>
      ) : (
        <p>No more questions available.</p>
      )}
      <p>Score: {score}</p>
    </div>
  );
};

export default App;
