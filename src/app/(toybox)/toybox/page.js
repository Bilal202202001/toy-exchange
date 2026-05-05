import ToyListingsFeed from "@/components/toybox/ToyListingsFeed";

export default function ToyboxHomePage() {
  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 lg:pb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Home
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400 lg:text-base">
            Browse toy listings from families near you.
          </p>
        </div>
      </div>
      <ToyListingsFeed />
    </div>
  );
}
