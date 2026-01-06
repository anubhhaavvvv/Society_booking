const TOKEN_KEY = "access_token";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem("access_token");
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function getAuthHeader() {
  const token = getToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
