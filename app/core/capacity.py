# app/core/capacity.py

# ----------------------------
# GENERIC COURT CAPACITY
# ----------------------------

def get_max_capacity_units(
    total_courts: int,
    max_players_per_court: int,
) -> int:
    if total_courts <= 0 or max_players_per_court <= 0:
        raise ValueError("Invalid facility capacity configuration")

    return total_courts * max_players_per_court


# ----------------------------
# UNIFIED CAPACITY LOGIC
# ----------------------------

def resolve_max_capacity_units(
    facility_name: str,
    total_courts: int,
    max_players_per_court: int,
) -> int:
    name = facility_name.lower().strip()

    # 🏋️ Gym (individual booking)
    if name == "gym":
        return 35

    # 🏊 Swimming pool (individual booking)
    if name in {"swimming pool", "swimming-pool"}:
        return 7

    # 🎾 Court-based
    return get_max_capacity_units(
        total_courts=total_courts,
        max_players_per_court=max_players_per_court,
    )


# ----------------------------
# BACKWARD COMPAT (DO NOT REMOVE)
# ----------------------------

def get_allowed_capacity(
    facility_name: str,
    current_units: int,
) -> int:
    """
    Legacy function used by availability.py.
    Returns MAX capacity for facility.
    """

    name = facility_name.lower().strip()

    if name == "gym":
        return 35

    if name in {"swimming pool", "swimming-pool"}:
        return 7

    # fallback for courts (availability doesn't know courts)
    return 9999
