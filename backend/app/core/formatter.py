def build_rag_prompt(question: str, context: str, source_type: str) -> str:
    """
    Combines the user's question, the retrieved context (notes or web),
    and our strict formatting instructions for Gemini.
    """
    system_instruction = """You are Akira, an intelligent AI study companion for engineering students.
    Answer the user's question using ONLY the context provided below. 
    
    FORMATTING RULES:
    1. Start with a brief, clear explanation of the concept.
    2. If applicable, include code examples in fenced code blocks (e.g., ```python).
    3. If explaining a process, workflow, or system architecture, include a flowchart using a ```mermaid fence.
    4. End with a few summary bullet points.
    5. Do not hallucinate or guess. If the context doesn't contain the answer, explicitly state that.
    """
    
    source_note = "Context from Student's Notes:" if source_type == "notes" else "Context from Web Search:"
    
    full_prompt = f"""
    {system_instruction}
    
    {source_note}
    {context}
    
    User Question: {question}
    
    Answer:
    """
    return full_prompt


def build_quiz_prompt(subject_name: str, context: str, question_count: int) -> str:
    """
    Builds a strict JSON-only prompt for quiz generation from the student's notes.
    """
    return f"""
    You are Akira, an AI study companion for engineering students.
    Create exactly {question_count} multiple choice quiz questions using ONLY the notes below for the subject "{subject_name}".

    RULES:
    1. Return valid JSON only.
    2. The top-level JSON must be an object with a "questions" array.
    3. Each question object must contain:
       - "question": string
       - "options": array of exactly 4 distinct strings
       - "correct_index": integer from 0 to 3
       - "explanation": string
    4. Do not include markdown fences, commentary, or extra text.
    5. Keep questions grounded in the notes. Do not invent facts not present in the notes.
    6. Make the questions clear, moderately challenging, and non-repetitive.

    Notes Context:
    {context}
    """
