from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

# Canonical slot intents
SLOT_INTENTS = [
    "earliest available slot",
    "latest available slot",
    "morning slot",
    "afternoon slot",
    "evening slot",
    "night slot",
    "after 8 pm",
    "after office hours",
]

INTENT_EMBEDDINGS = model.encode(SLOT_INTENTS, normalize_embeddings=True)


def semantic_pick_slot(slots: list[dict], user_message: str) -> dict | None:
    """
    Uses embeddings to select the most appropriate slot.
    """
    if not slots:
        return None

    user_emb = model.encode(user_message, normalize_embeddings=True)
    scores = util.cos_sim(user_emb, INTENT_EMBEDDINGS)[0]
    best_intent = SLOT_INTENTS[int(scores.argmax())]

    # ---- deterministic mapping AFTER semantic intent ----
    if best_intent == "earliest available slot":
        return slots[0]

    if best_intent == "latest available slot":
        return slots[-1]

    if best_intent in {"morning slot"}:
        return _first_between(slots, 6, 12)

    if best_intent in {"afternoon slot"}:
        return _first_between(slots, 12, 17)

    if best_intent in {"evening slot", "after office hours"}:
        return _first_between(slots, 17, 21)

    if best_intent in {"night slot", "after 8 pm"}:
        return _first_between(slots, 20, 24)

    return None


def _first_between(slots, start, end):
    for s in slots:
        hour = int(s["start_time"].split(":")[0])
        if start <= hour < end:
            return s
    return None
