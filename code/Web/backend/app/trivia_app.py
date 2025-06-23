import mysql.connector
import os
from exceptions.env_exceptions import MissingEnvVariableError
from exceptions.db_exceptions import InvalidQuery
import atexit

def connect_to_db():
    global cnx, cursor

    try:
        cnx
    except:
        load_env_vars()
        cnx = mysql.connector.connect(user=user, password=password,
                                    host=host,
                                    database=database)
        cursor = cnx.cursor(dictionary=True)

def load_env_vars():
    global user, password, host, database

    print("Loading environment variables...")
    try:
        user = os.environ["DB_USERNAME"]
        password = os.environ["DB_PASSWORD"]
        host = os.environ["DB_HOST"]
        database = os.environ["DB_NAME"]
    except Exception as e:
    # Raises an error with the missing env variable
        raise MissingEnvVariableError(e.args[0]) 

def run_query(query: str):
    if query is None or not query.strip().lower().startswith("select"):
        raise InvalidQuery(query)
    connect_to_db()
    cursor.execute(query)
    result = cursor.fetchall()
    return result

def get_questions_list():
    print("Fetching questions from DB...")
    questions_query = ("SELECT question, option_a, option_b, option_c, option_d, correct_option FROM trivia_questions;")
    questions_list = run_query(questions_query)
    return questions_list

def exit_command():
    try:
        if cnx:
            print("Closing DB Connection...")
            cnx.close()
    except:
        # avoid error message in case of not having a connection at all
        pass
atexit.register(exit_command)
