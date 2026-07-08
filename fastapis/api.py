from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from . import chat_state
from main import run_pipeline
from core.rag_engine import ask_question
app = FastAPI(
    title="AI Video Assistant API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class VideoRequest(BaseModel):
    source: str

@app.post("/process")
def process_video(request: VideoRequest):
    result = run_pipeline(request.source)
    chat_state.rag_chain = result["rag_chain"]

    return {
        "title": result["title"],
        "summary": result["summary"],
        "action_items": result["action_items"],
        "key_decisions": result["key_decisions"],
        "open_questions": result["open_questions"],
    }


#for chat functionality
class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(request: ChatRequest):

    if chat_state.rag_chain is None:
        return {
            "error": "No video found."
        }

    answer = ask_question(
        chat_state.rag_chain,
        request.question
    )

    return {
        "answer": answer
    }

@app.get("/")
def home():
    return {"status": "ok"}