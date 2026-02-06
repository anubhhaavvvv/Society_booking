import re
import requests
from datetime import date, timedelta
from typing import Optional
from app.chat.state import get_state, update_state
from app.chat.utils  import normalize_time
from app.chat.llm_date_parser import normalize_date

API_BASE = "http://127.0.0.1:8000"

FACILITY_KEYWORDS = {
    "badminton": 1,
    "lawn tennis": 2,
    "tennis": 2,
    "pickleball": 3,
    "gym": 4,
    "swimming": 5,
    "pool": 5,
}

TIME_BUCKETS = {
    "morning": (6, 12),
    "afternoon": (12, 16),
    "evening": (16, 21),
    "night": (21, 24),
}


def resolve_facility(message: str):
    msg = message.lower()

    for name, fid in FACILITY_KEYWORDS.items():
        if name in msg:
            return fid


    KNOWN = ", ".join(FACILITY_KEYWORDS.keys())
    return {
        "error": f"I don’t have that facility. Available options are: {KNOWN}"
    }



def extract_date(message: str) -> str | None:
    return normalize_date(message)


# ---------- BOOKING TYPE ----------
def infer_booking_type(message: str) -> Optional[str]:
    msg = message.lower()
    if "single" in msg:
        return "SINGLE"
    if "double" in msg:
        return "DOUBLE"
    return None

# ---------- PLAYERS ----------
def resolve_players_count(message: str) -> Optional[int]:
    msg = message.strip().lower()
    if msg.isdigit():
        n = int(msg)
        return n if 1 <= n <= 4 else None
    words = {"one":1,"two":2,"three":3,"four":4}
    for w,n in words.items():
        if w in msg:
            return n
    return None

# ---------- DISCOVER SLOTS ----------
def discover_slots(conversation_id: str) -> str:
    state = get_state(conversation_id)

    facility_id = state.get("facility_id")
    booking_date = state.get("booking_date")

    if not facility_id or not booking_date:
        return "Please specify facility and date first."

    try:
        r = requests.get(
            f"{API_BASE}/facilities/{facility_id}/slots",
            params={"booking_date": booking_date},
            timeout=5,
        )
        r.raise_for_status()
    except requests.HTTPError:
        return (
            "That date seems invalid.\n"
            "Please try something like:\n"
            "• today\n"
            "• tomorrow\n"
            "• this weekend\n"
            "• 10 January"
        )

    slots = r.json()
    ...

from app.chat.facilities_catalog import FACILITIES

def discover_facilities(players_count: int | None = None) -> str:
    results = []

    for f in FACILITIES.values():
        if players_count:
            if not f["group_allowed"]:
                continue
            if f["max_players"] < players_count:
                continue

        results.append(f["name"])

    if not results:
        return "No facilities support that group size."

    return (
        "You can book the following facilities:\n"
        + "\n".join(f"• {name}" for name in results)
    )




def find_slot_from_message(conversation_id: str, message: str):
    state = get_state(conversation_id)
    slots = state.get("last_shown_slots", [])

    time_text = normalize_time(message) or message.lower()

    match = re.search(r"(\d{1,2})\s?(am|pm)", time_text.lower())
    if not match:
        return None

    hour = int(match.group(1))
    period = match.group(2)

    if period == "pm" and hour != 12:
        hour += 12
    if period == "am" and hour == 12:
        hour = 0

    prefix = f"{hour:02d}:"

    for slot in slots:
        if slot["start_time"].startswith(prefix):
            return slot

    return None


def book_selected_slot(conversation_id: str, message: str) -> str:
    slot = find_slot_from_message(conversation_id, message)
    if not slot:
        return "Please select a valid slot time."

    update_state(
        conversation_id,
        selected_slot_id=slot["id"],
        selected_slot_time=f"{slot['start_time']}–{slot['end_time']}",
    )

    return f"You selected {slot['start_time']}–{slot['end_time']}. Type `confirm`."


def confirm_booking(conversation_id: str) -> str:
    state = get_state(conversation_id)

    payload = {
        "facility_id": state["facility_id"],
        "time_slot_id": state["selected_slot_id"],
        "booking_date": state["booking_date"],
        "booking_type": state["booking_type"],
        "players_count": state["players_count"],
    }

    r = requests.post(f"{API_BASE}/bookings", json=payload)

    if r.status_code == 401:
        return (
            "🔒 You need to be logged in to confirm this booking.\n"
            "Please log in and then type `confirm` again."
        )

    if r.status_code == 201:
        return f"✅ Booking confirmed for {state['selected_slot_time']}."

    return r.json().get("detail", "Booking failed.")
