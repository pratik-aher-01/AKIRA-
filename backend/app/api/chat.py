from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session
from app.models import ChatMessage
from app.core.database import get_session
from app.core.rag import answer_question

router = APIRouter(prefix="/api/chat", tags=["Chat"])

# We use Pydantic to strictly define what the frontend is allowed to send us
class ChatRequest(BaseModel):
    subject_id: int
    question: str
    temperature: float = 0.7
    api_key: str | None = None

@router.post("/")
def chat(request: ChatRequest, session: Session = Depends(get_session)):
    """Receives a question, queries Akira, and saves the history."""
    
    # 1. Run the question through our master AI pipeline
    try:
        result = answer_question(
            request.subject_id,
            request.question,
            temperature=request.temperature,
            api_key=request.api_key,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Pipeline Error: {e}")
    
    # 2. Save the user's question to the database
    user_msg = ChatMessage(
        subject_id=request.subject_id, 
        role="user", 
        content=request.question
    )
    session.add(user_msg)
    
    # 3. Save Akira's answer to the database
    ai_msg = ChatMessage(
        subject_id=request.subject_id, 
        role="assistant", 
        content=result["answer"], 
        source=result["source"]
    )
    session.add(ai_msg)
    
    session.commit()
    
    # 4. Return the result to the frontend
    return result
