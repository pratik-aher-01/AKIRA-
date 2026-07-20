import PyPDF2

def extract_text_from_pdf(file_path: str) -> str:
    """
    Reads a PDF file and extracts all text page by page.
    Returns a single giant string of text.
    """
    text = ""
    try:
        with open(file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n\n"
        return text.strip()
    except Exception as e:
        print(f"Error reading PDF {file_path}: {e}")
        return ""