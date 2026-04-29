import { Suspense } from "react";
import RequestSentClient from "@/components/toybox/RequestSentClient";

export const metadata = {
  title: "Request sent — ToyBox",
};

/** Full-screen success view after sending an exchange proposal (see toy detail flow). */
export default function RequestSentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[max(884px,100dvh)] bg-request-sent-bg dark:bg-request-sent-bg-dark" />
      }
    >
      <RequestSentClient />
    </Suspense>
  );
}
