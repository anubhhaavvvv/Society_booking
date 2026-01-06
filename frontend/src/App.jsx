import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Facilities from "./pages/Facilities";
import FacilityDetail from "./pages/FacilityDetail";
import MyBookings from "./pages/MyBookings";

import ProtectedRoute from "./components/ProtectedRoute";
import FancyCursor from "./components/FancyCursor";

function App() {
  return (
    <>
      <FancyCursor />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes */}
          <Route
            path="/facilities"
            element={
              <ProtectedRoute>
                <Facilities />
              </ProtectedRoute>
            }
          />

          <Route
            path="/facilities/:name"
            element={
              <ProtectedRoute>
                <FacilityDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
