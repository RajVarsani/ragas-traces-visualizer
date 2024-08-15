"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTracesDetails } from "@/hooks/traces.hooks";
import { MixerVerticalIcon, TableIcon } from "@radix-ui/react-icons";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const SpanSelector = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeItem = params.id as string;
  const activeTab = searchParams.get("view") || "table";

  const { spans } = useTracesDetails();

  return (
    <div className="absolute top-5 left-5 flex gap-4">
      <Select
        value={activeItem.toString()}
        onValueChange={(value) =>
          router.push(`/explore/${value}?${searchParams.toString()}`)
        }
      >
        <SelectTrigger className="w-[280px] capitalize truncate rounded-sm bg-white bg-opacity-5">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {spans.map((span, index) => (
            <SelectItem key={span.id} value={span.id} className="capitalize">
              {span.self.name} - {span.id.split("-").at(-1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tabs defaultValue={activeTab}>
        <TabsList>
          <TabsTrigger value="table" onClick={() => router.push(`?view=table`)}>
            <TableIcon className="mr-2" />
            Tables
          </TabsTrigger>
          <TabsTrigger value="graph" onClick={() => router.push(`?view=graph`)}>
            <MixerVerticalIcon className="mr-2" />
            Graph
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SpanSelector;
