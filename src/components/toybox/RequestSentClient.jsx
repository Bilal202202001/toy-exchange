"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Spline_Sans } from "next/font/google";

const splineSans = Spline_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RequestSentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerRaw = searchParams.get("name")?.trim() || "Alex";

  const close = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/toybox");
  };

  return (
    <div
      className={`flex min-h-[max(884px,100dvh)] min-h-screen flex-col bg-request-sent-bg dark:bg-request-sent-bg-dark ${splineSans.className}`}
    >
      <div className="flex items-center justify-end p-4">
        <button
          type="button"
          onClick={close}
          className="rounded-full p-2 text-slate-900 transition-colors hover:bg-slate-200 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-2xl leading-none">
            close
          </span>
        </button>
      </div>

      <div className="flex flex-grow flex-col items-center justify-center px-6 pb-12">
        <div className="relative mb-8 aspect-square w-full max-w-[280px]">
          <div className="absolute inset-0 animate-pulse rounded-full bg-request-sent-primary/10" />
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-center">
              <div className="z-0 flex h-32 w-32 -rotate-6 items-center justify-center rounded-lg bg-blue-100 shadow-md dark:bg-blue-900/30">
                <span className="material-symbols-outlined text-6xl leading-none text-request-sent-primary">
                  card_giftcard
                </span>
              </div>
              <div className="z-10 -ml-5 flex h-32 w-32 rotate-6 items-center justify-center rounded-lg border-2 border-white bg-indigo-100 shadow-md dark:border-slate-800 dark:bg-indigo-900/30">
                <span className="material-symbols-outlined text-6xl leading-none text-indigo-600 dark:text-indigo-400">
                  handshake
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-sm space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Request Sent!
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Your exchange proposal has been sent to{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {sellerRaw}
            </span>
            . We&apos;ll notify you once they respond.
          </p>
        </div>

        <div className="mt-8 flex items-center space-x-2 rounded-full bg-green-100 px-4 py-2 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <span className="material-symbols-outlined text-xl leading-none">
            check_circle
          </span>
          <span className="text-sm font-medium">
            Request successfully delivered
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md p-6">
        <Link
          href="/toybox"
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-request-sent-primary py-4 font-bold text-white shadow-lg transition-all hover:bg-request-sent-primary/90 active:scale-[0.98]"
        >
          <span>Back to Home</span>
          <span className="material-symbols-outlined text-[22px] leading-none">
            arrow_forward
          </span>
        </Link>
        <div className="h-6" aria-hidden />
      </div>
    </div>
  );
}
