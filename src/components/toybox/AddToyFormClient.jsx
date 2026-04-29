"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { addMyToy } from "@/lib/myToyListings";
import { loadProfile } from "@/lib/profile";

const MAX_PHOTOS = 5;

const CATEGORY_OPTIONS = [
  { value: "", label: "Select Category", disabled: true },
  { value: "doll", label: "Doll" },
  { value: "puzzles", label: "Puzzles" },
  { value: "vehicle", label: "Vehicle" },
  { value: "educational", label: "Educational" },
  { value: "outdoor", label: "Outdoor" },
];

const EXCHANGE_OPTIONS = [
  { value: "", label: "Select Preferred Category", disabled: true },
  { value: "doll", label: "Doll" },
  { value: "puzzles", label: "Puzzles" },
  { value: "vehicle", label: "Vehicle" },
  { value: "educational", label: "Educational" },
  { value: "outdoor", label: "Outdoor" },
  { value: "any", label: "Any Category" },
];

const INITIAL_CONTACTS = [
  { id: "felix", name: "Felix", seed: "Felix", selected: true },
  { id: "anya", name: "Anya", seed: "Anya", selected: true },
  { id: "leo", name: "Leo", seed: "Leo", selected: false },
  { id: "mila", name: "Mila", seed: "Mila", selected: true },
  { id: "zoe", name: "Zoe", seed: "Zoe", selected: false },
  { id: "kai", name: "Kai", seed: "Kai", selected: false },
];

function diceUrl(seed) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

const fieldClass =
  "h-14 w-full rounded-xl border border-add-toy-primary/10 bg-white px-4 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-add-toy-primary focus:ring-1 focus:ring-add-toy-primary dark:bg-slate-900 dark:text-slate-100";

const selectClass = `${fieldClass} appearance-none`;

const textareaClass =
  "w-full resize-none rounded-xl border border-add-toy-primary/10 bg-white p-4 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-add-toy-primary focus:ring-1 focus:ring-add-toy-primary dark:bg-slate-900 dark:text-slate-100";

const labelClass =
  "block px-1 text-sm font-semibold text-slate-700 dark:text-slate-300";

