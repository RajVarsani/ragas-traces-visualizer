import { Switch } from "@/components/ui/switch";
import { useTracesDetails } from "@/hooks/traces.hooks";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useState } from "react";
import TraceRow from "./TraceRow";

const COLUMNS = [
  "Trace ID",
  "Question / Inputs",
  "Answers / Outputs",
  "Ground Truth",
  "Faithfulness",
];

const TracesTableView = () => {
  const params = useParams();
  const { tracesWithRelations } = useTracesDetails();

  const spanId = params.id as string;
  const [relationsActive, setRelationsActive] = useState(false);

  return (
    <div className="flex flex-col gap-6 mx-auto items-center p-4">
      <div className="flex items-center gap-3 justify-between w-full max-w-7xl">
        <h2 className="text-xl font-semibold text-slate-100">Traces</h2>
        <div className="flex items-center gap-3">
          <Switch
            checked={relationsActive}
            onCheckedChange={setRelationsActive}
            id="connection-mode"
          />
          <label
            htmlFor="connection-mode"
            className="text-slate-300 font-light cursor-pointer"
          >
            Relations
          </label>
        </div>
      </div>

      <div className="flex flex-col w-fit outline outline-neutral-800 rounded-lg p-4">
        <div
          className="grid px-4 my-2"
          style={{
            gridTemplateColumns: "13rem 1fr 1fr 1fr 5rem",
          }}
        >
          {COLUMNS.map((column, index) => (
            <span
              key={column}
              className={cn(
                "font-normal text-neutral-400 text-sm text-center",
                {
                  "text-start": index === 0,
                  "text-end": index === COLUMNS.length - 1,
                }
              )}
            >
              {column}
            </span>
          ))}
        </div>

        <TraceRow
          data={tracesWithRelations[spanId]}
          depth={0}
          relationsActive={relationsActive}
        />
      </div>
    </div>
  );
};

export default TracesTableView;
