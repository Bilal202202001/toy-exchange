"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  defaultProfile,
  loadProfile,
  profileInitials,
  saveProfile,
  slugifyUsername,
} from "@/lib/profile";

export default function EditProfileClient() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);
  const [form, setForm] = useState(defaultProfile);

  useEffect(() => {
    setForm(loadProfile());
    setHydrated(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile({
      displayName: form.displayName,
      username: slugifyUsername(form.username || "user"),
      bio: form.bio,
      location: form.location,
      email: form.email,
      phone: form.phone,
      avatarUrl: form.avatarUrl,
      reliability: form.reliability ?? defaultProfile.reliability,
    });
    router.push("/toybox/profile");
  };

  const onAvatarFile = (file) => {
    if (!file) {
      setForm((f) => ({ ...f, avatarUrl: "" }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = typeof reader.result === "string" ? reader.result : null;
      setForm((f) => ({ ...f, avatarUrl: url ?? "" }));
    };
    reader.readAsDataURL(file);
  };

  const coverUrl = form.avatarUrl;
  const isLocalAvatar =
    typeof coverUrl === "string" &&
    (coverUrl.startsWith("blob:") || coverUrl.startsWith("data:"));

  const reliability = Number(form.reliability);
  const relScore = Number.isFinite(reliability) ? Math.min(10, Math.max(0, reliability)) : 10;
  const excellent = relScore >= 9;

  if (!hydrated) {
    return (
      <div className="w-full space-y-6 py-4">
        <div className="mx-auto h-32 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-12 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-12 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100">
      {/* Page header */}
      <header className="mb-10 flex items-center gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <Link
          href="/toybox/profile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-slate-100 active:scale-[0.98] dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-2xl leading-none">arrow_back</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-tight">
          Edit profile
        </h1>
        <div className="w-10 shrink-0" aria-hidden />
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            onAvatarFile(f ?? null);
            e.target.value = "";
          }}
        />

        {/* Avatar */}
        <div className="mb-10 flex flex-col items-center">
          <div className="group relative">
            <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-md ring-4 ring-white dark:ring-slate-900">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={isLocalAvatar}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-200 to-blue-600 text-3xl font-bold text-white dark:from-slate-600 dark:to-slate-800">
                  {profileInitials(form.displayName)}
                </div>
              )}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg transition-transform active:scale-95 dark:border-slate-900"
              aria-label="Change photo"
              onClick={() => fileRef.current?.click()}
            >
              <span className="material-symbols-outlined text-[1.25rem]">photo_camera</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-4 rounded-xl px-4 py-2 text-[0.75rem] font-bold uppercase tracking-wider text-blue-600 transition-colors hover:bg-blue-50 active:scale-[0.98] dark:text-blue-400 dark:hover:bg-blue-950/40"
          >
            Change photo
          </button>
        </div>

        {/* Full name */}
        <div className="space-y-2">
          <label
            htmlFor="edit-full-name"
            className="ml-1 block text-[0.75rem] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400"
          >
            Full name
          </label>
          <input
            id="edit-full-name"
            name="displayName"
            type="text"
            required
            autoComplete="name"
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            placeholder="Enter your full name"
            className="w-full rounded-2xl border-none bg-white px-5 py-4 text-[0.875rem] font-medium text-slate-900 shadow-sm outline-none ring-1 ring-transparent transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label
            htmlFor="edit-location"
            className="ml-1 block text-[0.75rem] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400"
          >
            Address / location
          </label>
          <div className="relative">
            <input
              id="edit-location"
              name="location"
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="City, state"
              autoComplete="address-level2"
              className="w-full rounded-2xl border-none bg-white py-4 pl-5 pr-14 text-[0.875rem] font-medium text-slate-900 shadow-sm outline-none ring-1 ring-transparent transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-900 dark:text-slate-100"
            />
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[1.25rem] text-slate-400">
              <span className="material-symbols-outlined text-[1.25rem] leading-none">
                location_on
              </span>
            </span>
          </div>
        </div>

        {/* Reliability (read-only) */}
        <div className="space-y-3">
          <label className="ml-1 block text-[0.75rem] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400">
            Reliability score
          </label>
          <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/50 dark:bg-blue-950/30">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-2 text-white shadow-sm">
                <span className="material-symbols-outlined filled-icon text-[1.5rem] leading-none">
                  verified_user
                </span>
              </div>
              <div>
                <span className="block text-[1.125rem] font-extrabold text-blue-600 dark:text-blue-400">
                  {relScore}/10
                </span>
                <span className="text-[10px] font-extrabold uppercase text-blue-400 dark:text-blue-500">
                  {excellent ? "Excellent status" : "Good standing"}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-blue-300 dark:text-blue-600">
              lock
            </span>
          </div>
          <p className="px-1 text-[0.75rem] italic leading-relaxed text-slate-500 dark:text-slate-400">
            Your reliability score is based on your exchange history and cannot be edited manually.
          </p>
        </div>

        {/* Account (secondary) */}
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Account</h2>
          <div className="space-y-2">
            <label
              htmlFor="edit-username"
              className="ml-1 block text-[0.75rem] font-bold uppercase tracking-tight text-slate-500"
            >
              Username
            </label>
            <input
              id="edit-username"
              name="username"
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  username: slugifyUsername(e.target.value),
                }))
              }
              className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-[0.875rem] font-medium outline-none ring-1 ring-transparent focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-100"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="edit-bio"
              className="ml-1 block text-[0.75rem] font-bold uppercase tracking-tight text-slate-500"
            >
              Bio
            </label>
            <textarea
              id="edit-bio"
              name="bio"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="w-full resize-y rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-[0.875rem] outline-none ring-1 ring-transparent focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="edit-email"
                className="ml-1 block text-[0.75rem] font-bold uppercase tracking-tight text-slate-500"
              >
                Email
              </label>
              <input
                id="edit-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-[0.875rem] outline-none focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-100"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-phone"
                className="ml-1 block text-[0.75rem] font-bold uppercase tracking-tight text-slate-500"
              >
                Phone
              </label>
              <input
                id="edit-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-[0.875rem] outline-none focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-100"
                autoComplete="tel"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900/50">
          <div className="flex gap-4">
            <div className="shrink-0 rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                info
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[0.875rem] font-bold text-slate-900 dark:text-slate-100">
                Trust &amp; verification
              </h3>
              <p className="mt-1 text-[0.75rem] leading-relaxed text-slate-500 dark:text-slate-400">
                Verified identities help build trust within the community. Your badges will appear on
                your public profile.
              </p>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="mt-10 border-t border-slate-100 pt-8 dark:border-slate-800">
          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
