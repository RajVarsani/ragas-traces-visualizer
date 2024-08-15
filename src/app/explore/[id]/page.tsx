"use client";

import SpanSelector from "@/components/explore/SpanSelector";
import TraceDetailsSheet from "@/components/explore/TraceDetailsSheet";
import TracesTableView from "@/components/explore/TracesTable";
import TracesTreeView from "@/components/explore/TracesTreeView";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("view") || "table";

  return (
    <main className="w-screen h-screen relative">
      <motion.div
        className="w-screen h-screen relative"
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        key={activeTab}
      >
        {activeTab === "table" ? (
          <div className="pt-20 px-5">
            <TracesTableView />
          </div>
        ) : (
          <>
            <TracesTreeView />
            <TraceDetailsSheet />
          </>
        )}
      </motion.div>
      <SpanSelector />
    </main>
  );
}
