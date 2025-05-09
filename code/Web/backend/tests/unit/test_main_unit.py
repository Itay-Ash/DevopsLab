import pytest
import main
from exceptions.env_exceptions import MissingEnvVariableError


def test_load_api_env_var(monkeypatch):
    with pytest.raises(MissingEnvVariableError):   
        monkeypatch.delenv("API_PORT")
        main.load_api_env_var()
