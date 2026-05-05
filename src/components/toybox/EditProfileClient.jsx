"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  defaultProfile,
  loadProfile,
  profileInitials,
  slugifyUsername,
} from "@/lib/profile";
import { persistServerProfileFields, useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/apiClient";

async function uploadImageFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiFetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Avatar upload failed");
  const j = await res.json();
  if (typeof j.url !== "string") throw new Error("Avatar upload incomplete");
  return j.url.trim();
}

export default function EditProfileClient() {
  const router = useRouter();
  const { refreshMe } = useAuth();
  const fileRef = useRef(null);
  /** @type {React.MutableRefObject<File | null>} */
  const pendingAvatarFileRef = useRef(null);

  const [hydrated, setHydrated] = useState(false);
  const [form, setForm] = useState(defaultProfile);

  /** @type {[string | null, function]} */
  const [avatarDraftUrl, setAvatarDraftUrl] = useState(null);

  const [friendUsername, setFriendUsername] = useState("");
  const [friendBusy, setFriendBusy] = useState(false);
  const [friendHint, setFriendHint] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setForm(loadProfile());
    setHydrated(true);
  }, []);

  useEffect(() => {
    return () => {
      if (avatarDraftUrl?.startsWith("blob:")) URL.revokeObjectURL(avatarDraftUrl);
    };
  }, [avatarDraftUrl]);

  const revokeDraft = () => {
    setAvatarDraftUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    pendingAvatarFileRef.current = null;
  };

  const onAvatarFile = (file) => {
    if (!file) {
      revokeDraft();
      setForm((f) => ({ ...f, avatarUrl: "" }));
      return;
    }
    if (!file.type.startsWith("image/")) return;
    if (avatarDraftUrl?.startsWith("blob:")) URL.revokeObjectURL(avatarDraftUrl);
    pendingAvatarFileRef.current = file;
    setAvatarDraftUrl(URL.createObjectURL(file));
    setForm((f) => ({ ...f, avatarUrl: "" }));
  };

  const resolveAvatarRemoteUrlForSubmit = async () => {
    const f = pendingAvatarFileRef.current;
    if (f instanceof File && f.type.startsWith("image/")) {
      const url = await uploadImageFile(f);
      revokeDraft();
      setForm((prev) => ({ ...prev, avatarUrl: url }));
      return url;
    }

    const s = typeof form.avatarUrl === "string" ? form.avatarUrl.trim() : "";
    if (/^data:image\//i.test(s)) {
      const blob = await fetch(s).then((r) => r.blob());
      const fileLike = new File([blob], "avatar.jpg", { type: blob.type || "image/jpeg" });
      return uploadImageFile(fileLike);
    }

    if (/^https?:\/\//i.test(s)) return s;
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      const avatarUrlOut = await resolveAvatarRemoteUrlForSubmit();

      const uname = slugifyUsername(form.username || "user");
      const patch = await apiFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: form.displayName.trim().slice(0, 120),
          username: uname,
          bio: form.bio,
          location: form.location,
          phone: form.phone || "",
          email: form.email,
          avatarUrl: avatarUrlOut,
        }),
      });

      const body = await patch.json().catch(() => ({}));
      if (!patch.ok) {
        setSaveError(typeof body?.error === "string" ? body.error : "Could not save profile.");
        return;
      }

      persistServerProfileFields(body);
      await refreshMe();
      router.push("/toybox/profile");
    } catch {
      setSaveError("Could not save profile. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const inviteFriend = async () => {
    setFriendHint("");
    const raw = slugifyUsername(friendUsername);
    if (!raw) return;
    setFriendBusy(true);
    try {
      const res = await apiFetch("/api/friends", {
        method: "POST",
        body: JSON.stringify({ username: raw }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFriendHint(typeof j?.error === "string" ? j.error : "Could not send request.");
        return;
      }
      setFriendUsername("");
      setFriendHint("Friend request sent.");
    } finally {
      setFriendBusy(false);
    }
  };

  const coverUrl = avatarDraftUrl || form.avatarUrl;
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
        {saveError ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
            {saveError}
          </p>
        ) : null}

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
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#b2ebf2] to-primary text-3xl font-bold text-white dark:from-slate-600 dark:to-slate-800">
                  {profileInitials(form.displayName)}
                </div>
              )}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg transition-transform active:scale-95 dark:border-slate-900"
              aria-label="Change photo"
              onClick={() => fileRef.current?.click()}
            >
              <span className="material-symbols-outlined text-[1.25rem]">photo_camera</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-4 rounded-xl px-4 py-2 text-[0.75rem] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary-soft active:scale-[0.98] dark:text-[#80deea] dark:hover:bg-teal-950/40"
          >
            Change photo
          </button>
        </div>

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
            className="w-full rounded-2xl border-none bg-white px-5 py-4 text-[0.875rem] font-medium text-slate-900 shadow-sm outline-none ring-1 ring-transparent transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/25 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

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
              className="w-full rounded-2xl border-none bg-white py-4 pl-5 pr-14 text-[0.875rem] font-medium text-slate-900 shadow-sm outline-none ring-1 ring-transparent transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/25 dark:bg-slate-900 dark:text-slate-100"
            />
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[1.25rem] text-slate-400">
              <span className="material-symbols-outlined text-[1.25rem] leading-none">
                location_on
              </span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="ml-1 block text-[0.75rem] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400">
            Reliability score
          </label>
          <div className="flex items-center justify-between rounded-2xl border border-primary-border bg-primary-soft/50 p-5 dark:border-teal-900/50 dark:bg-teal-950/30">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-2 text-white shadow-sm">
                <span className="material-symbols-outlined filled-icon text-[1.5rem] leading-none">
                  verified_user
                </span>
              </div>
              <div>
                <span className="block text-[1.125rem] font-extrabold text-primary dark:text-[#80deea]">
                  {relScore}/10
                </span>
                <span className="text-[10px] font-extrabold uppercase text-primary-muted dark:text-[#4dd0e1]">
                  {excellent ? "Excellent status" : "Good standing"}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-300 dark:text-primary/50">
              lock
            </span>
          </div>
          <p className="px-1 text-[0.75rem] italic leading-relaxed text-slate-500 dark:text-slate-400">
            Your reliability score is based on your exchange history and cannot be edited manually.
          </p>
        </div>

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
              className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-[0.875rem] font-medium outline-none ring-1 ring-transparent focus:ring-2 focus:ring-primary/25 dark:bg-slate-800 dark:text-slate-100"
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
              className="w-full resize-y rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-[0.875rem] outline-none ring-1 ring-transparent focus:ring-2 focus:ring-primary/25 dark:bg-slate-800 dark:text-slate-100"
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
                className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-[0.875rem] outline-none focus:ring-2 focus:ring-primary/25 dark:bg-slate-800 dark:text-slate-100"
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
                className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-[0.875rem] outline-none focus:ring-2 focus:ring-primary/25 dark:bg-slate-800 dark:text-slate-100"
                autoComplete="tel"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add friend</h3>
          <p className="text-[0.75rem] leading-relaxed text-slate-500 dark:text-slate-400">
            Invite someone by ToyBox username. They must already have an account.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="edit-friend-user"
              type="text"
              value={friendUsername}
              disabled={friendBusy}
              placeholder="their_username"
              onChange={(e) => setFriendUsername(e.target.value)}
              className="min-h-14 flex-1 rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-[0.875rem] outline-none ring-2 ring-transparent transition focus:ring-primary/25 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="button"
              disabled={friendBusy || !slugifyUsername(friendUsername)}
              onClick={() => void inviteFriend()}
              className="rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {friendBusy ? "Sending…" : "Send invite"}
            </button>
          </div>
          {friendHint ? (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{friendHint}</p>
          ) : null}
        </div>

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

        <div className="mt-10 border-t border-slate-100 pt-8 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(0,196,217,0.3)] transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
