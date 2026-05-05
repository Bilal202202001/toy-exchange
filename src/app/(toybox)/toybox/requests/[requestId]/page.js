import RequestDetailHydrate from "@/components/toybox/RequestDetailHydrate";

export const metadata = {
  title: "Request details — ToyBox",
};

export default async function RequestDetailPage({ params }) {
  const { requestId } = await params;
  return <RequestDetailHydrate requestId={requestId} />;
}
