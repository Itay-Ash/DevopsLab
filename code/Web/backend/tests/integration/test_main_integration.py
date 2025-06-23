import pytest
from fastapi.testclient import TestClient
from main import app

test_client = TestClient(app)

@pytest.fixture
def api_up_response():
    return "Up and kicking!"

@pytest.fixture
def example_db_question():
    # If deleted the test will fail.
    return "{'question': " \
    "'What is the capital of France?', " \
    "'option_a': 'Berlin', 'option_b': 'Madrid', 'option_c': 'Paris', 'option_d': 'Rome', " \
    "'correct_option': 'C'}"

def assert_api_request(api_path:str ,status_code: int, excpected_reponse: str = None):
    '''
    Assersts API Request reponse, can assert both status code and JSON response.\n
    :param api_path: The path for the API request.
    :param status_code: The excpected status code in the response.
    :param excpected_response: Checks if the string is inside the response JSON, can be left blank to avoid assertion.
    '''
    response = test_client.get(api_path)
    assert response.status_code == status_code
    if excpected_reponse != None:
        assert excpected_reponse in str(response.json())

def test_api(api_up_response):
    assert_api_request("/api", 200, api_up_response)

def test_api_questions(example_db_question):
    assert_api_request("/api/questions", 200 )

