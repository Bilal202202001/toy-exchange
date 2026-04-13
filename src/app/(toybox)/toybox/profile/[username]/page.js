import PublicProfileClient from "@/components/toybox/PublicProfileClient";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const safe = decodeURIComponent(String(username ?? ""));
  return {
    title: `${safe ? `@${safe}` : "Profile"} — ToyBox`,
  };
}

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  return <PublicProfileClient username={username} />;
}
