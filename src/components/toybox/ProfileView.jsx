"use client";

import Image from "next/image";
import Link from "next/link";
import { profileInitials } from "@/lib/profile";
import { useChatWidget } from "@/contexts/ChatWidgetContext";

const PRIMARY = "#4c99e6";

function ToyGridItem({ toy, isSelf }) {
  const img = toy.images?.[0] ?? toy.imageUrl;
  const local =
    typeof img === "string" && (img.startsWith("blob:") || img.startsWith("data:"));

  return (
    <Link
      href={`/toybox/${toy.id}`}
      className="group relative flex flex-col gap-2"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-200 shadow-sm dark:bg-slate-800">
        {isSelf ? (
          <div
            className="absolute right-1.5 top-1.5 z-10 flex size-7 items-center justify-center rounded-lg border border-slate-100 bg-white/95 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200"
            aria-hidden
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </div>
        ) : null}
        <Image
          src={img}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 160px"
          unoptimized={local}
        />
      </div>
      <p className="truncate px-1 text-center text-[13px] font-semibold leading-tight text-slate-700 dark:text-slate-300">
        {toy.title}
      </p>
    </Link>
  );
}

export default function ProfileView({ profile, listedToys, exchanged, isSelf }) {
  const { openWidgetForPeerUsername } = useChatWidget();

  const coverUrl = profile.avatarUrl;
  const isLocalAvatar =
    typeof coverUrl === "string" &&
    (coverUrl.startsWith("blob:") || coverUrl.startsWith("data:"));

  const reliability = Number(profile.reliability);
  const reliabilityScore =
    Number.isFinite(reliability) && !Number.isNaN(reliability)
      ? Math.min(10, Math.max(0, Math.round(reliability)))
      : 10;

  const toyPreview = listedToys.slice(0, 6);
  const viewAllHref = isSelf ? "/toybox/my-toys" : "/toybox";

  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100">
      {/* Top bar — matches mock: title + edit (self) or back + message (other) */}
      <div className="mb-6 grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800 sm:mb-8 sm:pb-6">
        <div className="flex justify-start">
          {!isSelf ? (
            <Link
              href="/toybox"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Back to ToyBox"
            >
              <span className="material-symbols-outlined text-[24px] leading-none">
                arrow_back
              </span>
            </Link>
          ) : (
            <span className="block w-10" aria-hidden />
          )}
        </div>
        <h1 className="text-center text-lg font-bold leading-tight tracking-tight">
          Profile
        </h1>
        <div className="flex justify-end">
          {isSelf ? (
            <Link
              href="/toybox/profile/edit"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-900 transition-colors hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Edit profile"
            >
              <span className="material-symbols-outlined text-[24px] leading-none">
                edit
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openWidgetForPeerUsername(profile.username)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-900 transition-colors hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Message"
            >
              <span className="material-symbols-outlined text-[24px] leading-none">
                chat
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Header: avatar + name + location + reliability */}
      <div className="flex flex-col items-center px-2 pb-6 sm:px-6">
        <div className="relative">
          <div
            className="relative h-[7.75rem] w-[7.75rem] shrink-0 overflow-hidden rounded-full border-4 border-white shadow-sm dark:border-slate-800 sm:h-32 sm:w-32"
            style={{ minHeight: "7.75rem", minWidth: "7.75rem" }}
          >
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt=""
                fill
                className="object-cover"
                unoptimized={isLocalAvatar}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-200 to-[color:var(--primary,#4c99e6)] text-4xl font-bold text-white dark:from-slate-600 dark:to-slate-700">
                {profileInitials(profile.displayName)}
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-2xl font-bold leading-tight tracking-tight">
          {profile.displayName}
        </p>

        <div className="mt-2 flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <span
            className="material-symbols-outlined text-base"
            style={{ color: PRIMARY }}
          >
            location_on
          </span>
          <span className="text-sm font-medium">
            {profile.location || "—"}
          </span>
        </div>

        <div className="mt-3 rounded-full border border-green-200 bg-emerald-50 px-4 py-1.5 dark:border-green-800/50 dark:bg-green-900/30">
          <p className="text-sm font-bold tracking-tight text-green-600 dark:text-green-400">
            {reliabilityScore}/10 reliability
          </p>
        </div>

        {profile.bio ? (
          <p className="mx-auto mt-5 max-w-lg text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {profile.bio}
          </p>
        ) : null}
      </div>

      {/* Stats */}
      <div className="flex gap-3 px-2 pb-6 sm:px-4 lg:gap-4">
        <div className="flex flex-1 flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <p
            className="text-2xl font-bold leading-tight"
            style={{ color: PRIMARY }}
          >
            {listedToys.length}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Toys listed
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <p
            className="text-2xl font-bold leading-tight"
            style={{ color: PRIMARY }}
          >
            {exchanged.length}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Exchanges
          </p>
        </div>
      </div>

      {/* Toys grid */}
      <div className="px-2 pb-8 sm:px-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight">
            {isSelf ? "My toys" : "Listings"}
          </h2>
          <Link
            href={viewAllHref}
            className="text-sm font-bold hover:underline"
            style={{ color: PRIMARY }}
          >
            View all
          </Link>
        </div>

        {toyPreview.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 py-14 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
            <p>No toys listed yet.</p>
            {isSelf ? (
              <Link
                href="/toybox/my-toys/add"
                className="mt-4 inline-block font-semibold hover:underline"
                style={{ color: PRIMARY }}
              >
                Add a toy
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {toyPreview.map((t) => (
              <ToyGridItem key={t.id} toy={t} isSelf={isSelf} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
