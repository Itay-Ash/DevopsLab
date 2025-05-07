import mysql.connector
from dotenv import load_dotenv
import os
from exceptions.env_exceptions import MissingEnvVariableError

def load_env_vars():
    global user, password, host, database
    load_dotenv()

    try:
        user = os.environ["DB_USERNAME"]
        password = os.environ["DB_PASSWORD"]
        host = os.environ["DB_HOST"]
        database = os.environ["DB_NAME"]
    except Exception as e:
    # Raises an error with the missing env variable
        raise MissingEnvVariableError(e.args[0]) 

load_env_vars()
cnx = mysql.connector.connect(user=user, password=password,
                              host=host,
                              database=database)
cursor = cnx.cursor(dictionary=True)

questions_query = ("SELECT question, option_a, option_b, option_c, option_d, correct_option FROM trivia_questions;")
cursor.execute(questions_query)
questions_list = cursor.fetchall()

cnx.close()
