from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class Subject(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    color: str
    icon: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))