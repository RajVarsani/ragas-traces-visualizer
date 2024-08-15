import Header from "@/components/dashboard/Header";
import Spans from "@/components/dashboard/Spans";
import { Suspense } from "react";

export default function Page() {
  return (
    <main className="w-screen h-screen">
      <Suspense>
        <Header />
        <Spans />
      </Suspense>
    </main>
  );
}
