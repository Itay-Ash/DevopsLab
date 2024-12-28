from fastapi import FastAPI, HTTPException, Depends
from fastapi.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import sqlite3
import random
from typing import List

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="your_secret_key")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_random_question(excluded_ids: List[int]):
    conn = sqlite3.connect('trivia.db')
    cursor = conn.cursor()

    placeholders = ', '.join('?' for _ in excluded_ids) if excluded_ids else 'NULL'
    query = f"SELECT id, question, option_a, option_b, option_c, option_d, correct_option FROM trivia_questions WHERE id NOT IN ({placeholders})"
    cursor.execute(query, excluded_ids)
    questions = cursor.fetchall()
    conn.close()

    if not questions:
        return None

    question = random.choice(questions)
    return {
        "id": question[0],
        "question": question[1],
        "options": {
            "A": question[2],
            "B": question[3],
            "C": question[4],
            "D": question[5]
        },
        "correct_option": question[6]
    }

@app.get('/api/question')
async def get_question(request: Request):
    session = request.session
    asked_questions = session.get('asked_questions', [])

    question = get_random_question(asked_questions)
    if not question:
        raise HTTPException(status_code=404, detail="No more questions available.")

    asked_questions.append(question['id'])
    session['asked_questions'] = asked_questions
    session.modified = True
    return JSONResponse(content={"question": question["question"], "options": question["options"], "id": question["id"]})

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
