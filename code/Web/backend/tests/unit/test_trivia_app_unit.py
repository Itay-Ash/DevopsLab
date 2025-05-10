import pytest
from exceptions.env_exceptions import MissingEnvVariableError
import app.trivia_app as trivia_app

@pytest.fixture
def mock_env_var_del(monkeypatch):
    monkeypatch.delenv("DB_USERNAME", raising=False)

def test_load_env_vars(mock_env_var_del):
    with pytest.raises(MissingEnvVariableError):
        trivia_app.load_env_vars()

def test_connect_to_db(mock_env_var_del):
    with pytest.raises(MissingEnvVariableError):
        trivia_app.connect_to_db()