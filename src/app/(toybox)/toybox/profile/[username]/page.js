import { Suspense } from "react";
import PublicProfileClient from "@/components/toybox/PublicProfileClient";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const safe = decodeURIComponent(String(username ?? ""));
  return {
    title: `${safe ? `@${safe}` : "Profile"} — ToyBox`,
  };
}

function ProfileFallback() {
  return (
    <div className="w-full space-y-6 py-8">
      <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="mx-auto h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
    </div>
  );
}

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  return (
    <Suspense fallback={<ProfileFallback />}>
      <PublicProfileClient username={username} />
    </Suspense>
  );
}
