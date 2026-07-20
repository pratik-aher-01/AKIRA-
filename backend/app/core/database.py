from sqlmodel import create_engine, Session
from app.config.settings import settings

# Move the engine here
engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})

# Move the session generator here
def get_session():
    with Session(engine) as session:
        yield session