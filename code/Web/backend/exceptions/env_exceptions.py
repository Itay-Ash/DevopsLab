class MissingEnvVariableError(Exception):
    def __init__(self, env_var: str, msg: str="environment variable is not defined."):
        self.env_var = env_var
        self.msg = msg
        super().__init__('')
    
    def __str__(self):
        return f"'{self.env_var}' {self.msg}"