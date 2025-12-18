import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
   
    JWT_SECRET: str = os.getenv("JWT_SECRET", "692DEA523FE2EFF0818540106FE4E727")
    JWT_ALGORITHM: str = "HS256"

settings = Settings()