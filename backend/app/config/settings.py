from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # These map exactly to the names in your .env file
    GEMINI_API_KEY: str
    TAVILY_API_KEY: str
    
    CHROMA_PATH: str = "./chroma_db"
    DATABASE_URL: str = "sqlite:///./database.db"
    UPLOAD_DIR: str = "./uploads"
    
    CONFIDENCE_THRESHOLD: float = 0.45

    class Config:
        env_file = ".env"

# We create one instance of this class to use throughout the app
settings = Settings()