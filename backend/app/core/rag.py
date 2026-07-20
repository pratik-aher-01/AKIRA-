from app.core.vector_store import query_store
from app.core.confidence import evaluate_confidence
from app.core.web_search import search_web
from app.core.formatter import build_rag_prompt
from app.core.llm import generate_answer

def answer_question(subject_id: int, question: str, temperature: float = 0.7, api_key: str | None = None) -> dict:
    """
    The master RAG pipeline.
    Takes a question, queries the notes, checks confidence, builds the prompt,
    and returns the AI's answer along with its source.
    """
    
    # 1. Query the vector database for relevant notes
    search_results = query_store(subject_id, question)
    
    # Extract the actual text chunks and their distance scores
    retrieved_chunks = search_results.get("documents", [[]])[0]
    distances = search_results.get("distances", [[]])
    
    # 2. Evaluate how confident we are in these notes
    source = evaluate_confidence(distances)
    
    context = ""
    chunks_used = 0
    
    # 3. Gather the context based on our confidence score
    if source == "notes" and retrieved_chunks:
        # Join the retrieved chunks into one big text block
        context = "\n\n---\n\n".join(retrieved_chunks)
        chunks_used = len(retrieved_chunks)
    else:
        # If confidence is low (or database is empty), fall back to the internet
        source = "web"
        context = search_web(question)
        chunks_used = 0
        
    # 4. Build the strict instructional prompt for Gemini
    prompt = build_rag_prompt(question, context, source)
    
    # 5. Generate the answer
    answer = generate_answer(prompt, temperature=temperature, api_key=api_key)
    
    # 6. Return everything nicely packaged for our API
    return {
        "answer": answer,
        "source": source,
        "chunks_used": chunks_used
    }
