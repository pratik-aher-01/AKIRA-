from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class Document(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subject_id: int = Field(foreign_key="subject.id")
    filename: str
    file_type: str
    chunk_count: int = 0
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))