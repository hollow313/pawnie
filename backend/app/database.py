import os, sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

DB_PATH = os.getenv("DB_PATH", "/app/data/pawnie.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

connect_args = {"check_same_thread": False}
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    # migrations légères pour SQLite : ajouter colonnes si manquent
    with sqlite3.connect(DB_PATH) as c:
        def ensure(table, column, type_sql, default=None):
            cur = c.execute(f"PRAGMA table_info({table})")
            cols = [r[1] for r in cur.fetchall()]
            if column not in cols:
                c.execute(f"ALTER TABLE {table} ADD COLUMN {column} {type_sql}")
                if default is not None:
                    c.execute(f"UPDATE {table} SET {column} = ?", (default,))
        ensure("users", "address", "TEXT", "")
        ensure("users", "city", "TEXT", "")
        ensure("users", "phone", "TEXT", "")
        ensure("listings", "price", "REAL", 0.0)

def get_db():
    from fastapi import Depends
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
