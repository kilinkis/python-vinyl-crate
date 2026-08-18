from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory of the project (root level)
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """
    Application Settings.
    Environment variables loaded from .env file or system environment.
    """
    PROJECT_NAME: str = "Vinyl Crate API"
    API_V1_STR: str = "/api/v1"
    
    # Defaults to an absolute path within project root to prevent CWD permission issues
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'vinyl_crate.db'}"

    # JWT Authentication Configuration
    SECRET_KEY: str = "supersecretdevelopmentkeychangeinproduction1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
