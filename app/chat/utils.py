
CAPACITY_BASED_FACILITIES = ["gym", "swimming", "pool"]

TIME_BUCKETS = {
    "morning": (6, 12),
    "afternoon": (12, 16),
    "evening": (16, 21),
    "night": (21, 24),
}

def is_capacity_based(facility_name: str) -> bool:
    name = facility_name.lower()
    return any(x in name for x in CAPACITY_BASED_FACILITIES)

# app/chat/llm_time_parser.py
from app.core.llm import llm_client

def normalize_time(message: str) -> str | None:
    prompt = f"""
Convert the following user input into a 12-hour time like '7 PM'.
If no time is mentioned, return NONE.

User input: "{message}"
Answer:
"""
    out = llm_client.generate(prompt=prompt).strip()

    if "NONE" in out.upper():
        return None

    return out
def infer_booking_type_from_players(players_count: int) -> str | None:
    if players_count > 2:
        return "DOUBLE"
    if players_count == 2:
        return "SINGLE"
    return None
