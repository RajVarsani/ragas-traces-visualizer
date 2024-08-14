import { getAccuracy } from "@/lib/utils"
import { TraceDetails } from "@/types"
import { Edge } from "@xyflow/react"
import { TRACE_NODE_TYPE } from "./TraceNode/constants"
import { TraceNode, TraceNodeMetadata } from "./TraceNode/types"


export const getAllSubtreeNodes = (trace: TraceDetails): TraceDetails[] => {
    return trace.children.reduce((acc, child) => {
        return [...acc, child, ...getAllSubtreeNodes(child)]
    }, [] as TraceDetails[])
}

export const mapTraceToNode = (
    trace: TraceDetails,
    position: {
        horizontal: {
            parentPosition: number,
            currentIndex: number,
            totalChildren: number
        },
        vertical: {
            parentPosition: number,
        }
    },
    meta: TraceNodeMetadata
): TraceNode => {
    // const possibleHorizontalSpan = countChildren(trace) || 1; // for expaning complete tree
    const possibleHorizontalSpan = 1;

    return {
        id: trace.id,
        type: TRACE_NODE_TYPE,
        data: { data: trace, metadata: meta },
        position: {
            y: position.vertical.parentPosition + 300,
            x: position.horizontal.parentPosition + (position.horizontal.currentIndex - (position.horizontal.totalChildren + 1) / 2) * 300 * possibleHorizontalSpan
        },
        deletable: false,
    } as TraceNode
}

export const buildChildren = (node: TraceNode, meta: TraceNodeMetadata) => {
    const nodes: TraceNode[] = node.data.data.children.map((child, index) => {
        return mapTraceToNode(child, {
            vertical: {
                parentPosition: node.position.y
            },
            horizontal: {
                parentPosition: node.position.x,
                currentIndex: index + 1,
                totalChildren: node.data.data.children.length
            }
        }, meta)
    })

    const edges = nodes.map((child) => {
        return {
            id: `${node.id}---${child.id}`,
            source: node.id,
            target: child.id,
            sourceHandle: "source-bottom",
            targetHandle: "target-top"
        } as Edge
    })

    return { nodes, edges }
}



export const getNodeColor = (trace: TraceNode): string => {
    if (trace.data.data.type === "chain") {
        const accuracy = getAccuracy(trace.data.data);
        return accuracy < 0.5 ? "#B81D13" : accuracy < 0.75 ? "#EFB700" : "#008450";
    }
    return "gray";
}