"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ToyDetailView from "./ToyDetailView";
import { getMyToyById, isMyListingId } from "@/lib/myToyListings";

export default function ToyDetailClientGate({ id, initialListing }) {
  const [listing, setListing] = useState(initialListing);
  const [checked, setChecked] = useState(!!initialListing);

  useEffect(() => {
    if (!initialListing) {
      setListing(getMyToyById(id));
    } else {
      setListing(initialListing);
    }
    setChecked(true);
  }, [id, initialListing]);

  if (initialListing) {
    return (
      <ToyDetailView listing={initialListing} hideRequest={isMyListingId(id)} />
    );
  }

  if (!checked) {
    return <div className="h-64 animate-pulse rounded-2xl bg-slate-100" aria-hidden />;
  }

  if (!listing) {
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

  return <ToyDetailView listing={listing} hideRequest={isMyListingId(id)} />;
}
