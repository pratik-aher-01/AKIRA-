import json
import re
from pydantic import BaseModel, Field, ValidationError
from sqlmodel import Session, select
from app.config.constants import MAX_CONTEXT_TOKENS
from app.core.formatter import build_quiz_prompt
from app.core.llm import generate_answer
from app.core.vector_store import get_subject_chunks
from app.models import Document, Subject


class QuizQuestion(BaseModel):
    question: str
    options: list[str] = Field(min_length=4, max_length=4)
    correct_index: int
    explanation: str


class QuizEnvelope(BaseModel):
    questions: list[QuizQuestion]


def _limit_context(chunks: list[str]) -> str:
    max_chars = MAX_CONTEXT_TOKENS * 4
    parts: list[str] = []
    current_length = 0

    for chunk in chunks:
        cleaned = chunk.strip()
        if not cleaned:
            continue

        addition = cleaned if not parts else f"\n\n---\n\n{cleaned}"
        if current_length + len(addition) > max_chars:
            remaining = max_chars - current_length
            if remaining > 0:
                parts.append(addition[:remaining])
            break

        parts.append(addition)
        current_length += len(addition)

    return "".join(parts)


def _extract_json_block(text: str) -> str:
    fenced_match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fenced_match:
        return fenced_match.group(1)

    object_match = re.search(r"(\{.*\})", text, re.DOTALL)
    if object_match:
        return object_match.group(1)

    raise ValueError("Quiz model response did not contain valid JSON.")


def generate_quiz_for_subject(
    session: Session,
    subject_id: int,
    count: int = 5,
    temperature: float = 0.4,
    api_key: str | None = None,
) -> list[dict]:
    if count < 1 or count > 10:
        raise ValueError("Quiz question count must be between 1 and 10.")

    subject = session.get(Subject, subject_id)
    if not subject:
        raise LookupError("Subject not found.")

    documents = session.exec(select(Document.id).where(Document.subject_id == subject_id)).all()
    if not documents:
        raise FileNotFoundError("Upload notes for this subject before generating a quiz.")

    chunks = get_subject_chunks(subject_id)
    if not chunks:
        raise RuntimeError("The subject has documents, but no indexed note chunks were found yet.")

    context = _limit_context(chunks)
    if not context.strip():
        raise RuntimeError("The indexed note chunks for this subject were empty.")

    prompt = build_quiz_prompt(subject.name, context, count)
    raw_response = generate_answer(prompt, temperature=temperature, api_key=api_key)

    try:
        parsed = json.loads(_extract_json_block(raw_response))
        envelope = QuizEnvelope.model_validate(parsed)
    except (json.JSONDecodeError, ValidationError, ValueError) as exc:
        raise RuntimeError(f"Quiz generation returned an invalid format: {exc}") from exc

    normalized_questions: list[dict] = []
    for index, question in enumerate(envelope.questions[:count], start=1):
        if question.correct_index < 0 or question.correct_index > 3:
            raise RuntimeError("Quiz generation returned an invalid correct_index.")

        normalized_questions.append(
            {
                "id": index,
                "question": question.question.strip(),
                "options": [option.strip() for option in question.options],
                "correct_index": question.correct_index,
                "explanation": question.explanation.strip(),
            }
        )

    if len(normalized_questions) != count:
        raise RuntimeError("Quiz generation did not return the requested number of questions.")

    return normalized_questions
