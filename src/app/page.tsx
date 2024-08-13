import TraceDetailsSheet from "@/components/dashboard/TraceDetailsSheet";
import TracesTreeView from "@/components/dashboard/TracesTreeView";

export default function Page() {
  return (
    <main className="w-screen h-screen">
      <TracesTreeView />
      <TraceDetailsSheet />
    </main>
  );
}
