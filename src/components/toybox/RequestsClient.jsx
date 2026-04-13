"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Inbox,
  MapPin,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { outgoingRequestsMock } from "@/data/toyRequests";
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

export default function RequestsClient() {
  const [tab, setTab] = useState("incoming");
  const { incoming, openWidgetToThread, setRequestStatus } = useChatWidget();

  const outgoing = outgoingRequestsMock;

  const incomingCount = incoming.length;

  const openChat = (req) => {
    openWidgetToThread(req.id);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Requests</h1>
      <p className="mt-2 max-w-2xl text-slate-500">
        See who wants your toys and track requests you&apos;ve sent on other listings.
      </p>

      <div
        className="mt-8 flex gap-2 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm sm:inline-flex"
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
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Inbox className="h-4 w-4 shrink-0" aria-hidden />
          For my toys
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              tab === "incoming" ? "bg-white/80 text-[#00838F]" : "bg-slate-100 text-slate-600"
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
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Send className="h-4 w-4 shrink-0" aria-hidden />
          My requests
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              tab === "outgoing" ? "bg-white/80 text-[#00838F]" : "bg-slate-100 text-slate-600"
            }`}
          >
            {outgoing.length}
          </span>
        </button>
      </div>

      <div className="mt-6 space-y-4" role="tabpanel">
        {tab === "incoming" && (
          <ul className="space-y-4">
            {incoming.map((req) => (
              <li
                key={req.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
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
                          Request for your listing
                        </p>
                        <Link
                          href={`/toybox/${req.toyId}`}
                          className="mt-1 block text-lg font-bold text-slate-900 transition-colors hover:text-[#00C4D9]"
                        >
                          {req.toyTitle}
                        </Link>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                      {req.requesterUsername ? (
                        <Link
                          href={`/toybox/profile/${req.requesterUsername}`}
                          className="font-semibold text-slate-800 underline-offset-2 hover:text-[#00ACC1] hover:underline"
                        >
                          {req.requesterName}
                        </Link>
                      ) : (
                        <span className="font-semibold text-slate-800">{req.requesterName}</span>
                      )}
                      <span className="hidden text-slate-300 sm:inline" aria-hidden>
                        ·
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#00C4D9]" aria-hidden />
                        {req.requesterLocation}
                      </span>
                      <span className="text-slate-400">{formatRequestDate(req.requestedAt)}</span>
                    </div>
                    {req.message ? (
                      <p className="mt-3 flex gap-2 rounded-xl bg-slate-50/90 p-3 text-sm leading-relaxed text-slate-700">
                        <MessageCircle
                          className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                          aria-hidden
                        />
                        {req.message}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
                      <button
                        type="button"
                        onClick={() => openChat(req)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:border-[#B2EBF2] hover:bg-[#e0f7fa]/50"
                      >
                        <MessageCircle className="h-4 w-4 text-[#00C4D9]" aria-hidden />
                        Chat with {req.requesterName}
                      </button>
                      {req.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => setRequestStatus(req.id, "accepted")}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                          >
                            <Check className="h-4 w-4" aria-hidden />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => setRequestStatus(req.id, "declined")}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 transition-colors hover:bg-red-50"
                          >
                            <X className="h-4 w-4" aria-hidden />
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {tab === "outgoing" && (
          <ul className="space-y-4">
            {outgoing.map((req) => (
              <li
                key={req.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
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
                          className="mt-1 block text-lg font-bold text-slate-900 transition-colors hover:text-[#00C4D9]"
                        >
                          {req.toyTitle}
                        </Link>
                        <p className="mt-1 text-sm text-slate-600">
                          Listed by{" "}
                          {req.sellerUsername ? (
                            <Link
                              href={`/toybox/profile/${req.sellerUsername}`}
                              className="font-semibold text-slate-800 underline-offset-2 hover:text-[#00ACC1] hover:underline"
                            >
                              {req.sellerName}
                            </Link>
                          ) : (
                            <span className="font-semibold text-slate-800">{req.sellerName}</span>
                          )}
                          <span className="text-slate-400"> · </span>
                          {req.sellerLocation}
                        </p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      Sent {formatRequestDate(req.requestedAt)}
                    </p>
                    {req.message ? (
                      <p className="mt-3 flex gap-2 rounded-xl bg-slate-50/90 p-3 text-sm leading-relaxed text-slate-700">
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
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:border-[#B2EBF2] hover:bg-[#e0f7fa]/50"
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
    </div>
  );
}
