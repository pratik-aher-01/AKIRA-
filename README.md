# Akira — AI Study Assistant

Akira is a RAG-powered study companion that turns your own notes, PDFs, and slides into an interactive chat experience. Ask questions, get answers grounded in your uploaded material, and fall back to live web search when your documents don't have what you need.

---

## ✨ Features

- **Chat with your own documents** — upload notes, PDFs, or slides and ask questions directly against them
- **Retrieval-Augmented Generation (RAG)** — answers are grounded in semantically relevant chunks of your material, not generic model knowledge
- **Web search fallback** — when your documents don't contain the answer, Akira automatically searches the web instead of guessing
- **Document ingestion pipeline** — supports PDFs, PowerPoint slides, and images (via OCR)
- **Diagram rendering** — Mermaid diagram support for visual explanations
- **Clean, focused UI** — teal glassmorphism design built for long study sessions, not a generic chatbot skin

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│   Next.js   │─────▶│   FastAPI    │─────▶│    ChromaDB     │
│  Frontend   │◀─────│   Backend    │◀─────│  (vector store) │
└─────────────┘      └──────┬───────┘      └────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              ┌─────▼─────┐    ┌──────▼──────┐
              │  Gemini    │    │  Tavily Web │
              │  (LLM)     │    │  Search API │
              └────────────┘    └─────────────┘
```

**Flow:**
1. Uploaded documents are parsed and split into chunks (`langchain-text-splitters`)
2. Chunks are embedded using sentence-transformer embeddings and stored in **ChromaDB**
3. On a user query, the most relevant chunks are retrieved via semantic similarity search
4. Retrieved context is passed to the LLM (Google Generative AI) to generate a grounded answer
5. If retrieval confidence is low, Akira falls back to a live **Tavily** web search instead of hallucinating

---

## 🛠️ Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — API framework
- [Uvicorn](https://www.uvicorn.org/) — ASGI server
- [SQLModel](https://sqlmodel.tiangolo.com/) — database ORM
- [Pydantic](https://docs.pydantic.dev/) / Pydantic Settings — data validation & config

**AI / RAG**
- [ChromaDB](https://www.trychroma.com/) — vector database
- [Sentence-Transformers](https://www.sbert.net/) — text embeddings
- [LangChain Text Splitters](https://python.langchain.com/) — document chunking
- [Google Generative AI](https://ai.google.dev/) — LLM for answer generation
- [Tavily](https://tavily.com/) — web search fallback API

**Document Processing**
- PyPDF2 — PDF text extraction
- python-pptx — PowerPoint parsing
- Pytesseract + Pillow — OCR for scanned/image content

**Frontend**
- [Next.js](https://nextjs.org/) — React framework
- Mermaid — diagram rendering

**Infra**
- Deployed on [Render](https://render.com/) (free tier)

---

## 📂 Project Structure

```
akira/
├── backend/
│   ├── main.py              # FastAPI app entrypoint
│   ├── requirements.txt     # Python dependencies
│   └── ...                  # routes, models, RAG pipeline logic
├── frontend/
│   ├── pages/ or app/       # Next.js pages/routes
│   ├── components/          # Chat UI, DropZone, etc.
│   └── ...
└── README.md
```

*(Adjust this section to match your actual folder layout.)*

---

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- API keys for Google Generative AI and Tavily

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
```
GOOGLE_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
DATABASE_URL=your_db_url
```

Run the server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🌐 Deployment

The backend is deployed on Render's free tier. A few notes if you're deploying your own instance:

- Pin your Python version (`PYTHON_VERSION` env var, e.g. `3.12.11`) — newer defaults may not have prebuilt wheels for some ML dependencies
- Free-tier instances are memory-constrained (512MB) — loading local embedding models alongside `torch`/`transformers` can be tight; consider a hosted embeddings API if you hit OOM issues
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 🧗 Challenges

Getting a full RAG stack (embeddings + vector DB + transformer model) to run inside free-tier memory limits was the biggest engineering constraint of the project — it shaped decisions around dependency size and model choice from early on, not just at deploy time.

---

## 🗺️ Roadmap

- [ ] Move embeddings to a hosted API to reduce memory footprint
- [ ] Spaced-repetition review generated from uploaded material
- [ ] Richer document support (slide images, handwritten notes via OCR)
- [ ] Multi-user support with persistent study sessions

---

## 🙏 Acknowledgments

Built as part of exploring practical RAG system design — from retrieval architecture down to the realities of shipping ML workloads on constrained infrastructure.
