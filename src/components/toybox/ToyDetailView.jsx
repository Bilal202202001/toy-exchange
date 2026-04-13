"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, User, Calendar, CircleCheck } from "lucide-react";
import ToyImageSlider from "./ToyImageSlider";

function formatListedOn(isoDate) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function StarRating({ value }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  return (
    <div className="flex flex-wrap items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < full || (i === full && hasHalf);
        return (
          <Star
            key={i}
            className={`h-5 w-5 shrink-0 ${
              filled ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-300"
            }`}
            strokeWidth={1.2}
          />
        );
      })}
      <span className="ml-2 text-lg font-semibold text-slate-800">{value.toFixed(1)}</span>
    </div>
  );
}

export default function ToyDetailView({ listing, hideRequest = false }) {
  const {
    title,
    images,
    listedBy,
    ownerUsername,
    listedOn,
    rating,
    location,
    description,
    details,
  } = listing;

  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleRequest = () => {
    setRequestSubmitted(true);
  };

  return (
    <div className="relative w-full min-w-0">
      {!hideRequest && requestSubmitted && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-success-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-2xl shadow-slate-300/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e0f7fa]">
              <CircleCheck className="h-10 w-10 text-[#00C4D9]" strokeWidth={2} />
            </div>
            <h2
              id="request-success-title"
              className="mt-6 text-2xl font-bold text-slate-900"
            >
              Request submitted successfully
            </h2>
            <p className="mt-3 text-slate-600">
              The seller will be notified. You can track requests from your Requests tab.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setRequestSubmitted(false)}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
              <Link
                href="/toybox/requests"
                className="rounded-2xl bg-[#00C4D9] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,196,217,0.35)] transition-colors hover:bg-[#00ACC1]"
              >
                View requests
              </Link>
            </div>
            <Link
              href="/toybox"
              className="mt-4 inline-block text-sm font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
            >
              Back to listings
            </Link>
          </div>
        </div>
      )}

      <Link
        href="/toybox"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-slate-900 sm:mb-8 sm:text-3xl">{title}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        {/* Left: images (same 16:9 as listing cards) + description */}
        <div className="flex min-w-0 flex-col gap-6">
          <ToyImageSlider images={images} title={title} />
          <div>
            <h2 className="text-lg font-bold text-slate-800">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
        </div>

        {/* Right: information + request */}
        <div className="flex min-w-0 flex-col gap-6 lg:pt-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Information</h2>
            <div className="mt-4 grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 shrink-0 text-[#00C4D9]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Listed by
                  </p>
                  {ownerUsername ? (
                    <Link
                      href={`/toybox/profile/${ownerUsername}`}
                      className="mt-0.5 inline-block font-semibold text-slate-800 underline-offset-2 hover:text-[#00ACC1] hover:underline"
                    >
                      {listedBy}
                    </Link>
                  ) : (
                    <p className="mt-0.5 font-semibold text-slate-800">{listedBy}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#00C4D9]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Listed on
                  </p>
                  <p className="mt-0.5 font-semibold text-slate-800">{formatListedOn(listedOn)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Rating</p>
                <div className="mt-1">
                  <StarRating value={rating} />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#00C4D9]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Location
                  </p>
                  <p className="mt-0.5 font-semibold text-slate-800">{location}</p>
                </div>
              </div>
            </div>
          </div>

          {details?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800">Details</h2>
              <dl className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
                {details.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <dt className="text-sm font-medium text-slate-500">{row.label}</dt>
                    <dd className="text-sm font-semibold text-slate-800">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {!hideRequest && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRequest}
                className="w-full rounded-2xl bg-[#00C4D9] px-6 py-4 text-lg font-bold text-white shadow-[0_20px_40px_rgba(0,196,217,0.25)] transition-colors hover:bg-[#00ACC1] active:scale-[0.99]"
              >
                Request this toy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
