import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchSlots } from "../api/slots";
import { createBooking } from "../api/bookings";
import FaultyBackground from "../components/FaultyBackground";

/* ---------- CONFIG ---------- */
const INDIVIDUAL_FACILITIES = ["gym", "swimming-pool"];

/* ---------- HELPERS ---------- */
const getRequiredUnits = (type, count) => {
  if (type === "individual") return count;
  if (type === "single") return 4;
  if (type === "double") return count;
  return 0;
};

const FACILITY_ID_MAP = {
  gym: 1,
  "swimming-pool": 2,
  "badminton-court": 3,
  "lawn-tennis": 4,
  "table-tennis": 5,
  pickleball: 6,
};

export default function FacilityDetail() {
  const { name } = useParams();
  const isIndividualFacility = INDIVIDUAL_FACILITIES.includes(name);

  /* ---------- STATE ---------- */
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [bookingType, setBookingType] = useState(
    isIndividualFacility ? "individual" : "single"
  );
  const [playerCount, setPlayerCount] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  /* ---------- FETCH SLOTS ---------- */
  useEffect(() => {
    if (!date) return;

    setLoading(true);
    setError(null);
    setSelectedSlot(null);

    fetchSlots(name, date)
      .then(setSlots)
      .catch(() => {
        setError("Unable to load slots.");
        setSlots([]);
      })
      .finally(() => setLoading(false));
  }, [date, name]);

  /* ---------- BOOKING ---------- */
  async function handleBooking() {
    if (!selectedSlot || bookingLoading) return;

    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(false);

    try {
      await createBooking({
        facilityId: FACILITY_ID_MAP[name],
        timeSlotId: selectedSlot.id,
        bookingDate: date,
        bookingType,
        playerCount,
      });

      setBookingSuccess(true);
      setSelectedSlot(null);

      const updatedSlots = await fetchSlots(name, date);
      setSlots(updatedSlots);

      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (err) {
      setBookingError(err.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  }

  return (
<div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
     <FaultyBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-24">
        {/* HEADER */}
        <h1 className="text-5xl font-extrabold capitalize mb-3">
          {name.replace("-", " ")}
        </h1>
        <p className="text-slate-400 mb-10">
          Select date and slot.
        </p>

        {/* DATE PICKER */}
        <div className="max-w-sm mb-10">
          <label className="block text-sm text-slate-400 mb-2">
            Booking Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:ring-1 focus:ring-cyan-400"
            style={{ colorScheme: "dark" }}
          />
        </div>

        {/* BOOKING OPTIONS */}
        <div className="max-w-xl mb-14 space-y-6">
          {/* Singles / Doubles ONLY for courts */}
          {!isIndividualFacility && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Booking Type
              </label>
              <div className="flex gap-4">
                {["single", "double"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setBookingType(type);
                      setPlayerCount(type === "single" ? 2 : 1);
                    }}
                    className={`px-5 py-2 rounded-xl border text-sm ${
                      bookingType === type
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "border-white/10 text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    {type === "single" ? "Singles" : "Doubles"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Player / Slot count */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              {isIndividualFacility ? "Number of Slots" : "Number of Players"}
            </label>
            <input
              type="number"
              min={1}
              max={
                isIndividualFacility
                  ? selectedSlot?.remaining_units || 35
                  : bookingType === "single"
                  ? 2
                  : 4
              }
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="w-32 rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-white"
            />
          </div>
        </div>

        {/* SLOTS */}
        <h2 className="text-2xl font-semibold mb-6">
          Available Slots
        </h2>

        {loading && <p className="text-slate-400">Loading slots...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && date && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-16">
            {slots.map((slot) => {
              const requiredUnits = getRequiredUnits(
                bookingType,
                playerCount
              );

              const disabled =
                slot.status === "past" ||
                slot.remaining_units < requiredUnits;

              const statusStyles = {
                available: "border-emerald-400/40 bg-emerald-400/10",
                limited: "border-yellow-400/40 bg-yellow-400/10",
                full: "border-red-400/40 bg-red-400/10",
                past: "border-slate-600 bg-slate-700/30",
              };

              return (
                <button
                  key={slot.id}
                  disabled={disabled}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-xl px-4 py-4 text-sm border text-left transition-all
                    ${statusStyles[slot.status]}
                    ${disabled ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-[1px]"}
                    ${selectedSlot?.id === slot.id ? "ring-2 ring-cyan-400" : ""}
                  `}
                >
                  <div className="font-semibold">
                    {slot.start_time} – {slot.end_time}
                  </div>

                  <div className="mt-1 text-xs text-slate-300">
                    Remaining: {slot.remaining_units} / {slot.max_capacity_units}
                  </div>

                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                    {slot.status}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* CONFIRM */}
        <div className="max-w-md">
          <button
            onClick={handleBooking}
            disabled={!selectedSlot || bookingLoading}
            className={`w-full py-4 rounded-2xl text-lg font-semibold ${
              selectedSlot
                ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            {bookingLoading ? "Confirming..." : "Confirm Booking"}
          </button>

          {bookingSuccess && (
            <p className="mt-4 text-emerald-400 text-sm">
              Booking confirmed successfully.
            </p>
          )}

          {bookingError && (
            <p className="mt-4 text-red-400 text-sm">
              {bookingError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
