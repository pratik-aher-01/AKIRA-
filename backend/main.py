from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

# Import settings, models, and our new database engine
from app.config.settings import settings
from app.models import Subject, Document, ChatMessage
from app.core.database import engine

# Import our API routers
from app.api import subjects, documents, chat, quiz

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# 1. The Modern FastAPI Lifespan method (replaces on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up Akira... Creating database tables.")
    create_db_and_tables()
    yield  # The app runs while yielded here
    print("Shutting down Akira...")

app = FastAPI(
    title="Akira AI Study Companion",
    description="Backend API for Akira",
    version="1.0",
    lifespan=lifespan  # Attach the lifespan here
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Akira backend is awake and ready!"}

# Register API Routers
app.include_router(subjects.router)
app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(quiz.router)

# 2. This block tells Python to actually start the live server when you run 'python main.py'
if __name__ == "__main__":
    # reload=True means the server will auto-restart every time you save a file!
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
