/** Browser-only persistence for toys added on the My Toys page */

import { myToysDummyListings } from "@/data/myToysSeed";

export const MY_TOYS_STORAGE_KEY = "toybox-my-listings";
const HIDDEN_SEED_IDS_KEY = "toybox-my-listings-hidden-seeds";
const MY_TOYS_TRASH_KEY = "toybox-my-listings-trash";

function loadTrash() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MY_TOYS_TRASH_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTrash(toys) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MY_TOYS_TRASH_KEY, JSON.stringify(toys));
}

function loadHiddenSeedIds() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(HIDDEN_SEED_IDS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

function saveHiddenSeedIds(set) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HIDDEN_SEED_IDS_KEY, JSON.stringify([...set]));
}

/** Dummy listings minus any the user dismissed (stored by id). */
export function getVisibleSeedListings() {
  const hidden = loadHiddenSeedIds();
  return myToysDummyListings.filter((t) => !hidden.has(String(t.id)));
}

/** Seed demos + user-added toys (new items appended after seeds). */
export function getAllMyToys() {
  const seeds =
    typeof window === "undefined" ? myToysDummyListings : getVisibleSeedListings();
  const user = typeof window === "undefined" ? [] : loadMyToys();
  return [...seeds, ...user];
}

export function loadMyToys() {
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

export function saveMyToys(toys) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MY_TOYS_STORAGE_KEY, JSON.stringify(toys));
}

export function getMyToyById(id) {
  const s = String(id);
  const hidden = typeof window !== "undefined" ? loadHiddenSeedIds() : new Set();
  const seed = myToysDummyListings.find((t) => String(t.id) === s && !hidden.has(s));
  if (seed) return seed;
  return loadMyToys().find((t) => String(t.id) === s) ?? null;
}

export function addMyToy(toy) {
  const toys = loadMyToys();
  toys.push(toy);
  saveMyToys(toys);
  return toy;
}

export function removeMyToy(id) {
  const s = String(id);
  const isSeed = myToysDummyListings.some((t) => String(t.id) === s);
  if (isSeed) {
    const hidden = loadHiddenSeedIds();
    hidden.add(s);
    saveHiddenSeedIds(hidden);
    return;
  }
  const toys = loadMyToys();
  const idx = toys.findIndex((t) => String(t.id) === s);
  if (idx === -1) return;
  const [removed] = toys.splice(idx, 1);
  saveMyToys(toys);
  const trash = loadTrash();
  trash.unshift(removed);
  saveTrash(trash);
}

/** Restore hidden seed demos and listings soft-deleted to trash (same browser). */
export function recoverAllDeletedMyToys() {
  if (typeof window === "undefined") {
    return { restoredSeeds: 0, restoredListings: 0 };
  }
  const restoredSeeds = loadHiddenSeedIds().size;
  localStorage.removeItem(HIDDEN_SEED_IDS_KEY);

  const trash = loadTrash();
  const restoredListings = trash.length;
  if (trash.length > 0) {
    const main = loadMyToys();
    const existingIds = new Set(main.map((t) => String(t.id)));
    const toMerge = trash.filter((t) => !existingIds.has(String(t.id)));
    saveMyToys([...main, ...toMerge]);
    localStorage.removeItem(MY_TOYS_TRASH_KEY);
  }

  return { restoredSeeds, restoredListings };
}

export function hasRecoverableDeleted() {
  if (typeof window === "undefined") return false;
  return loadHiddenSeedIds().size > 0 || loadTrash().length > 0;
}

/** My Toys listings (seed + user-added) use ids with the `mine-` prefix. */
export function isMyListingId(id) {
  return String(id).startsWith("mine-");
}
