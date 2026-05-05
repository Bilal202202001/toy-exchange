
"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import ToyDetailView from "./ToyDetailView";

import { getMyToyById, isMyListingId } from "@/lib/myToyListings";

import { apiFetch } from "@/lib/apiClient";

import { isMongoId, mapApiToyToListing } from "@/lib/mapToyListing";

import { useAuth } from "@/contexts/AuthContext";

export default function ToyDetailClientGate({ id }) {

  const { me } = useAuth();

  const [listing, setListing] = useState(/** @type {any} */ null);

  const [phase, setPhase] = useState("loading");

  useEffect(() => {

    let cancelled = false;

    (async () => {

      setPhase("loading");

      try {

        if (isMongoId(id)) {

          const res = await apiFetch("/api/toys/" + encodeURIComponent(id));

          if (!res.ok) {

            if (!cancelled) setPhase("missing");

            return;

          }

          const data = await res.json();

          const mapped = mapApiToyToListing(data.toy);

          if (!cancelled) {

            setListing(mapped);

            setPhase("ok");

          }

          return;

        }

        const mine = getMyToyById(id);

        if (mine) {

          if (!cancelled) {

            setListing(mine);

            setPhase("ok");

          }

          return;

        }

        if (!cancelled) setPhase("missing");

      } catch {

        if (!cancelled) setPhase("missing");

      }

    })();

    return () => {

      cancelled = true;

    };

  }, [id]);

  if (phase === "loading") {

    return (
      <div className="h-64 animate-pulse rounded-2xl bg-slate-100" aria-hidden />
    );

  }

  if (phase !== "ok" || !listing) {

    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-800">Listing not found</p>
        <p className="mt-2 text-sm text-slate-500">
          It may have been removed or this link is invalid.

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

  const hideRequest =
    Boolean(listing?.ownerUserId && me?.id && listing.ownerUserId === me.id) ||
    isMyListingId(id);

  return (
    <ToyDetailView listing={listing} hideRequest={hideRequest} />

  );

}

