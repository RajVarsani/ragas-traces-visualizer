import { TraceDetails } from "@/types";
import type { Node, NodeProps } from "@xyflow/react";
import { TRACE_NODE_TYPE } from "./constants";

export type TraceNodeMetadata = {
    handlers: {
        expand: (node: TraceNode, isPreview: boolean) => void;
        collapse: (node: TraceNode) => void;
    },
    isExpanded: boolean;
    isPreview: boolean;
    childrenInPreview: boolean;
}

export type TraceNodeParams = {
    data: TraceDetails;
    metadata: TraceNodeMetadata
}

export type TraceNode = Node<TraceNodeParams, typeof TRACE_NODE_TYPE>;
export type Props = NodeProps<TraceNode>;