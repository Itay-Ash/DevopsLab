import pytest
from exceptions.env_exceptions import MissingEnvVariableError

@pytest.fixture
def mock_env_var_del(monkeypatch):
    monkeypatch.delenv("DB_USERNAME", raising=False)

def test_load_env_vars(mock_env_var_del):
    with pytest.raises(MissingEnvVariableError):   
        # Runs load_env_vars on file load if ran individually.
        from app.trivia_app import load_env_vars
        load_env_vars()
