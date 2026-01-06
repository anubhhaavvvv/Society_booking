import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_BASE = "http://127.0.0.1:8000";

/* ---------------- MY BOOKINGS ---------------- */
export async function fetchMyBookings() {
  const res = await fetchWithAuth(`${API_BASE}/bookings/me`);

  if (!res.ok) {
    throw new Error("Failed to load bookings");
  }

  return res.json();
}

/* ---------------- CREATE BOOKING ---------------- */
export async function createBooking({
  facilityId,
  timeSlotId,
  bookingDate,
  bookingType,
  playerCount,
}) {
  const params = new URLSearchParams({
    facility_id: facilityId,
    time_slot_id: timeSlotId,
    booking_date: bookingDate,
    booking_type: bookingType,
    player_count: playerCount,
  });

  const res = await fetchWithAuth(
    `${API_BASE}/bookings?${params.toString()}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Booking failed");
  }

  return res.json();
}

/* ---------------- CANCEL BOOKING ---------------- */
export async function cancelBooking(bookingId) {
  const res = await fetchWithAuth(
    `${API_BASE}/bookings/${bookingId}/cancel`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Cancel failed");
  }

  return res.json();
}
