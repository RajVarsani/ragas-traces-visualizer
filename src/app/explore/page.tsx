import TraceDetailsSheet from "@/components/explore/TraceDetailsSheet";
import TracesTreeView from "@/components/explore/TracesTreeView";

export default function Page() {
  return (
    <main className="w-screen h-screen">
      <TracesTreeView />
      <TraceDetailsSheet />
    </main>
  );
}
