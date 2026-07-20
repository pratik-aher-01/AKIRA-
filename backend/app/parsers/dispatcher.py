import os
from app.parsers.pdf_parser import extract_text_from_pdf
from app.parsers.pptx_parser import extract_text_from_pptx
from app.parsers.image_parser import extract_text_from_image
from app.parsers.chunker import chunk_text

def process_file(file_path: str, file_type: str) -> list[str]:
    """
    Routes the file to the correct parser based on its MIME type,
    extracts the raw text, and then chops it into chunks.
    """
    raw_text = ""
    
    # Route to the correct parser based on the file type
    if file_type == "application/pdf":
        raw_text = extract_text_from_pdf(file_path)
    elif file_type == "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        raw_text = extract_text_from_pptx(file_path)
    elif file_type.startswith("image/"):
        raw_text = extract_text_from_image(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")
        
    # If we successfully got text out of the file, run it through our chunker
    if raw_text:
        return chunk_text(raw_text)
    
    # If the file was empty or unreadable, return an empty list
    return []