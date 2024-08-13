import TEMP_DATA_MAP from "@/lib/data.json";
import { TraceDetails } from "@/types";
import { TraceMap } from "@/types/dto";


export const useTracesDetails = () => {
    const responseDataMap = TEMP_DATA_MAP as TraceMap;

    const tracesWithRelations = {} as Record<string, TraceDetails>;
    const spans = [] as TraceDetails[];

    Object.entries(responseDataMap).forEach(([key, value]) => {
        const nodeData = {
            id: key,
            ...value,
            children: []
        } as TraceDetails

        tracesWithRelations[key] = nodeData;
        if (nodeData.parent_run_id === "None" || null) {
            spans.push(nodeData);
        } else {
            tracesWithRelations[nodeData.parent_run_id].children.push(nodeData);
        }
    });

    return {
        spans,
        tracesWithRelations
    }
}