import ToyListingsFeed from "@/components/toybox/ToyListingsFeed";

export default function ToyboxHomePage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Home</h1>
      <p className="mt-2 text-slate-500">
        Browse toy listings from families near you.
      </p>
      <ToyListingsFeed />
    </div>
  );
}
