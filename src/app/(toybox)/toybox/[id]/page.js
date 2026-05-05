
import ToyDetailClientGate from "@/components/toybox/ToyDetailClientGate";

export default async function ToyDetailPage({ params }) {

  const { id } = await params;

  return <ToyDetailClientGate id={id} />;

}

