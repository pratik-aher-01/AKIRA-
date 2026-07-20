from tavily import TavilyClient
from app.config.settings import settings

# We use a try/except block here. If you haven't put a real API key in your .env file yet,
# this prevents your entire server from crashing on startup!
try:
    tavily_client = TavilyClient(api_key=settings.TAVILY_API_KEY)
except Exception:
    tavily_client = None

def search_web(query: str) -> str:
    """Searches the internet for the answer when notes fail."""
    if not tavily_client:
        return "Web search is disabled (no API key provided)."
        
    try:
        # We ask Tavily for a direct, AI-summarized answer + search results
        response = tavily_client.search(query=query, search_depth="basic", include_answer=True)
        
        # Combine the summarized answer and snippets from top websites to feed to Gemini
        context = response.get("answer", "") + "\n\n"
        for result in response.get("results", []):
            context += f"- {result['content']}\n"
        
        return context
    except Exception as e:
        print(f"Tavily search error: {e}")
        return ""