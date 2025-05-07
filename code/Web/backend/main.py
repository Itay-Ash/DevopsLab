import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.trivia_app import *

api_port = os.environ["API_PORT"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
)

@app.get("/api/questions")
async def get_questions():
   return questions_list

if __name__ == "__main__":
   uvicorn.run("main:app", host="0.0.0.0", port=int(api_port), reload=True)
