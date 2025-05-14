import pytest
from main import load_api_env_var
from exceptions.env_exceptions import MissingEnvVariableError

@pytest.fixture
def mock_env_var_del(monkeypatch):
    monkeypatch.delenv("API_PORT", raising=False)

def test_load_api_env_var(mock_env_var_del):
    with pytest.raises(MissingEnvVariableError):   
        load_api_env_var()
