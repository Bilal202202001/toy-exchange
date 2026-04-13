/** Resolve listings shown on someone else's profile (feed + shared seed; not your private localStorage). */

import { toyListings } from "@/data/toyListings";
import { myToysDummyListings } from "@/data/myToysSeed";
import { usersDirectory } from "@/data/usersDirectory";

export function normalizeProfileUsername(s) {
  if (!s || typeof s !== "string") return "";
  return s.trim().toLowerCase();
}

export function getPublicListingsForUsername(username) {
  const u = normalizeProfileUsername(username);
  if (!u) return [];
  const fromFeed = toyListings.filter((t) => normalizeProfileUsername(t.ownerUsername) === u);
  const fromSeed = myToysDummyListings.filter(
    (t) => normalizeProfileUsername(t.ownerUsername) === u
  );
  return [...fromSeed, ...fromFeed];
}

export function hasDirectoryEntry(username) {
  const u = normalizeProfileUsername(username);
  return u !== "" && Boolean(usersDirectory[u]);
}

export function getDirectoryProfile(username) {
  const u = normalizeProfileUsername(username);
  if (!u) return null;
  return usersDirectory[u] ? { ...usersDirectory[u], username: u } : null;
}
