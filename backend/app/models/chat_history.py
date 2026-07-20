from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subject_id: int = Field(foreign_key="subject.id")
    role: str  # This will be either 'user' or 'assistant'
    content: str
    source: Optional[str] = None  # This will store 'notes', 'web', or 'mixed'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))