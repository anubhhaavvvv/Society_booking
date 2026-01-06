import { useEffect, useState } from "react";
import { fetchMyBookings, cancelBooking } from "../api/bookings";
import FaultyBackground from "../components/FaultyBackground";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  async function loadBookings() {
    try {
      setLoading(true);
      const data = await fetchMyBookings();
      setBookings(data);
    } catch {
      setError("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleCancel(id) {
    try {
      setCancelingId(id);
      await cancelBooking(id);
      await loadBookings();
    } catch {
      alert("Failed to cancel booking.");
    } finally {
      setCancelingId(null);
    }
  }

  return (
<div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
     <FaultyBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-24">
        {/* HEADER */}
        <h1 className="text-5xl font-extrabold mb-3">
          My Bookings
        </h1>
        <p className="text-slate-400 max-w-2xl mb-12">
          View and manage your facility bookings.
        </p>

        {/* STATES */}
        {loading && (
          <p className="text-slate-400">Loading bookings...</p>
        )}

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        {!loading && !error && bookings.length === 0 && (
          <p className="text-slate-400">
            You don’t have any bookings yet.
          </p>
        )}

        {/* BOOKINGS GRID */}
        {!loading && !error && bookings.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const active = booking.status === "BOOKED";

              return (
                <div
                  key={booking.id}
                  className="
                    rounded-3xl
                    bg-white/5
                    backdrop-blur-lg
                    border
                    border-white/10
                    p-6
                  "
                >
                  <h2 className="text-xl font-semibold mb-1">
                    {booking.facility_name}
                  </h2>

                  <p className="text-sm text-slate-400">
                    {booking.booking_date}
                  </p>

                  <p className="text-sm text-slate-300 mt-1">
                    {booking.start_time} – {booking.end_time}
                  </p>

                  <p
                    className={`mt-3 text-sm font-medium ${
                      active
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {booking.status}
                  </p>

                  {active && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelingId === booking.id}
                      className="
                        mt-5
                        text-sm
                        text-red-400
                        hover:underline
                        disabled:text-slate-500
                      "
                    >
                      {cancelingId === booking.id
                        ? "Cancelling..."
                        : "Cancel booking"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
