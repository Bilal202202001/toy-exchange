"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Grid3X3,
  MapPin,
  Package,
  Pencil,
} from "lucide-react";
import { exchangedToysMock } from "@/data/exchangedToysMock";
import { defaultProfile, loadProfile, profileInitials } from "@/lib/profile";
import { getAllMyToys } from "@/lib/myToyListings";

function ProfileGridThumb({ href, imageUrl, title, subtitle, isLocal }) {
  return (
    <Link
      href={href}
      className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-100 sm:rounded-xl"
    >
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, (max-width: 1536px) 16vw, 14vw"
        unoptimized={isLocal}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
        <p className="line-clamp-2 text-[11px] font-bold leading-tight text-white sm:text-xs">
          {title}
        </p>
        {subtitle ? (
          <p className="mt-0.5 line-clamp-1 text-[10px] text-white/85">{subtitle}</p>
        ) : null}
      </div>
    </Link>
  );
}

export default function ProfileClient() {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [listedToys, setListedToys] = useState([]);
  const [tab, setTab] = useState("listed");

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

  const coverUrl = profile.avatarUrl;
  const isLocalAvatar =
    typeof coverUrl === "string" &&
    (coverUrl.startsWith("blob:") || coverUrl.startsWith("data:"));

  return (
    <div className="w-full min-w-0">
      {/* TikTok-style header */}
      <div className="flex flex-col items-center px-2 pb-6 pt-2 text-center sm:px-0">
        <div className="relative">
          <div className="relative h-[7.5rem] w-[7.5rem] overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-[#e0f7fa] sm:h-32 sm:w-32">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={profile.displayName}
                fill
                className="object-cover"
                unoptimized={isLocalAvatar}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#80deea] to-[#00C4D9] text-3xl font-bold text-white sm:text-4xl">
                {profileInitials(profile.displayName)}
              </div>
            )}
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {profile.displayName}
        </h1>
        <p className="mt-1 text-base font-medium text-slate-500">@{profile.username}</p>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-bold text-slate-900">{profile.following}</span> following
          <span className="mx-2 text-slate-300" aria-hidden>
            ·
          </span>
          <span className="font-bold text-slate-900">{profile.followers}</span> followers
        </p>

        <div className="mt-5 grid w-full grid-cols-3 gap-2 border-y border-slate-100 py-4 sm:px-4 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">{listedToys.length}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Listed
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">{exchanged.length}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Exchanged
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">{profile.likes ?? 0}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Likes
            </p>
          </div>
        </div>

        {profile.bio ? (
          <p className="mx-auto mt-4 w-full max-w-4xl px-4 text-center text-sm leading-relaxed text-slate-700 sm:px-6 lg:px-8">
            {profile.bio}
          </p>
        ) : null}

        <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0 text-[#00C4D9]" aria-hidden />
          {profile.location || "Add your city"}
        </div>

        <Link
          href="/toybox/profile/edit"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:border-[#B2EBF2] hover:bg-[#e0f7fa]/40"
        >
          <Pencil className="h-4 w-4 text-[#00C4D9]" aria-hidden />
          Edit profile
        </Link>
      </div>

      {/* Tabs + grid */}
      <div className="mt-2 border-t border-slate-100">
        <div
          className="grid grid-cols-2 border-b border-slate-100"
          role="tablist"
          aria-label="Profile content"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "listed"}
            onClick={() => setTab("listed")}
            className={`flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${
              tab === "listed"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Grid3X3 className="h-4 w-4" aria-hidden />
            Listed
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "exchanged"}
            onClick={() => setTab("exchanged")}
            className={`flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${
              tab === "exchanged"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Package className="h-4 w-4" aria-hidden />
            Exchanged
          </button>
        </div>

        <div className="mt-1" role="tabpanel">
          {tab === "listed" && (
            <>
              {listedToys.length === 0 ? (
                <div className="py-16 text-center text-sm text-slate-500">
                  <p>No listings yet.</p>
                  <Link
                    href="/toybox/my-toys/add"
                    className="mt-3 inline-block font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
                  >
                    Add a toy
                  </Link>
                </div>
              ) : (
                <div className="grid w-full grid-cols-3 gap-0.5 sm:grid-cols-4 sm:gap-1 lg:grid-cols-5 xl:grid-cols-6">
                  {listedToys.map((t) => {
                    const img = t.images?.[0] ?? t.imageUrl;
                    const local =
                      typeof img === "string" &&
                      (img.startsWith("blob:") || img.startsWith("data:"));
                    return (
                      <ProfileGridThumb
                        key={t.id}
                        href={`/toybox/${t.id}`}
                        imageUrl={img}
                        title={t.title}
                        subtitle={t.listedOn ? `Listed ${t.listedOn}` : null}
                        isLocal={local}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

          {tab === "exchanged" && (
            <div className="grid w-full grid-cols-3 gap-0.5 sm:grid-cols-4 sm:gap-1 lg:grid-cols-5 xl:grid-cols-6">
              {exchanged.map((t) => (
                <ProfileGridThumb
                  key={t.id}
                  href={`/toybox/${t.toyId}`}
                  imageUrl={t.imageUrl}
                  title={t.title}
                  subtitle={`From ${t.receivedFrom}`}
                  isLocal={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
