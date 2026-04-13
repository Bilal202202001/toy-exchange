"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import ToyListingCard from "./ToyListingCard";
import MyToysChart from "./MyToysChart";
import {
  getAllMyToys,
  hasRecoverableDeleted,
  recoverAllDeletedMyToys,
  removeMyToy,
} from "@/lib/myToyListings";

export default function AddToyClient() {
  const [myToys, setMyToys] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  /** { id, title } when delete confirm modal is open */
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const refreshListed = useCallback(() => {
    setMyToys(getAllMyToys());
  }, []);

  useEffect(() => {
    refreshListed();
    setHydrated(true);
  }, [refreshListed]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") refreshListed();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refreshListed]);

  const handleRecoverDeleted = () => {
    recoverAllDeletedMyToys();
    setMyToys(getAllMyToys());
  };

  const handleConfirmRemove = () => {
    if (!deleteConfirm) return;
    removeMyToy(deleteConfirm.id);
    setDeleteConfirm(null);
    setMyToys(getAllMyToys());
  };

  if (!hydrated) {
    return (
      <div className="h-48 animate-pulse rounded-2xl bg-slate-100" aria-hidden />
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">My Toys</h1>
          <p className="mt-2 text-slate-500">
            Listings you&apos;ve published (saved in this browser). Use{" "}
            <span className="font-medium text-slate-600">Add toy</span> to open the form on a
            separate page.
          </p>
          {hasRecoverableDeleted() && (
            <button
              type="button"
              onClick={handleRecoverDeleted}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#00838F] underline decoration-[#B2EBF2] underline-offset-2 transition-colors hover:text-[#00C4D9] hover:decoration-[#00C4D9]"
            >
              <RotateCcw className="h-4 w-4 shrink-0" aria-hidden />
              Recover deleted listings
            </button>
          )}
        </div>
        <Link
          href="/toybox/my-toys/add"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#00C4D9] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,196,217,0.35)] transition-colors hover:bg-[#00ACC1]"
        >
          <Plus className="h-5 w-5" />
          Add toy
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-start">
        <div>
          {myToys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-500">
              <p>You haven&apos;t listed any toys yet.</p>
              <Link
                href="/toybox/my-toys/add"
                className="mt-4 inline-block font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
              >
                Add your first toy
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {myToys.map((listing) => (
                <div key={listing.id} className="relative">
                  <ToyListingCard listing={listing} />
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteConfirm({ id: listing.id, title: listing.title })
                    }
                    className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/95 text-slate-500 shadow-sm backdrop-blur hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${listing.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <MyToysChart toys={myToys} />
      </div>

      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="delete-confirm-title"
              className="text-xl font-bold text-slate-900"
            >
              Remove this listing?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-800">&ldquo;{deleteConfirm.title}&rdquo;</span>{" "}
              will be removed from this list. You can restore it anytime with{" "}
              <span className="font-medium text-slate-700">Recover deleted listings</span> on this page
              (saved in this browser only).
            </p>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="rounded-2xl bg-[#00C4D9] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,196,217,0.35)] transition-colors hover:bg-[#00ACC1]"
              >
                Remove listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
