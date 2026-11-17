import time
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

logger = logging.getLogger("reconciliation.database")

engine = create_engine(
    settings.DATABASE_URL,
    pool_recycle=3600,
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def wait_for_db(max_retries: int = 30, delay_seconds: int = 2):
    """Wait for MySQL database to become available before starting FastAPI app."""
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Checking database connection (attempt {attempt}/{max_retries})...")
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Database connection established successfully.")
            return True
        except Exception as e:
            logger.warning(f"Database not ready yet ({e}). Waiting {delay_seconds}s...")
            time.sleep(delay_seconds)
    raise RuntimeError("Failed to connect to MySQL database after multiple attempts.")
