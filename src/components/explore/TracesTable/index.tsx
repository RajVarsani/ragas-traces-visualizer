import { useTracesDetails } from "@/hooks/traces.hooks";
import { useParams } from "next/navigation";
import TraceRow from "./TraceRow";

const TracesTableView = () => {
  const params = useParams();
  const spanId = params.id as string;

  const { tracesWithRelations } = useTracesDetails();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-slate-100">Traces</h2>
      <div className="flex flex-col gap-3">
        <TraceRow data={tracesWithRelations[spanId]} depth={0} />
      </div>
    </div>
  );
};

export default TracesTableView;
