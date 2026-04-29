"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Inbox, MessageCircle, Send } from "lucide-react";
import {
  outgoingRequestsMock,
  completedExchangesMock,
} from "@/data/toyRequests";
import { useRouter } from "next/navigation";
import { useChatWidget } from "@/contexts/ChatWidgetContext";

function formatRequestDate(iso) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Display as e.g. "9.8/10" — mock uses one decimal. */
function formatUserRatingTenth(n) {
  const raw = Number(n);
  if (n == null || Number.isNaN(raw)) return "—";
  return `${raw.toFixed(1)}/10`;
}

const incomingStatusOrder = { pending: 0, accepted: 1, declined: 2 };

const statusStyles = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/80",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80",
  },
  declined: {
    label: "Declined",
    className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
  },
};

function StatusBadge({ status }) {
  const cfg = statusStyles[status] ?? statusStyles.pending;
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function CompletedExchangeCard({ item }) {
  const rateHref =
    item.partnerUsername != null
      ? `/toybox/profile/${item.partnerUsername}`
      : undefined;

  return (
    <li className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="p-4">
        <div className="flex gap-4">
          <Link
            href={`/toybox/${item.toyId}`}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100"
          >
            <Image
              src={item.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/toybox/${item.toyId}`}
                className="truncate text-base font-bold text-slate-800 transition-colors hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
              >
                {item.toyTitle}
              </Link>
              <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400">
                Completed
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Exchanged with{" "}
              {rateHref ? (
                <Link
                  href={rateHref}
                  className="font-semibold text-slate-700 underline-offset-2 hover:underline dark:text-slate-300"
                >
                  {item.partnerName}
                </Link>
              ) : (
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {item.partnerName}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="mt-4">
          {rateHref ? (
            <Link
              href={rateHref}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 active:opacity-90"
            >
              Rate Member
            </Link>
          ) : (
            <button
              type="button"
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 active:opacity-90"
            >
              Rate Member
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

/** Incoming (“For my toys”) rows — Pending mock layout + Accept / Decline. */
function IncomingForToyCard({ req, index, setRequestStatus }) {
  const router = useRouter();
  const pending = req.status === "pending";

  const openDetail = () => {
    router.push(`/toybox/requests/${req.id}`);
  };

  const nameEl =
    req.requesterUsername != null ? (
      <Link
        href={`/toybox/profile/${req.requesterUsername}`}
        onClick={(e) => e.stopPropagation()}
        className="font-semibold text-slate-700 underline-offset-2 hover:text-blue-600 hover:underline dark:text-slate-300 dark:hover:text-blue-400"
      >
        {req.requesterName}
      </Link>
    ) : (
      <span className="font-semibold text-slate-700 dark:text-slate-300">{req.requesterName}</span>
    );

  let badgeEl;
  if (req.status === "pending") {
    badgeEl = (
      <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-900/20">
        Pending
      </span>
    );
  } else if (req.status === "accepted") {
    badgeEl = (
      <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20">
        Accepted
      </span>
    );
  } else {
    badgeEl = (
      <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
        Declined
      </span>
    );
  }

  return (
    <li
      className={`rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 ${index % 2 === 1 ? "opacity-90" : ""}`}
    >
      <div
        role="button"
        tabIndex={0}
        className="-m-[1px] cursor-pointer rounded-2xl p-4 text-left outline-none transition-colors hover:bg-slate-50/90 focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800/60 dark:focus-visible:ring-blue-400"
        onClick={openDetail}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDetail();
          }
        }}
      >
        <div className="flex gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={req.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <span className="truncate font-bold text-slate-800 dark:text-slate-100">
                {req.toyTitle}
              </span>
              {badgeEl}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Requested by {nameEl}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-amber-400">
                star
              </span>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                User rating: {formatUserRatingTenth(req.requesterRating)}
              </span>
            </div>
            {req.message ? (
              <p className="mt-3 line-clamp-4 rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-2 text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                {req.message}
              </p>
            ) : null}
            {!pending ? (
              <p className="mt-3 text-[11px] text-slate-400">
                {formatRequestDate(req.requestedAt)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      {pending ? (
        <div className="flex gap-2 border-t border-slate-100 p-4 pt-3 dark:border-slate-700">
          <button
            type="button"
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:active:bg-slate-800"
            onClick={(e) => {
              e.stopPropagation();
              setRequestStatus(req.id, "declined");
            }}
          >
            Decline
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 active:opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              setRequestStatus(req.id, "accepted");
            }}
          >
            Accept
          </button>
        </div>
      ) : null}
    </li>
  );
}

export default function RequestsClient() {
  const [phase, setPhase] = useState("pending"); // pending | completed
  const [tab, setTab] = useState("incoming");
  const { incoming, openWidgetToThread, setRequestStatus } = useChatWidget();

  const outgoing = outgoingRequestsMock;

  const incomingCount = incoming.length;

  const sortedIncoming = useMemo(
    () =>
      [...incoming].sort(
        (a, b) =>
          (incomingStatusOrder[a.status] ?? 9) -
          (incomingStatusOrder[b.status] ?? 9),
      ),
    [incoming],
  );

  const openChat = (req) => {
    openWidgetToThread(req.id);
  };

  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 lg:pb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Requests
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400 lg:text-base">
            Track proposals and see completed swaps. Switch between active requests
            and your exchange history.
          </p>
        </div>
      </div>

      <div
        className="mt-8 flex w-full rounded-xl bg-slate-200/50 p-1 dark:bg-slate-800/50 sm:max-w-md"
        role="tablist"
        aria-label="Request status"
      >
        <button
          type="button"
          role="tab"
          aria-selected={phase === "pending"}
          onClick={() => setPhase("pending")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            phase === "pending"
              ? "bg-white font-semibold text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Pending
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={phase === "completed"}
          onClick={() => setPhase("completed")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            phase === "completed"
              ? "bg-white font-semibold text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Completed
        </button>
      </div>

      {phase === "completed" && (
        <div className="mt-8 space-y-4" role="tabpanel" aria-label="Completed exchanges">
          {completedExchangesMock.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              No completed exchanges yet. When a swap finishes, it will show up here.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 xl:gap-6">
              {completedExchangesMock.map((item) => (
                <CompletedExchangeCard key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>
      )}

      {phase === "pending" && (
        <>
          <div
            className="mt-8 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:inline-flex"
            role="tablist"
            aria-label="Request type"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "incoming"}
              onClick={() => setTab("incoming")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all sm:flex-none sm:px-6 ${
                tab === "incoming"
                  ? "bg-[#e0f7fa] text-[#00838F] shadow-sm ring-1 ring-[#B2EBF2]/80"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800"
              }`}
            >
              <Inbox className="h-4 w-4 shrink-0" aria-hidden />
              For my toys
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  tab === "incoming"
                    ? "bg-white/80 text-[#00838F]"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                }`}
              >
                {incomingCount}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "outgoing"}
              onClick={() => setTab("outgoing")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all sm:flex-none sm:px-6 ${
                tab === "outgoing"
                  ? "bg-[#e0f7fa] text-[#00838F] shadow-sm ring-1 ring-[#B2EBF2]/80"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800"
              }`}
            >
              <Send className="h-4 w-4 shrink-0" aria-hidden />
              My requests
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  tab === "outgoing"
                    ? "bg-white/80 text-[#00838F]"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                }`}
              >
                {outgoing.length}
              </span>
            </button>
          </div>

          <div className="mt-6 space-y-4" role="tabpanel">
            {tab === "incoming" && (
              <ul className="space-y-4">
                {sortedIncoming.map((req, idx) => (
                  <IncomingForToyCard
                    key={req.id}
                    req={req}
                    index={idx}
                    setRequestStatus={setRequestStatus}
                  />
                ))}
              </ul>
            )}

            {tab === "outgoing" && (
              <ul className="space-y-4">
                {outgoing.map((req) => (
                  <li
                    key={req.id}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                      <Link
                        href={`/toybox/${req.toyId}`}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-24"
                      >
                        <Image
                          src={req.imageUrl}
                          alt={`${req.toyTitle} thumbnail`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                              You requested
                            </p>
                            <Link
                              href={`/toybox/${req.toyId}`}
                              className="mt-1 block text-lg font-bold text-slate-900 transition-colors hover:text-[#00C4D9] dark:text-slate-100"
                            >
                              {req.toyTitle}
                            </Link>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              Listed by{" "}
                              {req.sellerUsername ? (
                                <Link
                                  href={`/toybox/profile/${req.sellerUsername}`}
                                  className="font-semibold text-slate-800 underline-offset-2 hover:text-[#00ACC1] hover:underline dark:text-slate-200"
                                >
                                  {req.sellerName}
                                </Link>
                              ) : (
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{req.sellerName}</span>
                              )}
                              <span className="text-slate-400"> · </span>
                              {req.sellerLocation}
                            </p>
                          </div>
                          <StatusBadge status={req.status} />
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Sent {formatRequestDate(req.requestedAt)}
                        </p>
                        {req.message ? (
                          <p className="mt-3 flex gap-2 rounded-xl bg-slate-50/90 p-3 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                            <MessageCircle
                              className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                              aria-hidden
                            />
                            {req.message}
                          </p>
                        ) : null}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openChat(req)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:border-[#B2EBF2] hover:bg-[#e0f7fa]/50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                          >
                            <MessageCircle className="h-4 w-4 text-[#00C4D9]" aria-hidden />
                            Message {req.sellerName}
                          </button>
                          <Link
                            href={`/toybox/${req.toyId}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
                          >
                            View listing
                            <ArrowUpRight className="h-4 w-4" aria-hidden />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
