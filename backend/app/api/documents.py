import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select
from app.models import Document, Subject
from app.parsers.dispatcher import process_file
from app.core.vector_store import add_chunks_to_store, delete_document_from_store
from app.core.database import get_session
from app.config.settings import settings

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.post("/")
def upload_document(
    # We use File() and Form() because file uploads come in as multipart/form-data, not JSON
    file: UploadFile = File(...), 
    subject_id: int = Form(...),
    session: Session = Depends(get_session)
):
    """Handles file upload, parses text, chunks it, and saves to vector DB."""
    
    # 1. Verify the subject actually exists first
    subject = session.get(Subject, subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    # 2. Save the file temporarily to our disk
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    temp_file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 3. Send it to our dispatcher to get parsed and chunked
        chunks = process_file(temp_file_path, file.content_type)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="Could not extract any text from this file.")

        # 4. Save the Document record to our SQLite database
        db_doc = Document(
            subject_id=subject_id,
            filename=file.filename,
            file_type=file.content_type,
            chunk_count=len(chunks)
        )
        session.add(db_doc)
        session.commit()
        session.refresh(db_doc)

        # 5. Feed the chunks into ChromaDB (Akira's brain)
        add_chunks_to_store(subject_id, chunks, db_doc.id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")
        
    finally:
        # 6. Clean up: Delete the temporary file so we don't run out of hard drive space!
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

    return db_doc

@router.get("/")
def get_documents(subject_id: int, session: Session = Depends(get_session)):
    """Returns a list of all documents uploaded for a specific subject."""
    docs = session.exec(select(Document).where(Document.subject_id == subject_id)).all()
    return docs

@router.delete("/{document_id}")
def delete_document(document_id: int, session: Session = Depends(get_session)):
    """Deletes a document record and removes its chunks from ChromaDB."""
    db_doc = session.get(Document, document_id)
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")

    delete_document_from_store(db_doc.subject_id, document_id)
    session.delete(db_doc)
    session.commit()

    return {"ok": True}
