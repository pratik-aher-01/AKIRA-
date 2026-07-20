import pytesseract
from PIL import Image

def extract_text_from_image(file_path: str) -> str:
    """
    Uses OCR to extract text from images (JPG/PNG).
    Great for handwritten notes or screenshots.
    """
    try:
        # Open the image using Pillow
        img = Image.open(file_path)
        
        # Use Tesseract to read the text
        text = pytesseract.image_to_string(img)
        
        return text.strip()
    except Exception as e:
        print(f"Error reading Image {file_path}: {e}")
        return ""