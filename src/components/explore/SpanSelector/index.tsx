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
import { useParams, useRouter } from "next/navigation";

const SpanSelector = () => {
  const params = useParams();
  const router = useRouter();

  const spanId = params.id as string;
  const viewType = params.view as string;

  const { spans } = useTracesDetails();

  return (
    <div className="absolute top-5 left-0 pl-5 pr-5 w-full">
      <div className="flex gap-4 mx-auto w-full max-w-[82rem] justify-between">
        <Select
          value={spanId.toString()}
          onValueChange={(value) =>
            router.push(`/explore/${value}/${viewType}`)
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

        <Tabs defaultValue={viewType}>
          <TabsList>
            <TabsTrigger value="table" onClick={() => router.replace("table")}>
              <TableIcon className="mr-2" />
              Tables
            </TabsTrigger>
            <TabsTrigger value="graph" onClick={() => router.replace(`graph`)}>
              <MixerVerticalIcon className="mr-2" />
              Graph
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default SpanSelector;
