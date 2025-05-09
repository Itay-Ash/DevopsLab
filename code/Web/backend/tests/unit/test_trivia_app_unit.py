import pytest
from exceptions.env_exceptions import MissingEnvVariableError

def test_load_env_vars(monkeypatch):
    with pytest.raises(MissingEnvVariableError):   
        # Runs load_env_vars on file load.
        # Excpects MissingEnvVariableError error.
        monkeypatch.delenv("DB_USERNAME", raising=False)
        from app.trivia_app import load_env_vars
        load_env_vars()
