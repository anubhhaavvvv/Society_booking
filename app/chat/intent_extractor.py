from app.chat.semantic_intents import semantic_intent
from app.chat.intents import ChatIntent

def extract_intent(message: str) -> ChatIntent:
    if message.lower() in {"reset", "start over"}:
        return ChatIntent.RESET

    return semantic_intent(message)
