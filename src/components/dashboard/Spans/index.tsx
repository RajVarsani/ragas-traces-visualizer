"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTracesDetails } from "@/hooks/traces.hooks";
import { countChildren } from "@/lib/utils";
import { SizeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const Spans = () => {
  const searchParams = useSearchParams();
  const { spans } = useTracesDetails();

  const searchQuery = searchParams.get("q");
  const filteredSpans = useMemo(() => {
    if (!searchQuery) {
      return spans;
    }

    return spans.filter((item) =>
      JSON.stringify([item.id, item.self, item.outputs]).includes(searchQuery)
    );
  }, [spans, searchQuery]);
  const childrenCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    spans.forEach((span) => {
      counts[span.id] = countChildren(span);
    });

    return counts;
  }, [spans]);

  return (
    <div className="flex flex-col gap-5 max-w-screen-lg mx-auto py-5 px-5">
      <h2 className="text-2xl font-medium text-slate-300">Your Spans</h2>

      <div className="border p-2 rounded-sm">
        <Table className="rounded-sm">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Traces</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSpans.length > 0 ? (
              filteredSpans.map((span) => (
                <TableRow key={span.id} className="h-fit">
                  <TableCell>{span.id}</TableCell>
                  <TableCell>{span.self.name}</TableCell>
                  <TableCell>{childrenCounts[span.id]}</TableCell>
                  <TableCell className="text-right py-4">
                    <Link href={`/explore/${span.id}/table`}>
                      <Button
                        variant="outline"
                        className="py-1 px-3 h-fit w-fit items-center gap-2"
                      >
                        <span>Expand</span>
                        <SizeIcon className="w-5 h-5 text-slate-100" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center pt-4">
                  <span className="text-neutral-400">No spans found</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Spans;
