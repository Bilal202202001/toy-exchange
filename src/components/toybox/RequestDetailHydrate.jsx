"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import RequestDetailClient from "./RequestDetailClient";

export default function RequestDetailHydrate({ requestId }) {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      setPayload(null);
      const res = await apiFetch(`/api/exchanges/${requestId}/detail`);
      if (cancelled) return;
      if (res.status === 404) {
        setError("notfound");
        return;
      }
      if (!res.ok) {
        setError(res.status === 403 ? "forbidden" : "error");
        return;
      }
      setPayload(await res.json());
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  if (error === "notfound") {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Request not found</p>
        <Link
          href="/toybox/requests"
          className="mt-6 inline-block font-semibold text-primary hover:underline dark:text-[#80deea]"
        >
          Back to Requests
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {error === "forbidden" ? "You cannot view this request." : "Could not load request details."}
        </p>
        <Link
          href="/toybox/requests"
          className="mt-6 inline-block font-semibold text-primary hover:underline dark:text-[#80deea]"
        >
          Back to Requests
        </Link>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="w-full space-y-6 py-8">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return <RequestDetailClient payload={payload} />;
}
