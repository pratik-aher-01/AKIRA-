from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import Session
from app.core.database import get_session
from app.core.quiz import generate_quiz_for_subject

router = APIRouter(prefix="/api/quiz", tags=["Quiz"])


class GenerateQuizRequest(BaseModel):
    subject_id: int
    count: int = Field(default=5, ge=1, le=10)
    temperature: float = Field(default=0.4, ge=0.0, le=1.0)
    api_key: str | None = None


class QuizQuestionResponse(BaseModel):
    id: int
    question: str
    options: list[str]
    correct_index: int
    explanation: str


@router.post("/generate", response_model=list[QuizQuestionResponse])
def generate_quiz(request: GenerateQuizRequest, session: Session = Depends(get_session)):
    try:
        return generate_quiz_for_subject(
            session=session,
            subject_id=request.subject_id,
            count=request.count,
            temperature=request.temperature,
            api_key=request.api_key,
        )
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
