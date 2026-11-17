import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "mysql")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "recon_user")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "recon_secret_123")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "settlement_reconciliation")
    
    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"

settings = Settings()
