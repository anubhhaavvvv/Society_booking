import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { isAuthenticated } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-28">
        {children}
      </div>
    </>
  );
}
