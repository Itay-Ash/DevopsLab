import pytest
import main
from exceptions.env_exceptions import MissingEnvVariableError

@pytest.fixture
def mock_env_var_del(monkeypatch):
    monkeypatch.delenv("API_PORT")

def test_load_api_env_var(mock_env_var_del):
    with pytest.raises(MissingEnvVariableError):   
        main.load_api_env_var()
