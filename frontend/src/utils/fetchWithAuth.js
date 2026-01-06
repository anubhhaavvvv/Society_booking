import { getAuthHeader, clearToken } from "./auth";

export async function fetchWithAuth(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...getAuthHeader(),
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    clearToken();
    window.location.href = "/auth";
    throw new Error("Session expired");
  }

  return response;
}
