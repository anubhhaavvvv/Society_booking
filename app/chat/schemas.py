# app/chat/schemas.py

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from app.chat.intents import ChatIntent


class ChatRequest(BaseModel):
    message: str = Field(..., description="User chat message")
    conversation_id: Optional[str] = Field(
        None, description="Conversation/session identifier"
    )
class IntentExtraction(BaseModel):
    intent: ChatIntent = Field(..., description="Detected user intent")

    entities: Dict[str, Any] = Field(
        default_factory=dict,
        description="Extracted entities like facility, date, slot, booking_id",
    )

    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Model confidence score"
    )

class Actionresult(BaseModel):
    success: bool 
    message: str
    data: Optional[Dict[str, Any]] = None

class RAGAnswer(BaseModel):
    answer: str
    sources: List[str] = Field(
        default_factory=list,
        description="Policy or document identifiers used",
    )
class ChatResponse(BaseModel):
    reply: str
    intent: Optional[ChatIntent] = None
    requires_followup: bool = False
    metadata: Optional[Dict[str, Any]] = None
    
