from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config.constants import CHUNK_SIZE, CHUNK_OVERLAP

def chunk_text(text: str) -> list[str]:
    """
    Takes a massive string of text and chops it into smaller chunks.
    Uses the settings defined in our constants.py.
    """
    if not text:
        return []

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,       
        chunk_overlap=CHUNK_OVERLAP, 
        length_function=len,
        is_separator_regex=False,
    )
    
    chunks = text_splitter.split_text(text)
    return chunks