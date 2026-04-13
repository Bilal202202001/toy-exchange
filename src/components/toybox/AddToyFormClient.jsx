"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Upload, X } from "lucide-react";
import { addMyToy } from "@/lib/myToyListings";

const emptyForm = () => ({
  title: "",
  description: "",
  location: "",
  condition: "",
  ageRange: "",
  category: "",
});

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00C4D9] focus:bg-white focus:ring-2 focus:ring-[#e0f7fa]";

export default function AddToyFormClient() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const revokePreviews = useCallback((urls) => {
    urls.forEach((u) => {
      if (u.startsWith("blob:")) URL.revokeObjectURL(u);
    });
  }, []);

  useEffect(() => {
    return () => {
      revokePreviews(imagePreviews);
    };
  }, [imagePreviews, revokePreviews]);

  const onFilesChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const next = [...imageFiles, ...files].slice(0, 8);
    setImageFiles(next);
    revokePreviews(imagePreviews);
    const urls = next.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    e.target.value = "";
  };

  const removeImageAt = (index) => {
    const nextFiles = imageFiles.filter((_, i) => i !== index);
    const revoked = imagePreviews[index];
    if (revoked?.startsWith("blob:")) URL.revokeObjectURL(revoked);
    setImageFiles(nextFiles);
    setImagePreviews(nextFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (imagePreviews.length === 0) return;

    const id = `mine-${Date.now()}`;
    const listedOn = new Date().toISOString().slice(0, 10);
    const toy = {
      id,
      title: form.title.trim(),
      imageUrl: imagePreviews[0],
      images: [...imagePreviews],
      listedBy: "You",
      listedOn,
      rating: 5,
      location: form.location.trim() || "—",
      description: form.description.trim() || "No description provided.",
      details: [
        { label: "Condition", value: form.condition.trim() || "—" },
        { label: "Age range", value: form.ageRange.trim() || "—" },
        { label: "Category", value: form.category.trim() || "Uncategorized" },
      ],
    };

    addMyToy(toy);
    router.push("/toybox/my-toys");
  };

  const handleCancel = () => {
    revokePreviews(imagePreviews);
    router.push("/toybox/my-toys");
  };

  const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500";

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col lg:max-h-[min(calc(100dvh-5.5rem),900px)]">
      <Link
        href="/toybox/my-toys"
        className="mb-3 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to My Toys
      </Link>

      {/* Full width of main column: bleed past DashboardShell main padding */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white py-4 shadow-sm sm:py-5 lg:py-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="shrink-0 border-b border-slate-100 pb-3">
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">Add a new toy</h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Photos and details match what appears on marketplace listings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto lg:overflow-hidden lg:pr-1"
        >
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 xl:gap-8">
            {/* Left: title, photos, description */}
            <div className="flex min-h-0 flex-col gap-3">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Wooden train set"
                  className={fieldClass}
                />
              </div>

              <div className="min-h-0 shrink-0">
                <label className={labelClass}>Photos (up to 8)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="add-toy-images"
                  onChange={onFilesChange}
                />
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {imagePreviews.map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className="relative h-16 w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:h-[4.5rem] sm:w-24"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob URLs */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImageAt(i)}
                        className="absolute right-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded bg-slate-900/70 text-white hover:bg-slate-900"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="add-toy-images"
                    className="flex h-16 w-[4.5rem] shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-[#00C4D9]/60 hover:bg-[#e0f7fa]/40 sm:h-[4.5rem] sm:w-24"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-[10px] font-medium leading-none">Add</span>
                  </label>
                </div>
                {imagePreviews.length === 0 && (
                  <p className="mt-1 text-xs text-amber-700">Add at least one image to publish.</p>
                )}
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <label className={labelClass}>Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Condition, what’s included, and anything buyers should know."
                  className={`${fieldClass} min-h-[4.5rem] flex-1 resize-none lg:min-h-0`}
                />
              </div>
            </div>

            {/* Right: location + details — 2×2 side by side */}
            <div className="grid shrink-0 grid-cols-2 content-start gap-x-3 gap-y-3 lg:gap-x-4">
              <div className="min-w-0">
                <label className={labelClass}>Location</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="City, neighborhood"
                  className={fieldClass}
                />
              </div>
              <div className="min-w-0">
                <label className={labelClass}>Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. Trains & vehicles"
                  className={fieldClass}
                />
              </div>
              <div className="min-w-0">
                <label className={labelClass}>Condition</label>
                <input
                  value={form.condition}
                  onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                  placeholder="e.g. Very good"
                  className={fieldClass}
                />
              </div>
              <div className="min-w-0">
                <label className={labelClass}>Age range</label>
                <input
                  value={form.ageRange}
                  onChange={(e) => setForm((f) => ({ ...f, ageRange: e.target.value }))}
                  placeholder="e.g. 3–8 years"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={imagePreviews.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00C4D9] px-6 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#00ACC1] disabled:pointer-events-none disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Publish listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
