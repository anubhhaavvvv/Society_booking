from sentence_transformers import SentenceTransformer, util
from app.chat.intents import ChatIntent

model = SentenceTransformer("all-MiniLM-L6-v2")

INTENT_PHRASES = {
    ChatIntent.DISCOVER_FACILITIES: [
        "what facilities can i book",
        "what options do i have",
        "group booking options",
        "facilities for 4 people",
    ],

    ChatIntent.DISCOVER_SLOTS: [
        "show slots",
        "available slots",
        "find a slot",
        "evening slots",
        "morning slots",
    ],

    ChatIntent.SELECT_SLOT: [
        "7 pm",
        "7",
        "select this",
        "this slot",
        "book this slot",
    ],

    ChatIntent.CHECK_AVAILABILITY: [
        "is gym open",
        "pool timings",
        "availability",
    ],

    ChatIntent.CONFIRM_BOOKING: [
        "confirm",
        "yes",
        "go ahead",
        "book it",
    ],

    ChatIntent.RESET: [
        "reset",
        "restart",
        "start over",
    ],
}

INTENT_EMBEDS = {
    intent: model.encode(phrases, normalize_embeddings=True)
    for intent, phrases in INTENT_PHRASES.items()
}

def semantic_intent(message: str, threshold: float = 0.55) -> ChatIntent:
    user_emb = model.encode(message, normalize_embeddings=True)

    best_intent = ChatIntent.UNKNOWN
    best_score = 0.0

    for intent, embeds in INTENT_EMBEDS.items():
        score = util.cos_sim(user_emb, embeds).max().item()
        if score > best_score:
            best_score = score
            best_intent = intent

    if best_score < threshold:
        return ChatIntent.UNKNOWN

    return best_intent
