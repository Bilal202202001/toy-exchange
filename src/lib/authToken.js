const TOKEN_STORAGE_KEY = "toybox_token";
const TOKEN_COOKIE_NAME = "tb_token";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistAuthToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token || "");
  if (token) {
    document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)};path=/;max-age=${COOKIE_MAX_AGE_SECONDS};SameSite=Lax`;
  } else {
    document.cookie = `${TOKEN_COOKIE_NAME}=;path=/;max-age=0;SameSite=Lax`;
  }
}

export function clearAuthToken() {
  persistAuthToken("");
}
