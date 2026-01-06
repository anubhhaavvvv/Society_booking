import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/auth");
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            rounded-xl
            bg-black/20
            backdrop-blur-md
            border
            border-white/5
            px-6
            py-3
          "
        >
          {/* Brand */}
          <div className="text-base font-medium tracking-wide text-white">
            SocietyBooking
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <NavLink
              to="/facilities"
              className={({ isActive }) =>
                isActive
                  ? "text-cyan-400"
                  : "text-slate-300 hover:text-white"
              }
            >
              Facilities
            </NavLink>

            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                isActive
                  ? "text-cyan-400"
                  : "text-slate-300 hover:text-white"
              }
            >
              My Bookings
            </NavLink>

            <button
              onClick={handleLogout}
              className="text-slate-300 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
