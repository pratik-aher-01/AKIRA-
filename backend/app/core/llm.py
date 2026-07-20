import google.generativeai as genai
from app.config.settings import settings

def generate_answer(prompt: str, temperature: float = 0.7, api_key: str | None = None) -> str:
    """
    Sends the fully built prompt to Gemini and returns the text response.
    """
    try:
        genai.configure(api_key=api_key or settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(
            'gemini-2.5-flash',
            generation_config={"temperature": temperature},
        )
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return "Sorry, I ran into an error trying to generate an answer."
