import { getToyListingById } from "@/data/toyListings";
import ToyDetailClientGate from "@/components/toybox/ToyDetailClientGate";

export default async function ToyDetailPage({ params }) {
  const { id } = await params;
  const listing = getToyListingById(id);

  return <ToyDetailClientGate id={id} initialListing={listing} />;
}
