from app.config.settings import settings

def evaluate_confidence(distances: list[float]) -> str:
    """
    Evaluates how closely the retrieved notes match the user's question.
    Returns 'notes' if we have a good match, or 'web' if we need to fall back to the internet.
    """
    # If the database is empty or returned nothing
    if not distances or not distances[0]:
        return "web"
        
    # In ChromaDB with cosine space, distance = 1.0 - similarity.
    # Therefore, similarity = 1.0 - distance.
    best_distance = distances[0][0]
    best_similarity = 1.0 - best_distance
    
    # Compare against our 0.45 threshold
    if best_similarity >= settings.CONFIDENCE_THRESHOLD:
        return "notes"
    else:
        return "web"