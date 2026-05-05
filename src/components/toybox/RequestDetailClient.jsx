"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChatWidget } from "@/contexts/ChatWidgetContext";

function usd(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function RequestDetailClient({ payload: initial }) {
  const router = useRouter();
  const { getRequestById, setRequestStatus } = useChatWidget();

  const live = getRequestById(initial.id) ?? initial;
  const status = live.status ?? "pending";
  const pending = status === "pending";

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/toybox/requests");
  };

  const onAccept = async () => {
    await setRequestStatus(initial.id, "accepted");
    router.push("/toybox/requests");
  };

  const onCancel = async () => {
    await setRequestStatus(initial.id, "declined");
    router.push("/toybox/requests");
  };

  const p = initial;

  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 lg:pb-8">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <button
            type="button"
            onClick={goBack}
            className="mt-0.5 shrink-0 rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Back to requests"
          >
            <span className="material-symbols-outlined text-2xl leading-none">
              arrow_back
            </span>
          </button>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-3xl">
              Request Details
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Review toys on the table and your partner&apos;s reliability before accepting.
            </p>
          </div>
        </div>
      </div>

      {!pending ? (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          This request is <strong>{status}</strong>.
          {" "}
          <Link href="/toybox/requests" className="font-semibold underline hover:no-underline">
            Back to Requests
          </Link>
        </div>
      ) : null}

      <div className="grid gap-8 lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] xl:items-start">
        <div className="min-w-0 space-y-8">
          {/* Partner offered */}
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 opacity-70 dark:text-slate-400">
              Partner offered toys
            </h2>
            <div className="flex flex-col gap-3">
              {p.partnerOfferedToys.map((toy) => (
                <OfferToyCard key={toy.toyId} toy={toy} />
              ))}
            </div>
          </section>

          {/* Your offer */}
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 opacity-70 dark:text-slate-400">
              Your offer
            </h2>
            <OfferToyCard
              toy={p.yourOfferToy}
              href={`/toybox/${p.yourOfferToy.toyId}`}
              chevronRight
            />
          </section>

          {/* Partner */}
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 opacity-70 dark:text-slate-400">
              Partner
            </h2>
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-slate-100 dark:border-[#4dd0e1]/35">
                <Image
                  src={p.partnerDetail.avatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {p.partnerDetail.username ? (
                    <Link
                      href={`/toybox/profile/${p.partnerDetail.username}`}
                      className="hover:text-primary dark:hover:text-[#80deea]"
                    >
                      {p.partnerDetail.name}
                    </Link>
                  ) : (
                    p.partnerDetail.name
                  )}
                </p>
                <div className="mt-0.5 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-base text-slate-400">
                    location_on
                  </span>
                  <span>{p.partnerDetail.location}</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <span className="material-symbols-outlined filled-icon text-[18px] text-amber-500">
                    star
                  </span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {p.partnerDetail.ratingDisplay.toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {p.partnerDetail.tradesCount} trades
                </span>
              </div>
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-3 lg:sticky lg:top-4 lg:z-10 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-slate-100/90 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Total request value
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {usd(p.totalRequestValueUsd)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 border-t border-slate-200/80 pt-2 dark:border-slate-700">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Total offer value
              </span>
              <span className="text-sm font-bold text-primary dark:text-[#80deea]">
                {usd(p.totalOfferValueUsd)}
              </span>
            </div>
          </div>

          {pending ? (
            <>
              <button
                type="button"
                onClick={onAccept}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-white shadow-[0_8px_24px_rgba(0,196,217,0.25)] transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">check_circle</span>
                Accept request
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-transparent text-base font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined text-xl">cancel</span>
                Cancel request
              </button>
            </>
          ) : (
            <Link
              href="/toybox/requests"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 text-base font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Back to Requests
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}

function OfferToyCard({ toy, href, chevronRight }) {
  const cls =
    "group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70";

  const body = (
    <>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 dark:border-slate-700">
        <Image
          src={toy.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-base font-bold text-slate-900 dark:text-slate-100 ${href ? "group-hover:text-primary dark:group-hover:text-[#80deea]" : ""}`}
        >
          {toy.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Condition: {toy.conditionLabel}
          </p>
          <p className="text-xs font-bold text-primary dark:text-[#80deea]">
            Est. value: {usd(toy.estValueUsd)}
          </p>
        </div>
      </div>
      {chevronRight ? (
        <span className="material-symbols-outlined shrink-0 text-slate-400 group-hover:text-slate-600 dark:text-slate-500">
          chevron_right
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}
