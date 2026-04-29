import { notFound } from "next/navigation";
import { getToyListingById } from "@/data/toyListings";
import ExchangeProposalClient from "@/components/toybox/ExchangeProposalClient";

export const metadata = {
  title: "Exchange Proposal — ToyBox",
};

export default async function ExchangeProposalPage({ params }) {
  const { id } = await params;
  const listing = getToyListingById(id);
  if (!listing) notFound();
  return <ExchangeProposalClient listing={listing} />;
}
