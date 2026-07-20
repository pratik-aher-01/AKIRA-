from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import Subject
from app.core.vector_store import chroma_client
from app.core.database import get_session

router = APIRouter(prefix="/api/subjects", tags=["Subjects"])

@router.post("/", response_model=Subject)
def create_subject(subject: Subject, session: Session = Depends(get_session)):
    """Creates a new subject card."""
    session.add(subject)
    session.commit()
    session.refresh(subject)
    return subject

@router.get("/", response_model=list[Subject])
def get_subjects(session: Session = Depends(get_session)):
    """Lists all subjects for the dashboard."""
    subjects = session.exec(select(Subject)).all()
    return subjects

@router.delete("/{subject_id}")
def delete_subject(subject_id: int, session: Session = Depends(get_session)):
    """Deletes a subject from SQLite AND wipes its brain from ChromaDB."""
    subject = session.get(Subject, subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # 1. Delete from SQLite
    session.delete(subject)
    session.commit()
    
    # 2. Delete the associated vector database collection so we don't leak memory
    try:
        chroma_client.delete_collection(name=f"subject_{subject_id}")
    except Exception as e:
        print(f"Note: Could not delete ChromaDB collection (it might be empty): {e}")
        
    return {"ok": True, "message": f"Deleted {subject.name}"}
