import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from exceptions.env_exceptions import MissingEnvVariableError
from dotenv import load_dotenv
load_dotenv()

from app.trivia_app import get_questions_list

def load_api_env_var():
   global api_port
   try:
      api_port = os.environ["API_PORT"]
   except Exception as e:
   # Raises an error with the missing env variable
      raise MissingEnvVariableError(e.args[0])

app = FastAPI()
app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"]
)

@app.get("/api")
async def get_api():
   return "Up and kicking!"

@app.get("/api/questions")
async def get_questions():
   questions_list = get_questions_list()
   return questions_list

if __name__ == "__main__":
   load_api_env_var()
   uvicorn.run("main:app", host="0.0.0.0", port=int(api_port), reload=True)
