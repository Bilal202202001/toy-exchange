import { notFound } from "next/navigation";
import { getIncomingRequestDetailPayload } from "@/data/toyRequests";
import RequestDetailClient from "@/components/toybox/RequestDetailClient";

export const metadata = {
  title: "Request details — ToyBox",
};

export default async function RequestDetailPage({ params }) {
  const { requestId } = await params;
  const payload = getIncomingRequestDetailPayload(requestId);
  if (!payload) notFound();
  return <RequestDetailClient payload={payload} />;
}
