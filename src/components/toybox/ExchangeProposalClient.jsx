"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getAllMyToys } from "@/lib/myToyListings";

function getDetail(details, ...labelHints) {
  if (!details?.length) return "";
  const hints = labelHints.map((h) => h.toLowerCase());
  const row = details.find((d) =>
    hints.some((h) => d.label.toLowerCase().includes(h)),
  );
  return row?.value?.trim() ?? "";
}

function deriveConditionMetric(raw) {
  if (!raw) return { label: "8/10" };
  const str = String(raw);
  const m = str.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
  if (m) {
    const v = Number(m[1]);
    const clamped = Math.min(10, Math.max(1, v));
    return {
      label: `${clamped % 1 === 0 ? Math.round(clamped) : clamped}/10`,
    };
  }
  const low = str.toLowerCase();
  const fallback = [
    ["like new", "10"],
    ["excellent", "9"],
    ["very good", "8"],
    ["brand new", "10"],
    ["good", "7"],
    ["fair", "5"],
  ];
  for (const [k, score] of fallback) {
    if (low.includes(k)) return { label: `${score}/10` };
  }
  return { label: "8/10" };
}

function formatEstPrice(worth) {
  if (!worth || worth === "—") return "—";
  const t = String(worth).trim();
  if (/^\$/.test(t)) return t;
  const n = Number.parseFloat(t.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(n)) return t;
  return n % 1 === 0 ? `$${Math.round(n)}` : `$${n.toFixed(2)}`;
}

function firstImageSrc(toy) {
  const img =
    toy?.images?.[0] ??
    toy?.imageUrl ??
    "";
  return typeof img === "string" ? img : "";
}

export default function ExchangeProposalClient({ listing }) {
  const router = useRouter();
  const { title, details, listedBy } = listing;

  const requestedImage = firstImageSrc(listing);
  const requestedWorth = getDetail(details, "worth", "estimated");
  const conditionRaw = getDetail(details, "condition");
  const requestedCondition = deriveConditionMetric(conditionRaw).label;

  const [myToys, setMyToys] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const toys = getAllMyToys();
    setMyToys(toys);
    setSelectedId((prev) =>
      toys.length ? (prev && toys.some((t) => t.id === prev) ? prev : toys[0].id) : null,
    );
    setMounted(true);
  }, []);

  const selectedToy = useMemo(
    () => myToys.find((t) => t.id === selectedId) ?? null,
    [myToys, selectedId],
  );

  const totalDisplay = selectedToy
    ? formatEstPrice(getDetail(selectedToy.details, "worth", "estimated"))
    : "—";

  const seller = (listedBy || "the seller").trim();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(`/toybox/${listing.id}`);
  };

  const submit = () => {
    if (!selectedToy) return;
    router.push(`/toybox/request-sent?name=${encodeURIComponent(seller)}`);
  };

  const isLocal =
    typeof requestedImage === "string" &&
    (requestedImage.startsWith("blob:") || requestedImage.startsWith("data:"));

  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={goBack}
            className="shrink-0 rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-2xl leading-none">
              arrow_back
            </span>
          </button>
          <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Exchange Proposal
          </h1>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Exchange proposal info"
        >
          <span className="material-symbols-outlined text-2xl leading-none">
            info
          </span>
        </button>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr),minmax(280px,400px)] lg:items-start xl:max-w-[1200px] xl:gap-12">
        <div className="custom-scrollbar min-w-0 space-y-8">
          <section className="space-y-3">
            <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">
              You are requesting
            </p>
            <div className="flex items-center gap-4 rounded-[1.25rem] border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-800/50 dark:bg-blue-900/10">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.25rem] shadow-sm">
                {requestedImage ? (
                  <Image
                    src={requestedImage}
                    alt={title}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized={isLocal}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
                    No img
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Est. Value: {formatEstPrice(requestedWorth)}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-2.5 py-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">
                    check_circle
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Condition: {requestedCondition}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Select your offer
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Choose one of your items to trade
                </p>
              </div>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
                {mounted ? `${myToys.length} Available` : "—"}
              </span>
            </div>

            <div className="space-y-3">
              {!mounted ? (
                <div className="h-28 animate-pulse rounded-[1.25rem] bg-slate-100 dark:bg-slate-800" />
              ) : myToys.length === 0 ? (
                <p className="rounded-[1.25rem] border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  You don&apos;t have any listings yet. Add a toy to offer in a
                  swap.
                </p>
              ) : (
                myToys.map((toy) => {
                  const selected = toy.id === selectedId;
                  const cond = getDetail(toy.details, "condition") || "—";
                  const worth = getDetail(toy.details, "worth", "estimated");
                  const thumb = firstImageSrc(toy);
                  const thumbLocal =
                    thumb.startsWith("blob:") || thumb.startsWith("data:");

                  return (
                    <label
                      key={toy.id}
                      className={`relative flex cursor-pointer items-center gap-4 rounded-[1.25rem] border-2 bg-white p-4 shadow-sm transition-all dark:bg-slate-800 ${
                        selected
                          ? "border-blue-600"
                          : "border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="toy-offer"
                        checked={selected}
                        onChange={() => setSelectedId(toy.id)}
                        className="sr-only"
                      />
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.25rem]">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized={thumbLocal}
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-100 dark:bg-slate-700" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">
                          {toy.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Condition: {cond}
                        </p>
                        <p
                          className={`mt-1 text-sm ${
                            selected
                              ? "font-bold text-blue-600 dark:text-blue-400"
                              : "font-medium text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          Est. Value: {formatEstPrice(worth)}
                        </p>
                      </div>
                      <div
                        className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          selected
                            ? "border-blue-600 bg-blue-600 dark:border-blue-600"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {selected ? (
                          <span className="block h-2 w-2 rounded-full bg-white" />
                        ) : null}
                      </div>
                    </label>
                  );
                })
              )}

              <Link
                href="/toybox/my-toys/add"
                className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] border-2 border-dashed border-slate-300 p-5 font-bold text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50"
              >
                <span className="material-symbols-outlined">add_circle</span>
                List a new toy
              </Link>
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-4 lg:z-10 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5">
              <div className="group relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Add a friendly message (optional)..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 shadow-inner outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <div className="pointer-events-none absolute bottom-3 right-4 flex items-center gap-1 opacity-40">
                  <span className="material-symbols-outlined text-sm">
                    chat_bubble
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Estimated Value
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {totalDisplay}
              </span>
            </div>

            <button
              type="button"
              disabled={!selectedToy}
              onClick={submit}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600/95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Request Exchange
              <span className="material-symbols-outlined leading-none">send</span>
            </button>
          </div>
          <div
            className="mx-auto hidden h-1 w-32 rounded-full bg-slate-200 dark:bg-slate-800 sm:block lg:hidden"
            aria-hidden
          />
        </aside>
      </div>
    </div>
  );
}
