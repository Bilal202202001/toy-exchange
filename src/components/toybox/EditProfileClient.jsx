"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  EmailInput,
  SingleImageInput,
  TextareaInput,
  TextInput,
  formButtonPrimaryClass,
  formButtonSecondaryClass,
  formCardClass,
  formSubtitleClass,
  formTitleClass,
} from "@/components/inputs";
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

      <div className={formCardClass}>
        <div className="shrink-0 border-b border-slate-100 pb-3">
          <h1 className={formTitleClass}>Edit profile</h1>
          <p className={formSubtitleClass}>
            Update how you appear to other families on ToyBox.
          </p>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto lg:overflow-y-auto lg:pr-1"
        >
          <SingleImageInput
            id="edit-profile-avatar"
            name="avatar"
            label="Profile photo"
            variant="avatar"
            accept="image/*"
            maxSizeBytes={5 * 1024 * 1024}
            remotePreviewUrl={form.avatarUrl || undefined}
            avatarFallback={profileInitials(form.displayName)}
            onFileChange={onAvatarFile}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              id="edit-profile-display-name"
              name="displayName"
              label="Display name"
              required
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              autoComplete="name"
            />
            <TextInput
              id="edit-profile-username"
              name="username"
              label="Username"
              prefix="@"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: slugifyUsername(e.target.value) }))
              }
              placeholder="username"
              autoComplete="username"
            />
          </div>

          <TextareaInput
            id="edit-profile-bio"
            name="bio"
            label="Bio"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            className="resize-y"
          />

          <TextInput
            id="edit-profile-location"
            name="location"
            label="Location"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="City, region"
            autoComplete="address-level2"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <EmailInput
              id="edit-profile-email"
              name="email"
              label="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />
            <TextInput
              id="edit-profile-phone"
              name="phone"
              label="Phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              autoComplete="tel"
            />
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:justify-end sm:gap-3">
            <button type="button" onClick={handleCancel} className={formButtonSecondaryClass}>
              Cancel
            </button>
            <button type="submit" className={formButtonPrimaryClass}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
