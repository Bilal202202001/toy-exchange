"use client";

import ToyListingsFeed from "@/components/toybox/ToyListingsFeed";

export default function ToyboxHomePage() {
  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100">
      <ToyListingsFeed />
    </div>
  );
}
