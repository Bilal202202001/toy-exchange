import { getStoredToken } from "@/lib/authToken";

/** @typedef {{ Authorization?: string } & Record<string, string>} HeadersInit */

export async function apiFetch(path, options = {}) {
  const token = getStoredToken();
  /** @type {HeadersInit} */
  const h = {};
  if (options.headers && typeof options.headers === "object" && !(options.headers instanceof Headers)) {
    Object.assign(h, /** @type {Record<string,string>} */ (options.headers));
  }

  const isForm =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isForm && !h["Content-Type"] && options.body !== undefined) {
    h["Content-Type"] = "application/json";
  }
  if (token) {
    h.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    ...options,
    headers: h,
  });
  return res;
}
