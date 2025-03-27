import mysql.connector
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

user = os.environ["DB_USERNAME"]
password = os.environ["DB_PASSWORD"]
host = os.environ["DB_HOST"]
database = os.environ["DB_NAME"]

cnx = mysql.connector.connect(user=user, password=password,
                              host=host,
                              database=database)
cursor = cnx.cursor(dictionary=True)

questions_query = ("SELECT question, option_a, option_b, option_c, option_d, correct_option  FROM trivia_questions;")
cursor.execute(questions_query)
questions_list = cursor.fetchall()

cnx.close()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
)

@app.get("/api/questions")
async def get_questions():
   return questions_list

if __name__ == "__main__":
   uvicorn.run("app:app", host="0.0.0.0", port=int(os.environ["API_PORT"]), reload=True)
