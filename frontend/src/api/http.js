import { getToken, setToken, logout } from "../utils/auth";

const API_BASE = "http://127.0.0.1:8000";

export async function authFetch(url, options = {}) {
  let token = getToken();

  let res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include", // 🔑 send refresh cookie
  });

  // Access token expired → refresh
  if (res.status === 401) {
    const refresh = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refresh.ok) {
      logout();
      window.location.href = "/";
      throw new Error("Session expired");
    }

    const data = await refresh.json();
    setToken(data.access_token);

    // retry original request
    token = data.access_token;
    res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  }

  return res;
}
