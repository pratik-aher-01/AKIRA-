from sentence_transformers import SentenceTransformer

# We load the model outside the function so it only boots up once when the server starts.
# The first time you run this, it will download the model (about 80MB) to your computer.
print("Loading Embedding Model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> list[float]:
    """
    Converts a string of text into a mathematical vector (a list of 384 floats).
    """
    # encode() turns the text into a numpy array, tolist() converts it to standard Python floats
    return model.encode(text).tolist()