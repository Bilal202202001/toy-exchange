import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, User, Calendar } from "lucide-react";

function formatListedOn(isoDate) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function StarRating({ value }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  return (
    <div className="flex items-center justify-end gap-0.5" aria-label={`Rating ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < full || (i === full && hasHalf);
        return (
          <Star
            key={i}
            className={`h-3.5 w-3.5 shrink-0 ${
              filled ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-300"
            }`}
            strokeWidth={1.2}
          />
        );
      })}
      <span className="ml-1 text-xs font-semibold text-slate-700">{value.toFixed(1)}</span>
    </div>
  );
}

export default function ToyListingCard({ listing }) {
  const { id, title, listedBy, listedOn, rating, location, ownerUsername } = listing;
  const coverUrl = listing.images?.[0] ?? listing.imageUrl;
  const isLocalImage =
    typeof coverUrl === "string" &&
    (coverUrl.startsWith("blob:") || coverUrl.startsWith("data:"));

  const profileHref = ownerUsername ? `/toybox/profile/${ownerUsername}` : null;

  return (
    <article className="group flex max-w-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm outline-none transition-shadow hover:shadow-md hover:shadow-slate-200/80 focus-within:ring-2 focus-within:ring-[#00C4D9] focus-within:ring-offset-2">
      <Link
        href={`/toybox/${id}`}
        className="relative block w-full overflow-hidden rounded-xl bg-slate-100"
      >
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={coverUrl}
            alt={title}
            fill
            unoptimized={isLocalImage}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
        <Link
          href={`/toybox/${id}`}
          className="line-clamp-2 text-base font-bold leading-snug text-slate-800 transition-colors hover:text-[#00ACC1]"
        >
          {title}
        </Link>

        <div className="grid grid-cols-2 gap-x-2 gap-y-2.5 text-xs sm:text-sm">
          <div className="flex min-w-0 items-center gap-1.5">
            <User className="h-3.5 w-3.5 shrink-0 text-[#00C4D9] sm:h-4 sm:w-4" aria-hidden />
            {profileHref ? (
              <Link
                href={profileHref}
                className="truncate font-semibold text-slate-800 underline-offset-2 hover:text-[#00ACC1] hover:underline"
                title={listedBy}
                onClick={(e) => e.stopPropagation()}
              >
                {listedBy}
              </Link>
            ) : (
              <span className="truncate font-semibold text-slate-800" title={listedBy}>
                {listedBy}
              </span>
            )}
          </div>
          <div className="flex min-w-0 items-center justify-end">
            <StarRating value={rating} />
          </div>

          <div className="flex min-w-0 items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-[#00C4D9] sm:h-4 sm:w-4" aria-hidden />
            <span className="truncate font-medium text-slate-700">{formatListedOn(listedOn)}</span>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#00C4D9] sm:h-4 sm:w-4" aria-hidden />
            <span className="truncate text-right font-semibold text-slate-800" title={location}>
              {location}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
