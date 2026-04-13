"use client";

import { useCallback, useEffect, useState } from "react";
import { exchangedToysMock } from "@/data/exchangedToysMock";
import { defaultProfile, loadProfile } from "@/lib/profile";
import { getAllMyToys } from "@/lib/myToyListings";
import ProfileView from "./ProfileView";

export default function ProfileClient() {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [listedToys, setListedToys] = useState([]);

  const exchanged = exchangedToysMock;

  const refreshListed = useCallback(() => {
    setListedToys(getAllMyToys());
  }, []);

  useEffect(() => {
    setProfile(loadProfile());
    refreshListed();
    setHydrated(true);
  }, [refreshListed]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") {
        setProfile(loadProfile());
        refreshListed();
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refreshListed]);

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
