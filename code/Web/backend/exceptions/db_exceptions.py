class InvalidQuery(Exception):
    def __init__(self, query: str, msg: str="invalid or non select query!"):
        self.query = query
        self.msg = msg
        super().__init__('')
    
    def __str__(self):
        return f"'{self.query}': {self.msg}"