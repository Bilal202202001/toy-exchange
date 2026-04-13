"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { exchangedToysMock } from "@/data/exchangedToysMock";
import {
  getDirectoryProfile,
  getPublicListingsForUsername,
  normalizeProfileUsername,
} from "@/lib/publicProfiles";
import { defaultProfile, loadProfile } from "@/lib/profile";
import { getAllMyToys } from "@/lib/myToyListings";
import ProfileView from "./ProfileView";

export default function PublicProfileClient({ username: usernameParam }) {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [listedToys, setListedToys] = useState([]);
  const [exchanged, setExchanged] = useState([]);
  const [isSelf, setIsSelf] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const normalizedParam = useMemo(
    () => normalizeProfileUsername(usernameParam),
    [usernameParam]
  );

  const refresh = useCallback(() => {
    const me = loadProfile();
    const meU = normalizeProfileUsername(me.username);
    if (!normalizedParam) {
      setNotFound(true);
      setHydrated(true);
      return;
    }

    if (meU === normalizedParam) {
      setIsSelf(true);
      setNotFound(false);
      setProfile(me);
      setListedToys(getAllMyToys());
      setExchanged(exchangedToysMock);
      setHydrated(true);
      return;
    }

    setIsSelf(false);
    const dir = getDirectoryProfile(normalizedParam);
    if (!dir) {
      setNotFound(true);
      setHydrated(true);
      return;
    }

    setNotFound(false);
    setProfile({
      displayName: dir.displayName,
      username: dir.username,
      bio: dir.bio,
      location: dir.location,
      avatarUrl: dir.avatarUrl,
      following: dir.following,
      followers: dir.followers,
      likes: dir.likes,
    });
    setListedToys(getPublicListingsForUsername(normalizedParam));
    setExchanged(dir.exchanged ?? []);
    setHydrated(true);
  }, [normalizedParam]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") refresh();
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

  return (
    <ProfileView
      profile={profile}
      listedToys={listedToys}
      exchanged={exchanged}
      isSelf={isSelf}
    />
  );
}
