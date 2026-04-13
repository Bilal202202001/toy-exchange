"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ToyListingCard from "./ToyListingCard";
import { toyListings } from "@/data/toyListings";

const PAGE_SIZE = 6;

export default function ToyListingsFeed() {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(toyListings.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return toyListings.slice(start, start + PAGE_SIZE);
  }, [page]);

  const goTo = (next) => {
    setPage((p) => Math.min(Math.max(1, next), totalPages));
  };

  return (
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
              · {toyListings.length} listings
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
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
              ))}
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
  );
}
