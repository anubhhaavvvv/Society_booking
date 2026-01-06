import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";
import FaultyBackground from "../components/FaultyBackground";

import MovingRectangles from "../components/MovingRectangles";


export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate("/facilities");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
<div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
     <FaultyBackground />

      <MovingRectangles />

      {/* AUTH CARD */}
      <form
        onSubmit={handleSubmit}
        className="
          relative z-10
          w-[380px]
          rounded-3xl
          bg-white/8
          backdrop-blur-xl
          p-8
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      >
        <h1 className="text-3xl font-semibold text-center mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="text-sm text-slate-400 text-center mb-8">
          SocietyBooking Secure Access
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full
            rounded-xl
            bg-black/40
            border
            border-white/10
            px-4
            py-3
            text-white
            placeholder-slate-400
            focus:outline-none
            focus:ring-1
            focus:ring-cyan-400
          "
        />

        {/* PASSWORD */}
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            mt-4
            w-full
            rounded-xl
            bg-black/40
            border
            border-white/10
            px-4
            py-3
            text-white
            placeholder-slate-400
            focus:outline-none
            focus:ring-1
            focus:ring-cyan-400
          "
        />

        <button
          type="submit"
          disabled={loading}
          className={`
            mt-6
            w-full
            rounded-xl
            py-3
            font-medium
            transition-all
            ${
              loading
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-400 text-black"
            }
          `}
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 w-full text-sm text-cyan-400 hover:underline"
        >
          {isLogin
            ? "New here? Create an account"
            : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}
