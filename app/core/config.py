from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings.
    Equivalent to process.env (Node.js) or config/*.php / .env (PHP/Laravel).
    Pydantic automatically reads environment variables and validates types.
    """
    PROJECT_NAME: str = "Vinyl Crate API"
    API_V1_STR: str = "/api/v1"
    
    # SQLite for local development; switch to PostgreSQL in production via DATABASE_URL
    DATABASE_URL: str = "sqlite:///./vinyl_crate.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
