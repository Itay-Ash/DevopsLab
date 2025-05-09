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

def assert_api_request(path:str ,status_code: int, excpected_reponse: str = None):
    response = test_client.get(path)
    assert response.status_code == status_code
    if excpected_reponse != None:
        assert excpected_reponse in str(response.json())

def test_api(api_up_response):
    assert_api_request("/api", 200, api_up_response)

def test_api_questions(example_db_question):
    assert_api_request("/api/questions", 200 )

