import re
from datetime import date, timedelta

def parse_booking_message(message: str) -> dict:
    msg = message.lower()
    data = {}

    # Facility (still deterministic)
    if "badminton" in msg:
        data["facility"] = "badminton"
    elif "tennis" in msg:
        data["facility"] = "tennis"

    # Date (can later be upgraded to LLM)
    if "tomorrow" in msg:
        data["booking_date"] = (date.today() + timedelta(days=1)).isoformat()
    elif "today" in msg:
        data["booking_date"] = date.today().isoformat()

    # Time of day (semantic bucket)
    if "morning" in msg:
        data["time_bucket"] = "morning"
    elif "evening" in msg:
        data["time_bucket"] = "evening"
    elif "night" in msg:
        data["time_bucket"] = "night"
    

    return data
