"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { normalizeProfileUsername, defaultProfile, loadProfile, slugifyUsername } from "@/lib/profile";
import { apiFetch } from "@/lib/apiClient";
import { mapApiToyToListing } from "@/lib/mapToyListing";
import ProfileView from "./ProfileView";

export default function PublicProfileClient({ username: usernameParam }) {
  const searchParams = useSearchParams();
  const exchangeParamRaw = searchParams.get("exchange");
  const exchangeParam =
    typeof exchangeParamRaw === "string" && /^[a-f0-9]{24}$/i.test(exchangeParamRaw)
      ? exchangeParamRaw
      : null;

  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [listedToys, setListedToys] = useState([]);
  const [exchanged, setExchanged] = useState([]);
  const [ratingTargetUserId, setRatingTargetUserId] = useState(null);
  const [isSelf, setIsSelf] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const normalizedParam = useMemo(
    () => normalizeProfileUsername(usernameParam),
    [usernameParam],
  );

  const refresh = useCallback(async () => {
    if (!normalizedParam) {
      setNotFound(true);
      setHydrated(true);
      return;
    }

    const res = await apiFetch(`/api/users/${encodeURIComponent(normalizedParam)}`);
    if (res.status === 404 || !res.ok) {
      setNotFound(true);
      setHydrated(true);
      return;
    }

    const data = await res.json();
    /** @type {any} */
    const p = data.profile;
    if (!p?.username) {
      setNotFound(true);
      setHydrated(true);
      return;
    }

    const selfVisit = !!data.isSelf;
    const meU = slugifyUsername(loadProfile().username || "");
    setIsSelf(selfVisit || meU === normalizeProfileUsername(p.username));

    setRatingTargetUserId(typeof p.id === "string" ? p.id : null);
    setNotFound(false);

    setProfile({
      displayName: p.displayName ?? p.username ?? "",
      username: slugifyUsername(p.username || ""),
      bio: p.bio || "",
      location: p.location || "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      avatarUrl: p.avatarUrl ?? null,
      following: typeof p.following === "number" ? p.following : 0,
      followers: typeof p.followers === "number" ? p.followers : 0,
      likes: typeof p.likes === "number" ? p.likes : 0,
      reliability:
        typeof p.reliability === "number" && Number.isFinite(p.reliability)
          ? p.reliability
          : Number(p.reliabilityAvg ?? 8),
    });

    const listings = Array.isArray(data.listings) ? data.listings : [];
    setListedToys(listings.map(mapApiToyToListing));

    const ex =
      typeof p.exchangesCompleted === "number" && Number.isFinite(p.exchangesCompleted)
        ? Math.max(0, Math.floor(p.exchangesCompleted))
        : 0;
    setExchanged(Array.from({ length: ex }));

    setHydrated(true);
  }, [normalizedParam]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") void refresh();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refresh]);

  if (!hydrated) {
    return (
      <div className="w-full space-y-6 py-8">
        <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="mx-auto h-6 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-800">Profile not found</p>
        <p className="mt-2 text-sm text-slate-500">
          There is no member with the username @{usernameParam || "unknown"}.
        </p>
        <Link
          href="/toybox"
          className="mt-6 inline-block font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
        >
          Back to listings
        </Link>
      </div>
    );
  }

  const showRating = exchangeParam && ratingTargetUserId && !isSelf;

  return (
    <ProfileView
      profile={profile}
      listedToys={listedToys}
      exchanged={exchanged}
      isSelf={isSelf}
      pendingRatingExchangeId={showRating ? exchangeParam : null}
      ratingTargetUserId={showRating ? ratingTargetUserId : null}
    />
  );
}
