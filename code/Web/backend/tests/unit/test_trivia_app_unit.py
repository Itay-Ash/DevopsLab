import pytest
from exceptions.env_exceptions import MissingEnvVariableError


def test_load_env_vars():
    with pytest.raises(MissingEnvVariableError):   
        # Runs load_env_vars on file load.
        # Excpects MissingEnvVariableError error.
        import app.trivia_app
