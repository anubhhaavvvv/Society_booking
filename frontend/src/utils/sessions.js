let timeoutId;

export function startSessionTimer() {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  }, 2 * 60 * 1000); // 2 minutes
}

export function resetSessionTimer() {
  startSessionTimer();
}
