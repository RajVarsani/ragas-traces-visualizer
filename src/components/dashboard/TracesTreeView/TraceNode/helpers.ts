import { TraceDetails } from "@/types";
import { getAccuracy } from "../helpers";


export const getBorderClass = (traceData: TraceDetails) => {
    let accentColor = "border-gray-500";
    if (traceData.type === "chain") {
        const accuracy = getAccuracy(traceData);
        return accuracy < 0.5 ? "border-red-500" : accuracy < 0.75 ? "border-yellow-500" : "border-green-500";
    }
    return accentColor;
}

export const getBackgroundColor = (traceData: TraceDetails) => {
    let accentColor = "bg-gray-500";
    if (traceData.type === "chain") {
        const accuracy = getAccuracy(traceData);
        return accuracy < 0.5 ? "bg-red-500" : accuracy < 0.75 ? "bg-yellow-500" : "bg-green-500";
    }
    return accentColor;
}