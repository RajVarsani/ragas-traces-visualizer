"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon, SizeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useTracesDetails } from "@/hooks/traces.hooks";
import { countChildren } from "@/lib/utils";

const Spans = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  const { spans } = useTracesDetails();

  const filteredSpans = useMemo(() => {
    if (!searchQuery) {
      return spans;
    }

    return spans.filter((item) =>
      JSON.stringify([item.id, item.self, item.outputs]).includes(searchQuery)
    );
  }, [spans, searchQuery]);
  return (
    <div className="flex flex-col gap-5 max-w-screen-lg mx-auto py-5 px-5">
      <h2 className="text-2xl font-medium text-slate-300">Your Spans</h2>
      <div className="border p-2 rounded-sm">
        <Table className="rounded-sm">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Children</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpans.length > 0 ? (
              filteredSpans.map((span) => (
                <TableRow key={span.id} className="h-fit">
                  <TableCell>{span.id}</TableCell>
                  <TableCell>{span.self.name}</TableCell>
                  <TableCell>{countChildren(span)}</TableCell>
                  <TableCell className="text-right py-4">
                    <Link href={`/explore/${span.id}`}>
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
                <TableCell colSpan={4} className="text-center">
                  No spans found
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
