"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import {
  defaultProfile,
  loadProfile,
  profileInitials,
  saveProfile,
  slugifyUsername,
} from "@/lib/profile";

export default function EditProfileClient() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [form, setForm] = useState(defaultProfile);

  useEffect(() => {
    setForm(loadProfile());
    setHydrated(true);
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveProfile({
      displayName: form.displayName,
      username: slugifyUsername(form.username || "user"),
      bio: form.bio,
      location: form.location,
      email: form.email,
      phone: form.phone,
      avatarUrl: form.avatarUrl,
    });
    router.push("/toybox/profile");
  };

  const onAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = typeof reader.result === "string" ? reader.result : null;
      setForm((f) => ({ ...f, avatarUrl: url }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCancel = () => {
    router.push("/toybox/profile");
  };

  if (!hydrated) {
    return (
      <div className="h-64 animate-pulse rounded-2xl bg-slate-100" aria-hidden />
    );
  }

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col lg:max-h-[min(calc(100dvh-5.5rem),900px)]">
      <Link
        href="/toybox/profile"
        className="mb-3 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to profile
      </Link>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white py-4 shadow-sm sm:py-5 lg:py-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="shrink-0 border-b border-slate-100 pb-3">
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">Edit profile</h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Update how you appear to other families on ToyBox.
          </p>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className="mt-4 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto lg:overflow-y-auto lg:pr-1"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#e0f7fa] bg-slate-100">
              {form.avatarUrl ? (
                <Image
                  src={form.avatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={
                    typeof form.avatarUrl === "string" &&
                    (form.avatarUrl.startsWith("blob:") ||
                      form.avatarUrl.startsWith("data:"))
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#80deea] to-[#00C4D9] text-2xl font-bold text-white">
                  {profileInitials(form.displayName)}
                </div>
              )}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-[#e0f7fa]/50">
              <Camera className="h-4 w-4 text-[#00C4D9]" />
              Change photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarPick}
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Display name
              </label>
              <input
                required
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#00C4D9] focus:bg-white focus:ring-4 focus:ring-[#e0f7fa]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Username
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  @
                </span>
                <input
                  value={form.username}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, username: slugifyUsername(e.target.value) }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-slate-800 outline-none focus:border-[#00C4D9] focus:bg-white focus:ring-4 focus:ring-[#e0f7fa]"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#00C4D9] focus:bg-white focus:ring-4 focus:ring-[#e0f7fa]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Location
            </label>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#00C4D9] focus:bg-white focus:ring-4 focus:ring-[#e0f7fa]"
              placeholder="City, region"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#00C4D9] focus:bg-white focus:ring-4 focus:ring-[#e0f7fa]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#00C4D9] focus:bg-white focus:ring-4 focus:ring-[#e0f7fa]"
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-[#00C4D9] px-8 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,196,217,0.35)] hover:bg-[#00ACC1]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
