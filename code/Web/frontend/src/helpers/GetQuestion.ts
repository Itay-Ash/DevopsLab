interface Question {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
}

let questions: Question[] = [];

async function fetchquestions(): Promise<void> {
  if (questions.length > 0) return; // Prevent unnecessary re-fetching

  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "/api/questions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch questions");

    questions = await response.json();
  } catch (error) {
  }
}

export function getQuestion(): Question {
  if (questions.length === 0) {
    return getEmptyQuestion();
  }

  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions.splice(randomIndex, 1)[0];
}

export async function getFirstQuestion(): Promise<Question> {
  await fetchquestions(); // Ensure questions are fetched before accessing them
  return getQuestion();
}

export function getEmptyQuestion(): Question {
  return {
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: ""
  };
}
