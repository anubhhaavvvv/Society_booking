import { setToken } from "../utils/auth";

const API_BASE = "http://localhost:8000";

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }), // 🔑 FIX
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Login failed");
  }

  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function register(email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }), // 🔑 FIX
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Register failed");
  }

  const data = await res.json();
  setToken(data.access_token);
  return data;
}
