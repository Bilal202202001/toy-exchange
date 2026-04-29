"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ToyImageSlider from "./ToyImageSlider";

/** Pull first matching detail row (partial label match). */
function getDetail(details, ...labelHints) {
  if (!details?.length) return "";
  const hints = labelHints.map((h) => h.toLowerCase());
  const row = details.find((d) =>
    hints.some((h) => d.label.toLowerCase().includes(h)),
  );
  return row?.value?.trim() ?? "";
}

function deriveConditionMetric(raw) {
  if (!raw) return { value: 8, label: "8/10" };
  const str = String(raw);
  const m = str.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
  if (m) {
    const v = Number(m[1]);
    const clamped = Math.min(10, Math.max(1, v));
    return {
      value: clamped,
      label: `${clamped % 1 === 0 ? Math.round(clamped) : clamped}/10`,
    };
  }
  const low = str.toLowerCase();
  const fallback = [
    ["like new", 10],
    ["excellent", 9],
    ["very good", 8],
    ["good", 7],
    ["fair", 5],
  ];
  for (const [k, v] of fallback) {
    if (low.includes(k)) return { value: v, label: `${v}/10` };
  }
  return { value: 8, label: "8/10" };
}

function memberReliabilityTenth(rating) {
  const r = Number(rating);
  if (!Number.isFinite(r)) return { value: 9.5, label: "9.5/10" };
  const v = Math.min(10, Math.max(1, r * 2));
  return {
    value: v,
    label: `${Number.isInteger(v) ? v : v.toFixed(1)}/10`,
  };
}

function formatEstPrice(worth) {
  if (!worth || worth === "—") return "—";
  const t = String(worth).trim();
  if (/^\$/.test(t)) return t;
  const n = Number.parseFloat(t.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(n)) return t;
  return n % 1 === 0 ? `$${Math.round(n)}` : `$${n.toFixed(2)}`;
}

/** 10 ticks; highlight at index for value 1–10 (e.g. 9.5 → 9th dot 0-based index 9). */
function TenthScaleVisual({ value }) {
  const pct = Math.min(100, Math.max(4, (value / 10) * 100));
  const activeDot = Math.min(
    9,
    Math.max(0, Math.round(Number(value)) - 1),
  );
  return (
    <div className="relative flex h-2 items-center rounded-full bg-slate-100">
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-blue-600"
        style={{ width: `${pct}%` }}
      />
      <div className="z-10 flex w-full justify-between px-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              i === activeDot
                ? "bg-white ring-2 ring-blue-600"
                : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ToyDetailView({ listing, hideRequest = false }) {
  const router = useRouter();
  const {
    title,
    images,
    listedBy,
    ownerUsername,
    description,
    details,
    rating,
    location,
    listedOn,
  } = listing;

  const category = getDetail(details, "category") || "Toy";
  const ageRange = getDetail(details, "age", "age group");
  const exchangeFor = getDetail(details, "exchange", "open to exchange");
  const worthRaw = getDetail(details, "worth", "estimated");
  const conditionRaw = getDetail(details, "condition");

  const conditionMetric = deriveConditionMetric(conditionRaw);
  const memberMetric = memberReliabilityTenth(rating);
  const priceDisplay = formatEstPrice(worthRaw);

  const handleRequest = () => {
    router.push(`/toybox/exchange-proposal/${listing.id}`);
  };

  const badgeText = category.slice(0, 18).toUpperCase();

  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900">

      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="relative w-full overflow-hidden">
          <ToyImageSlider
            images={images}
            title={title}
            aspectClassName="aspect-[4/3]"
            roundedClassName="rounded-none"
          />

          <Link
            href="/toybox"
            className="absolute left-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white dark:bg-slate-800/90 dark:text-slate-200"
            aria-label="Back to listings"
          >
            <span className="material-symbols-outlined text-[22px] leading-none">
              arrow_back
            </span>
          </Link>

          {badgeText ? (
            <div className="absolute left-4 top-[4.5rem] z-10 sm:left-14 lg:left-24">
              <div className="rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur-md dark:bg-slate-900/80">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {badgeText}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative z-10 -mt-8 px-6 pb-12">
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="mb-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {title}
                </h1>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-sm leading-none">
                    person
                  </span>
                  {ownerUsername ? (
                    <Link
                      href={`/toybox/profile/${ownerUsername}`}
                      className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {listedBy}
                    </Link>
                  ) : (
                    <span className="text-sm">{listedBy}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  {priceDisplay}
                </span>
                <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                  Est. Value
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {ageRange ? (
                <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 dark:bg-blue-950/40">
                  <span className="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">
                    child_care
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {ageRange}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/80">
                <span className="material-symbols-outlined text-lg text-slate-600 dark:text-slate-300">
                  category
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {category}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                <span className="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">
                  swap_horiz
                </span>
                Expected Exchange
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {exchangeFor || "Open to discussing fair swaps in this category."}
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                About
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {description}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {location ? (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                  {location}
                </span>
              ) : null}
              {listedOn ? (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  Listed {listedOn}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                verified
              </span>
              Trust &amp; Quality
            </h2>
            <div className="space-y-8">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Toy Condition Rating
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {conditionMetric.label}
                  </span>
                </div>
                <TenthScaleVisual value={conditionMetric.value} />
              </div>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Member Reliability
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {memberMetric.label}
                  </span>
                </div>
                <TenthScaleVisual value={memberMetric.value} />
              </div>
            </div>
          </div>

          {!hideRequest ? (
            <button
              type="button"
              onClick={handleRequest}
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-blue-600 p-6 text-left text-white shadow-md transition-transform duration-200 hover:bg-blue-600/95 active:scale-[0.98] dark:bg-blue-600"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold">Request Exchange</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">
                  Instant Proposal
                </span>
              </div>
              <span className="material-symbols-outlined text-2xl leading-none">
                sync_alt
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
