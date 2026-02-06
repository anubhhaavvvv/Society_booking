from fastapi import APIRouter
from pydantic import BaseModel
from app.chat.orchestrator import handle_chat
from app.chat.schemas import ChatRequest

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
def chat(request: ChatRequest):
    return {"reply": handle_chat(request.message)}



class ChatRequest(BaseModel):
    message: str

@router.post("/")
def chat(request: ChatRequest):
    return {
        "reply": handle_chat(
            request.message,
            request.conversation_id or "default"
        )
    }

@router.get("/v1/models")
def list_models():
    return {
        "data": [
            {"id": "ollama-mistral", "object": "model"}
        ]
    }
