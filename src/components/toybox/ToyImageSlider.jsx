"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ToyImageSlider({ images, title }) {
  const [index, setIndex] = useState(0);
  const safeImages = images?.length ? images : [];
  const n = safeImages.length;
  const current = n ? safeImages[Math.min(index, n - 1)] : "";
  const isLocal =
    typeof current === "string" &&
    (current.startsWith("blob:") || current.startsWith("data:"));

  const prev = () => setIndex((i) => (i - 1 + n) % n);
  const next = () => setIndex((i) => (i + 1) % n);

  if (!n) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        No images
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100">
      <div className="relative aspect-[16/9] w-full">
        <Image
          key={current}
          src={current}
          alt={`${title} — photo ${index + 1} of ${n}`}
          fill
          unoptimized={isLocal}
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 45vw, 560px"
          priority
        />
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-colors hover:bg-[#e0f7fa] hover:text-[#00838F]"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-colors hover:bg-[#e0f7fa] hover:text-[#00838F]"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-[#00C4D9]" : "w-2 bg-white/70 hover:bg-white"
                }`}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
