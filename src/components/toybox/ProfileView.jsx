"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { profileInitials } from "@/lib/profile";
import { useChatWidget } from "@/contexts/ChatWidgetContext";
import { apiFetch } from "@/lib/apiClient";

const THEME_PRIMARY = "#00C4D9";

function RatingAfterSwapPanel({ exchangeId, ratedUserId }) {
  const [score, setScore] = useState(8);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className="mx-auto mt-6 w-full max-w-lg overflow-hidden rounded-3xl border border-[#B2EBF2]/90 bg-gradient-to-br from-white via-[#f0fdff] to-[#e0f7fa]/90 p-5 text-left shadow-[0_12px_40px_-12px_rgba(0,196,217,0.25)] ring-1 ring-[#00C4D9]/10 dark:border-[#006064]/40 dark:from-slate-900 dark:via-slate-900 dark:to-[#004d40]/30 dark:ring-[#00C4D9]/20 sm:p-6">
      <div className="flex items-start gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#00C4D9]/15 text-[#00838F] dark:bg-[#00C4D9]/20 dark:text-[#80deea]"
          aria-hidden
        >
          <span className="material-symbols-outlined text-[22px] leading-none">star</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00838F] dark:text-[#80deea]">
            Rate this swap partner
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            How was the exchange? Your score helps the community see who&apos;s reliable.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Score (1–10)</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">Tap a number — 10 is flawless.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              disabled={busy || Boolean(hint)}
              onClick={() => setScore(n)}
              aria-pressed={score === n}
              className={`flex h-10 min-w-[2.35rem] items-center justify-center rounded-xl border px-2.5 text-sm font-bold transition-all ${
                score === n
                  ? "scale-[1.02] border-[#00C4D9] bg-[#00C4D9] text-white shadow-[0_6px_20px_-4px_rgba(0,196,217,0.45)] dark:border-[#00C4D9]"
                  : "border-slate-200/90 bg-white/90 text-slate-600 hover:border-[#80deea] hover:bg-[#f0fdff] dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:border-[#00C4D9]/40"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-3 py-2.5 text-sm font-semibold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span className="material-symbols-outlined text-lg text-emerald-600 dark:text-emerald-400">
            check_circle
          </span>
          {hint}
        </p>
      ) : null}

      {!hint ? (
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            setHint(null);
            try {
              const res = await apiFetch("/api/ratings", {
                method: "POST",
                body: JSON.stringify({
                  exchangeId,
                  ratedUserId,
                  score: Number(score),
                }),
              });
              const body = await res.json().catch(() => ({}));
              if (!res.ok) {
                setError(typeof body?.error === "string" ? body.error : "Could not save rating.");
                return;
              }
              setHint("Thanks — rating saved.");
            } finally {
              setBusy(false);
            }
          }}
          className="mt-6 w-full rounded-2xl bg-[#00C4D9] py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,196,217,0.35)] transition-colors hover:bg-[#00ACC1] active:scale-[0.99] disabled:opacity-55"
        >
          {busy ? "Saving…" : "Submit rating"}
        </button>
      ) : null}
    </div>
  );
}

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

export default function ProfileView({
  profile,
  listedToys,
  exchanged,
  isSelf,
  pendingRatingExchangeId = null,
  ratingTargetUserId = null,
}) {
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
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#80deea] to-[#00C4D9] text-4xl font-bold text-white dark:from-[#546e7a] dark:to-[#37474f]">
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
            style={{ color: THEME_PRIMARY }}
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

        {pendingRatingExchangeId && ratingTargetUserId && !isSelf ? (
          <RatingAfterSwapPanel
            exchangeId={pendingRatingExchangeId}
            ratedUserId={ratingTargetUserId}
          />
        ) : null}
      </div>

      {/* Stats */}
      <div className="flex gap-3 px-2 pb-6 sm:px-4 lg:gap-4">
        <div className="flex flex-1 flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <p
            className="text-2xl font-bold leading-tight"
            style={{ color: THEME_PRIMARY }}
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
            style={{ color: THEME_PRIMARY }}
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
            style={{ color: THEME_PRIMARY }}
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
                style={{ color: THEME_PRIMARY }}
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
