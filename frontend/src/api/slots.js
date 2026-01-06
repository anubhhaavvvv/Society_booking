const FACILITY_ID_MAP = {
  gym: 1,
  "swimming-pool": 2,
  "badminton-court": 3,
  "lawn-tennis": 4,
  "table-tennis": 5,
  pickleball: 6,
};

export const fetchSlots = async (facilityName, date) => {
  const facilityId = FACILITY_ID_MAP[facilityName];

  if (!facilityId) {
    throw new Error(`Invalid facility name: ${facilityName}`);
  }

  const url = `http://127.0.0.1:8000/facilities/${facilityId}/slots?booking_date=${date}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch slots");
  }

  /**
   * Backend response already contains:
   * {
   *   id,
   *   start_time,
   *   end_time,
   *   max_capacity_units,
   *   consumed_units,
   *   remaining_units,
   *   status
   * }
   *
   * DO NOT transform it.
   */
  return response.json();
};
