import pytest
import app.trivia_app as trivia_app
from exceptions.db_exceptions import InvalidQuery

@pytest.fixture
def mock_invalid_query():
    return 'DELETE EVERYTHING TEST'

@pytest.fixture
def mock_empty_query():
    return ''

def test_run_query(mock_invalid_query, mock_empty_query):
    with pytest.raises(InvalidQuery):
        trivia_app.run_query(mock_invalid_query)
    
    with pytest.raises(InvalidQuery):
        trivia_app.run_query(mock_empty_query)