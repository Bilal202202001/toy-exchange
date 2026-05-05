/** Legacy browser-only toy rows (optional). Listing pages use Mongo IDs + `/api/toys`. */

export const MY_TOYS_STORAGE_KEY = "toybox-my-listings";

function loadMyToys() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MY_TOYS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getMyToyById(id) {
  const s = String(id);
  return loadMyToys().find((t) => String(t.id) === s) ?? null;
}

/** Old demo ids (`mine-*`) — hide "request exchange" like an owned listing. */
export function isMyListingId(id) {
  return String(id).startsWith("mine-");
}
