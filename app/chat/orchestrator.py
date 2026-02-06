from app.chat.intent_extractor import extract_intent
from app.chat.intents import ChatIntent
from app.chat.llm_parser import parse_booking_message
from app.chat.state import get_state, update_state, clear_state
from app.chat.resolvers import (
    resolve_facility,
    extract_date,
    infer_booking_type,
    resolve_players_count,
    discover_slots,
    book_selected_slot,
    confirm_booking,
)


def handle_chat(message: str, conversation_id: str = "default"):
    message = message.strip()
    state = get_state(conversation_id)

    if message.lower() in {"reset", "restart", "start over"}:
        clear_state(conversation_id)
        return "Booking reset. What would you like to book?"

    intent = extract_intent(message)

    try:
        parsed = parse_booking_message(message) or {}
        if parsed:
            update_state(conversation_id, **parsed)
            state = get_state(conversation_id) 
    except Exception:
        pass  

    if "facility_id" not in state:
        fid = resolve_facility(message)
        if not fid:
            return (
                "Which facility would you like to book?\n"
                "For example: badminton, tennis, gym, swimming."
            )
        update_state(conversation_id, facility_id=fid)
        return "For which date would you like to book?"

    
    if "booking_date" not in state:
        booking_date = extract_date(message)
        update_state(conversation_id, booking_date=booking_date)
        return "How many people are playing?"

    if "players_count" not in state:
        count = resolve_players_count(message)
        if not count:
            return "How many people are playing? (1–4)"

        booking_type = "SINGLE" if count <= 2 else "DOUBLE"

        update_state(
            conversation_id,
            players_count=count,
            booking_type=booking_type,
        )

        return discover_slots(conversation_id)

    if intent == ChatIntent.DISCOVER_SLOTS:
        return discover_slots(conversation_id)


    if intent == ChatIntent.SELECT_SLOT and "last_shown_slots" in state:
        return book_selected_slot(conversation_id, message)


    if intent == ChatIntent.CONFIRM_BOOKING:
        result = confirm_booking(conversation_id)
        clear_state(conversation_id)
        return result


    if "last_shown_slots" in state:
        return (
            "Please select a slot time from the list.\n"
            "Example: 7 PM"
        )

    return (
        "I didn’t fully understand that.\n\n"
        "You can try:\n"
        "• Book badminton for tomorrow evening\n"
        "• Show available slots\n"
        "• Confirm\n"
        "• Reset"
    )
