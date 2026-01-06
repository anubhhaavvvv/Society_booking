import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpotlightCarousel from "../components/SpotlightCarousel";
import FaultyBackground from "../components/FaultyBackground";
import PageTransition from "../components/PageTransition";
import FacilitySkeleton from "../components/FacilitySkeleton";

/* ---------- SHUFFLE UTILITY ---------- */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/* ---------- SOURCE DATA ---------- */
const FACILITIES = [
  {
    name: "Gym",
    slug: "gym",
    accent: "#3b82f6",
    images: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
      "https://images.unsplash.com/photo-1623874514711-0f321325f318",
    ],
  },
  {
    name: "Swimming Pool",
    slug: "swimming-pool",
    accent: "#06b6d4",
    images: [
      "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8",
      "https://images.unsplash.com/photo-1519315901367-f34ff9154487",
      "https://images.unsplash.com/photo-1530549387789-4c1017266635",
    ],
  },
  {
    name: "Badminton Court",
    slug: "badminton-court",
    accent: "#22c55e",
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
      "https://plus.unsplash.com/premium_photo-1664303134673-7a073bf3fb54",
      "https://images.unsplash.com/photo-1597309792995-1f61243fca21",
    ],
  },
  {
    name: "Lawn Tennis",
    slug: "lawn-tennis",
    accent: "#a855f7",
    images: [
      "https://images.unsplash.com/photo-1650496760462-cb983aca287d",
      "https://images.unsplash.com/photo-1566241121793-3e25f3586e43",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07c",
    ],
  },
  {
    name: "Pickleball",
    slug: "pickleball",
    accent: "#f97316",
    images: [
      "https://images.unsplash.com/photo-1693142518820-78d7a05f1546",
      "https://images.unsplash.com/photo-1693142519354-c72652e97e24",
      "https://images.unsplash.com/photo-1737476997205-b3336182f215",
    ],
  },
];

/* ---------- COMPONENT ---------- */
export default function Facilities() {
  const navigate = useNavigate();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);

      // simulate async fetch + shuffle
      setTimeout(() => {
        setFacilities(shuffleArray(FACILITIES));
        setLoading(false);
      }, 600);
    } catch {
      setError("Unable to load facilities.");
      setLoading(false);
    }
  }, []);

  return (
    <PageTransition>
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        <FaultyBackground />


        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-24">
          {/* HEADER */}
          <h1 className="text-6xl font-extrabold tracking-tight mb-3">
            Facilities
          </h1>
          <p className="text-slate-400 max-w-2xl mb-12">
            Choose a facility to view available slots and make a booking.
          </p>

          {/* STATES */}
          {loading && <FacilitySkeleton />}

          {error && (
            <p className="text-red-400">{error}</p>
          )}

          {!loading && !error && facilities.length === 0 && (
            <p className="text-slate-400">
              No facilities available at the moment.
            </p>
          )}

          {/* CAROUSEL */}
          {!loading && !error && facilities.length > 0 && (
            <SpotlightCarousel
              facilities={facilities}
              onSelect={(slug) =>
                navigate(`/facilities/${slug}`)
              }
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
