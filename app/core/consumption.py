# app/core/consumption.py

COURT_CAPACITY_UNITS = 4


def calculate_consumed_units(
    booking_type: str,
    player_count: int,
) -> int:
    """
    Converts booking input into capacity consumption units.

    Rules:
    - Courts: single / double logic
    - Gym / Swimming Pool: individual booking, units = player_count
    """

    if not booking_type:
        raise ValueError("Booking type is required")

    booking_type = booking_type.lower().strip()

    if not isinstance(player_count, int) or player_count <= 0:
        raise ValueError("Invalid player count")

    # ----------------------------
    # INDIVIDUAL FACILITIES (GYM / POOL)
    # ----------------------------
    if booking_type == "individual":
        return player_count

    # ----------------------------
    # COURT-BASED FACILITIES
    # ----------------------------
    if booking_type not in {"single", "double"}:
        raise ValueError("Invalid booking type")

    # Singles → lock entire court
    if booking_type == "single":
        if player_count != 2:
            raise ValueError("Singles booking must have exactly 2 players")
        return COURT_CAPACITY_UNITS

    # Doubles → consume per player
    if booking_type == "double":
        if player_count > COURT_CAPACITY_UNITS:
            raise ValueError(
                f"Doubles booking cannot exceed {COURT_CAPACITY_UNITS} players"
            )
        return player_count
