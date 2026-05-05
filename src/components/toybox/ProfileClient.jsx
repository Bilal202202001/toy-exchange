"use client";

import { useCallback, useEffect, useState } from "react";
import { persistServerProfileFields } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/apiClient";
import { defaultProfile, loadProfile } from "@/lib/profile";
import { mapApiToyToListing } from "@/lib/mapToyListing";
import ProfileView from "./ProfileView";

export default function ProfileClient() {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);

  const [listedToys, setListedToys] = useState([]);
  const [exchanged, setExchanged] = useState([]);

  const load = useCallback(async () => {
    const meRes = await apiFetch("/api/auth/me");
    if (!meRes.ok) {
      setProfile(loadProfile());
      setListedToys([]);
      setExchanged([]);
      return;
    }

    const me = await meRes.json();
    persistServerProfileFields(me);
    setProfile(loadProfile());

    const toyRes = await apiFetch("/api/toys?mine=1");
    const toyData = toyRes.ok ? await toyRes.json() : {};
    const toys = Array.isArray(toyData.toys) ? toyData.toys : [];
    setListedToys(toys.map(mapApiToyToListing));

    const n =
      typeof me.exchangesCompleted === "number" && Number.isFinite(me.exchangesCompleted)
        ? me.exchangesCompleted
        : 0;
    setExchanged(Array.from({ length: Math.max(0, Math.floor(n)) }));
  }, []);

  useEffect(() => {
    void load().finally(() => setHydrated(true));
  }, [load]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") void load();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [load]);

  if (!hydrated) {
    return (
      <div className="w-full space-y-6 py-8">
        <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="mx-auto h-6 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <ProfileView
      profile={profile}
      listedToys={listedToys}
      exchanged={exchanged}
      isSelf
    />
  );
}
