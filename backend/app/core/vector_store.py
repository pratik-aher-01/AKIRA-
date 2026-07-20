import chromadb
from app.config.settings import settings
from app.config.constants import TOP_K
from app.core.embedder import get_embedding

# Initialize ChromaDB client pointing to our local folder
chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PATH)

def add_chunks_to_store(subject_id: int, chunks: list[str], document_id: int):
    """Embeds text chunks and saves them to the subject's specific collection."""
    
    # We strictly isolate subjects. subject_1 gets its own collection, subject_2 gets its own.
    # We set the space to "cosine" to measure similarity correctly.
    collection = chroma_client.get_or_create_collection(
        name=f"subject_{subject_id}",
        metadata={"hnsw:space": "cosine"}
    )
    
    ids = [f"doc_{document_id}_chunk_{i}" for i in range(len(chunks))]
    embeddings = [get_embedding(chunk) for chunk in chunks]
    metadatas = [{"document_id": document_id} for _ in chunks]
    
    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

def delete_document_from_store(subject_id: int, document_id: int):
    """Removes all chunks for a specific document from the subject collection."""
    try:
        collection = chroma_client.get_collection(name=f"subject_{subject_id}")
    except Exception:
        return

    collection.delete(where={"document_id": document_id})

def query_store(subject_id: int, query_text: str):
    """Searches the subject's collection for the most relevant chunks to answer the query."""
    try:
        collection = chroma_client.get_collection(name=f"subject_{subject_id}")
    except Exception:
        # If the collection doesn't exist, they haven't uploaded notes for this subject yet
        return {"documents": [[]], "distances": [[]]} 
    
    query_embedding = get_embedding(query_text)
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=TOP_K
    )
    
    return results


def get_subject_chunks(subject_id: int) -> list[str]:
    """Returns all stored note chunks for a subject from ChromaDB."""
    try:
        collection = chroma_client.get_collection(name=f"subject_{subject_id}")
    except Exception:
        return []

    results = collection.get(include=["documents"])
    documents = results.get("documents") or []
    return [doc for doc in documents if isinstance(doc, str) and doc.strip()]
