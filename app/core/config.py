from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str
    jwt_secret_key: str
    access_token_expire_minutes: int

    mysql_user: str
    mysql_password: str
    mysql_host: str
    mysql_port: int
    mysql_db: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="allow"
    )


settings = Settings()