export default function AddToyFormClient() {
  const router = useRouter();
  const fileRef = useRef(null);
  const photoId = useRef(0);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState(8);
  const [ageRange, setAgeRange] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedWorth, setEstimatedWorth] = useState("");
  const [exchangeFor, setExchangeFor] = useState("");
  const [shareWithAll, setShareWithAll] = useState(true);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);

  const [photos, setPhotos] = useState([]);
  const photosRef = useRef([]);

  photosRef.current = photos;

  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => {
        if (p.url?.startsWith("blob:")) URL.revokeObjectURL(p.url);
      });
    };
  }, []);

  const addFiles = useCallback((list) => {
    const incoming = Array.from(list ?? []);
    if (incoming.length === 0) return;
    setPhotos((prev) => {
      const next = [...prev];
      for (const file of incoming) {
        if (!file.type.startsWith("image/")) continue;
        if (next.length >= MAX_PHOTOS) break;
        const url = URL.createObjectURL(file);
        photoId.current += 1;
        next.push({ id: `p-${photoId.current}`, file, url });
      }
      return next;
    });
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const removePhotoAt = useCallback((index) => {
    setPhotos((prev) => {
      const row = prev[index];
      if (row?.url?.startsWith("blob:")) URL.revokeObjectURL(row.url);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const toggleContact = (id) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (photos.length === 0) return;

    const imageUrls = photos.map((p) => p.url);
    const catLabel =
      CATEGORY_OPTIONS.find((o) => o.value === category)?.label ?? "—";
    const exchLabel =
      EXCHANGE_OPTIONS.find((o) => o.value === exchangeFor)?.label ?? "—";

    const id = `mine-${Date.now()}`;
    const listedOn = new Date().toISOString().slice(0, 10);
    const { username } = loadProfile();

    const visibilitySummary = shareWithAll
      ? "All contacts"
      : `Specific: ${contacts.filter((c) => c.selected).map((c) => c.name).join(", ") || "None"}`;

    const toy = {
      id,
      title: title.trim(),
      imageUrl: imageUrls[0],
      images: [...imageUrls],
      listedBy: "You",
      ownerUsername: username,
      listedOn,
      rating: 5,
      location: "—",
      description: description.trim() || "No description provided.",
      details: [
        { label: "Category", value: catLabel },
        { label: "Condition", value: `${condition}/10` },
        { label: "Age group", value: ageRange.trim() || "—" },
        { label: "Estimated worth", value: estimatedWorth.trim() || "—" },
        { label: "Open to exchange for", value: exchLabel },
        { label: "Visible to", value: visibilitySummary },
      ],
    };

    addMyToy(toy);
    router.push("/toybox/my-toys");
  };

  const atLimit = photos.length >= MAX_PHOTOS;

  return (
    <div
      className="-mx-4 -mt-4 mb-0 flex min-h-[calc(100dvh-5.5rem)] min-h-0 flex-1 flex-col bg-add-toy-bg pb-2 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 antialiased dark:bg-add-toy-bg-dark dark:text-slate-100 sm:-mx-6 lg:-mx-8"
    >
      <header className="sticky top-0 z-50 flex shrink-0 items-center justify-between border-b border-add-toy-primary/10 bg-add-toy-bg/80 px-4 py-4 backdrop-blur-md dark:bg-add-toy-bg-dark/80">
        <Link
          href="/toybox/my-toys"
          className="flex size-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-add-toy-primary/10 dark:text-slate-300"
          aria-label="Back to My Toys"
        >
          <span className="material-symbols-outlined text-[22px] leading-none">
            arrow_back_ios_new
          </span>
        </Link>
        <h1 className="text-lg font-bold tracking-tight">Add Toy</h1>
        <div className="size-10 shrink-0" aria-hidden />
      </header>

      <form
        onSubmit={handleSubmit}
        className="w-full min-w-0 flex-1 space-y-6 px-4 py-6 pb-10"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label="Upload toy photos"
          onChange={(e) => addFiles(e.target.files)}
        />

        <div className="relative w-full">
          <button
            type="button"
            disabled={atLimit}
            onClick={() => fileRef.current?.click()}
            className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed border-add-toy-primary/30 bg-add-toy-primary/5 transition-colors hover:bg-add-toy-primary/10 disabled:cursor-not-allowed dark:border-add-toy-primary/40 sm:aspect-[4/3] sm:max-h-96 lg:max-h-[22rem]"
          >
            {photos[0] ? (
              <>
                <Image
                  src={photos[0].url}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, min(1120px, 90vw)"
                />
                <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
                <div className="relative z-[1] rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow">
                  {photos.length} / {MAX_PHOTOS} photos
                </div>
              </>
            ) : (
              <>
                <div className="flex size-16 items-center justify-center rounded-full bg-add-toy-primary/10 text-add-toy-primary">
                  <span className="material-symbols-outlined text-4xl leading-none">
                    add_a_photo
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Upload Photos
                  </p>
                  <p className="text-sm text-slate-500">
                    Add up to {MAX_PHOTOS} clear images
                  </p>
                </div>
              </>
            )}
            {!atLimit ? (
              <div className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-add-toy-primary text-white shadow-lg">
                <span className="material-symbols-outlined text-[22px] leading-none">
                  add
                </span>
              </div>
            ) : null}
          </button>
          {photos.length > 1 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {photos.slice(1).map((p, i) => (
                <div
                  key={p.id}
                  className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <Image
                    src={p.url}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="64px"
                  />
                  <button
                    type="button"
                    className="absolute right-0.5 top-0.5 rounded bg-slate-900/70 px-1 py-0.5 text-[10px] text-white"
                    onClick={() => removePhotoAt(i + 1)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2 sm:col-span-2 xl:col-span-3">
            <label className={labelClass} htmlFor="add-toy-name">
              Toy Name
            </label>
            <input
              id="add-toy-name"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Classic Wooden Train Set"
              className={fieldClass}
              required
            />
          </div>

          <div className="space-y-3 sm:col-span-2 xl:col-span-3">
            <span className={labelClass}>Visible To</span>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-add-toy-primary/10 bg-white p-4 shadow-sm dark:bg-slate-900">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  All Contacts
                </span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={shareWithAll}
                    onChange={(e) => setShareWithAll(e.target.checked)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-add-toy-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-slate-700 dark:after:border-gray-600" />
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShareWithAll(false)}
                className={`flex h-14 w-full items-center justify-between rounded-xl border-2 px-4 text-sm font-semibold shadow-sm transition-colors ${
                  !shareWithAll
                    ? "border-add-toy-primary bg-add-toy-primary/5 text-add-toy-primary"
                    : "border-transparent bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                <span>Select Specific Contacts</span>
                <span
                  className={`material-symbols-outlined ${!shareWithAll ? "filled-icon text-add-toy-primary" : "text-slate-400"}`}
                >
                  check_circle
                </span>
              </button>

              {!shareWithAll ? (
                <div className="-mx-1 overflow-x-auto px-1 pb-2 scrollbar-hide">
                  <div className="flex min-w-max gap-4">
                    {contacts.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleContact(c.id)}
                        className={`relative flex flex-col items-center gap-1 ${!c.selected ? "opacity-60" : ""}`}
                      >
                        <div
                          className={`relative size-14 rounded-full bg-white p-0.5 dark:bg-slate-900 ${
                            c.selected
                              ? "border-2 border-add-toy-primary"
                              : "border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <Image
                            src={diceUrl(c.seed)}
                            alt=""
                            width={56}
                            height={56}
                            unoptimized
                            className={`h-full w-full rounded-full object-cover ${!c.selected ? "grayscale" : ""}`}
                          />
                          <div
                            className={`absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-white text-white dark:border-slate-900 ${
                              c.selected
                                ? "border-white bg-add-toy-primary dark:border-slate-900"
                                : "border-slate-200 bg-white text-slate-300 dark:border-slate-700 dark:bg-slate-800"
                            }`}
                          >
                            {c.selected ? (
                              <span className="material-symbols-outlined text-[10px] font-bold leading-none">
                                check
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-3 sm:col-span-1">
            <label className={labelClass} htmlFor="add-toy-category">
              Category
            </label>
            <div className="relative">
              <select
                id="add-toy-category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
                required
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value || "empty"} value={o.value} disabled={o.disabled}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined">expand_more</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 sm:col-span-1">
            <label className={labelClass} htmlFor="add-toy-age">
              Target Age Group
            </label>
            <input
              id="add-toy-age"
              name="ageRange"
              type="text"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              placeholder="e.g. 3-5 years"
              className={fieldClass}
            />
          </div>

          <div className="space-y-3 sm:col-span-2 xl:col-span-3">
            <span className={labelClass}>Condition</span>
            <div className="flex flex-wrap gap-2 pb-1 sm:overflow-visible sm:pb-0">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCondition(n)}
                  className={`flex h-10 min-w-[40px] shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                    condition === n
                      ? "border-add-toy-primary bg-add-toy-primary font-bold text-white shadow-[0_4px_12px_-2px_rgba(43,140,238,0.35)]"
                      : "border-add-toy-primary/20 bg-white text-slate-600 hover:border-add-toy-primary/50 dark:bg-slate-900 dark:text-slate-400"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2 xl:col-span-3">
            <label className={labelClass} htmlFor="add-toy-desc">
              Description
            </label>
            <textarea
              id="add-toy-desc"
              name="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more about the toy..."
              className={textareaClass}
            />
          </div>

          <div className="space-y-2 sm:col-span-1">
            <label className={labelClass} htmlFor="add-toy-worth">
              Estimated Worth
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-500">
                $
              </span>
              <input
                id="add-toy-worth"
                name="estimatedWorth"
                type="text"
                inputMode="decimal"
                value={estimatedWorth}
                onChange={(e) => setEstimatedWorth(e.target.value)}
                placeholder="0.00"
                className={`${fieldClass} pl-8`}
              />
            </div>
          </div>

          <div className="space-y-3 sm:col-span-1 xl:col-span-2">
            <label className={labelClass} htmlFor="add-toy-exchange">
              Open to Exchange For...
            </label>
            <div className="relative">
              <select
                id="add-toy-exchange"
                name="exchangeFor"
                value={exchangeFor}
                onChange={(e) => setExchangeFor(e.target.value)}
                className={selectClass}
              >
                {EXCHANGE_OPTIONS.map((o) => (
                  <option key={o.value || "ex-empty"} value={o.value} disabled={o.disabled}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined">expand_more</span>
              </span>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 pt-2 sm:pt-4">
          <button
            type="submit"
            disabled={photos.length === 0 || !title.trim()}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-add-toy-primary font-bold text-white shadow-[0_8px_24px_-6px_rgba(43,140,238,0.45)] transition-all hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            <span>Post Toy</span>
            <span className="material-symbols-outlined text-[22px] leading-none">
              send
            </span>
          </button>
        </div>

      </form>
    </div>
  );
}
