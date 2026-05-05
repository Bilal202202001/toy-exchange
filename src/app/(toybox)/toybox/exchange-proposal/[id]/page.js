import ExchangeProposalClient from "@/components/toybox/ExchangeProposalClient";

export const metadata = {
  title: "Exchange Proposal — ToyBox",
};

export default async function ExchangeProposalPage({ params }) {
  const { id } = await params;

  return <ExchangeProposalClient requestedListingId={id} />;
}
