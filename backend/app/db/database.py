import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

# If no DATABASE_URL provided (local dev), default to a local sqlite file
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./dev.db"


def _create_engine_with_fallback(url: str):
    """Try to create an engine and connect; if it fails, fallback to sqlite local file."""
    try:
        engine = create_engine(url)
        # attempt to connect to validate URL
        conn = engine.connect()
        conn.close()
        return engine
    except Exception as e:
        logging.warning(f"Could not connect to DATABASE_URL {url}: {e}. Falling back to SQLite.")
        fallback = "sqlite:///./dev.db"
        # sqlite needs check_same_thread for some drivers; SQLAlchemy handles args for sqlite
        engine = create_engine(fallback, connect_args={"check_same_thread": False})
        return engine


engine = _create_engine_with_fallback(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)