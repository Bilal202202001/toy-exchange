"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ToyListingCard from "./ToyListingCard";
import { apiFetch } from "@/lib/apiClient";
import { mapApiToyToListing } from "@/lib/mapToyListing";
import {
  CATEGORY_LABELS,
  TOY_CATEGORIES,
  resolveCategorySlug,
} from "@/lib/toyCategories";

const PAGE_SIZE = 6;

export default function ToyListingsFeed() {
  const [listings, setListings] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const res = await apiFetch("/api/toys");
      if (!res.ok) {
        if (!cancelled) setListings([]);
      } else {
        /** @type {{ toys?: unknown[] }} */
        const data = await res.json();
        const rows = Array.isArray(data.toys)
          ? data.toys.map((t) => mapApiToyToListing(t))
          : [];
        if (!cancelled) setListings(rows);
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleListings = useMemo(() => {
    if (!category) return listings;
    return listings.filter(
      (listing) => resolveCategorySlug(listing.category) === category,
    );
  }, [category, listings]);

  const totalPages = Math.max(1, Math.ceil(visibleListings.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return visibleListings.slice(start, start + PAGE_SIZE);
  }, [page, visibleListings]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const goTo = (next) => {
    setPage((p) => Math.min(Math.max(1, next), totalPages));
  };

  const categoryPills = (
    <div
      className="mt-4 flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by category"
    >
      {TOY_CATEGORIES.map((option) => {
        const active = category === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() =>
              setCategory((current) =>
                current === option.value ? "" : option.value,
              )
            }
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-[#00C4D9] text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#B2EBF2] hover:bg-[#e0f7fa] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#00C4D9]/40 dark:hover:bg-slate-800"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  const header = (
    <div className="border-b border-slate-200 pb-6 dark:border-slate-800 lg:pb-8">
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
        Home
      </h1>
      <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400 lg:text-base">
        Browse toy listings from families near you.
      </p>
      {categoryPills}
    </div>
  );

  if (loading) {
    return (
      <>
        {header}
        <div
          className="mt-8 h-40 animate-pulse rounded-2xl bg-slate-100"
          aria-hidden
        />
      </>
    );
  }

  if (listings.length === 0) {
    return (
      <>
        {header}
        <p className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-sm text-slate-500">
          No toy listings yet. Connect with families and add friends — when they
          list toys you will see them here.
        </p>
      </>
    );
  }

  if (visibleListings.length === 0) {
    const label = CATEGORY_LABELS[category] || "this category";
    return (
      <>
        {header}
        <p className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-sm text-slate-500">
          No {label} listings yet.
        </p>
      </>
    );
  }

  return (
    <>
      {header}
      <div className="mt-8 w-full">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {pageItems.map((listing) => (
            <ToyListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:justify-between"
            aria-label="Pagination"
          >
            <p className="order-2 w-full text-center text-sm text-slate-500 sm:order-1 sm:w-auto sm:text-left">
              Page {page} of {totalPages}
              <span className="text-slate-400">
                {" "}
                · {visibleListings.length} listings
              </span>
            </p>

            <div className="order-1 flex items-center gap-2 sm:order-2">
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-[#e0f7fa] hover:border-[#B2EBF2] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="hidden items-center gap-1 sm:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goTo(n)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                        n === page
                          ? "bg-[#00C4D9] text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-[#e0f7fa] hover:border-[#B2EBF2] disabled:pointer-events-none disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
