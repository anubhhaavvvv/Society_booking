from sentence_transformers import SentenceTransformer, util
from datetime import date, timedelta

model = SentenceTransformer("all-MiniLM-L6-v2")

TIME_BUCKETS = {
    "morning": (6, 12),
    "afternoon": (12, 17),
    "evening": (17, 21),
    "night": (21, 24),
}

TIME_PHRASES = {
    "morning": ["morning", "early morning"],
    "afternoon": ["afternoon", "post lunch"],
    "evening": ["evening", "after work"],
    "night": ["night", "late night"],
}

DATE_PHRASES = {
    "today": ["today", "now"],
    "tomorrow": ["tomorrow"],
    "day_after": ["day after tomorrow"],
    "weekend": ["weekend", "saturday", "sunday"],
}

# Pre-embed
TIME_EMBEDS = {
    k: model.encode(v, normalize_embeddings=True)
    for k, v in TIME_PHRASES.items()
}
DATE_EMBEDS = {
    k: model.encode(v, normalize_embeddings=True)
    for k, v in DATE_PHRASES.items()
}

def infer_time_bucket(message: str, threshold=0.55):
    emb = model.encode(message, normalize_embeddings=True)

    best, score = None, 0
    for bucket, embeds in TIME_EMBEDS.items():
        s = util.cos_sim(emb, embeds).max().item()
        if s > score:
            best, score = bucket, s

    return best if score >= threshold else None
def infer_date(message: str):
    msg = message.lower()
    today = date.today()

    if "day after tomorrow" in msg:
        return (today + timedelta(days=2)).isoformat()
    if "tomorrow" in msg:
        return (today + timedelta(days=1)).isoformat()
    if "weekend" in msg:
        # nearest Saturday
        return (today + timedelta((5 - today.weekday()) % 7)).isoformat()

    return None
