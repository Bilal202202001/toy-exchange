"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import ToyListingCard from "./ToyListingCard";
import MyToysChart from "./MyToysChart";
import { apiFetch } from "@/lib/apiClient";
import { getStoredToken } from "@/lib/authToken";
import { mapApiToyToListing } from "@/lib/mapToyListing";

export default function AddToyClient() {
  const [myToys, setMyToys] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  /** { id, title } when delete confirm modal is open */
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);

  const refreshListed = useCallback(async () => {
    if (!getStoredToken()) {
      setMyToys([]);
      return;
    }

    const res = await apiFetch("/api/toys?mine=1");
    if (!res.ok) {
      setMyToys([]);
      return;
    }
    const data = await res.json();
    const toys = Array.isArray(data.toys) ? data.toys : [];
    setMyToys(toys.map(mapApiToyToListing));
  }, []);

  useEffect(() => {
    void refreshListed().then(() => setHydrated(true));
  }, [refreshListed]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") void refreshListed();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refreshListed]);

  const handleConfirmRemove = async () => {
    if (!deleteConfirm) return;
    setBusyDelete(true);
    try {
      await apiFetch(`/api/toys/${deleteConfirm.id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      await refreshListed();
    } finally {
      setBusyDelete(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="h-48 animate-pulse rounded-2xl bg-slate-100" aria-hidden />
    );
  }

  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 lg:pb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            My Toys
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400 lg:text-base">
            Listings you&apos;ve published. Use{" "}
            <span className="font-medium text-slate-600 dark:text-slate-300">Add toy</span>{" "}
            to open the form on a separate page.
          </p>
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
          onClick={() => !busyDelete && setDeleteConfirm(null)}
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
              will be deleted from ToyBox for everyone who could see it.
            </p>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                disabled={busyDelete}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmRemove()}
                disabled={busyDelete}
                className="rounded-2xl bg-[#00C4D9] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,196,217,0.35)] transition-colors hover:bg-[#00ACC1] disabled:opacity-50"
              >
                {busyDelete ? "Removing…" : "Remove listing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
