/** Browser-only profile — replace with API + auth later */

export const PROFILE_STORAGE_KEY = "toybox-profile";

export const defaultProfile = {
  displayName: "Sabahat Hussain",
  username: "sabahat_hussain",
  bio: "Parent of two. Love sustainable swaps and LEGO nights.",
  location: "Austin, TX",
  email: "sabahat_hussain@gmail.com",
  phone: "",
  avatarUrl: null,
  /** Mock social stats (editable in profile settings) */
  following: 42,
  followers: 128,
  likes: 316,
};

export function loadProfile() {
  if (typeof window === "undefined") {
    return { ...defaultProfile };
  }
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...defaultProfile };
    const parsed = JSON.parse(raw);
    return { ...defaultProfile, ...parsed };
  } catch {
    return { ...defaultProfile };
  }
}

export function saveProfile(partial) {
  if (typeof window === "undefined") return;
  const prev = loadProfile();
  const next = { ...prev, ...partial };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function slugifyUsername(s) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 30);
}

export function profileInitials(name) {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
