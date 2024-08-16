"use client";

import { useTracesDetails } from "@/hooks/traces.hooks";
import { TraceDetails } from "@/types";
import {
  Background,
  Controls,
  Edge,
  MiniMap,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import {
  buildChildrenNodes,
  getSubtreeChildren,
  getNodeColor,
  mapTraceToNode,
} from "./helpers";
import TraceNode from "./TraceNode";
import { TRACE_NODE_TYPE } from "./TraceNode/constants";
import { TraceNode as TraceNodeType } from "./TraceNode/types";

const TracesTreeView = () => {
  const params = useParams();
  const { spans } = useTracesDetails();

  const spanId = params.id as string;

  const [nodes, setNodes, onNodesChange] = useNodesState<TraceNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const expandNode = (
    node: TraceNodeType,
    isPreview: boolean = false
  ): {
    nodes: TraceNodeType[];
    edges: Edge[];
  } => {
    const { nodes: newNodes, edges: newEdges } = buildChildrenNodes(node, {
      handlers: {
        expand: expandNode,
        collapse: collapseNode,
      },
      isExpanded: false,
      isPreview,
      childrenInPreview: false,
    });

    setNodes((prevNodes) => {
      prevNodes = JSON.parse(JSON.stringify(prevNodes));

      const updatedData = [
        ...prevNodes.map((item) => {
          if (item.data.data.id === node.id) {
            item.data.metadata.isExpanded = true;
            item.data.metadata.childrenInPreview = isPreview;
          }
          return item;
        }),
        ...newNodes,
      ].map((item) => {
        item.data.metadata.handlers.expand = expandNode;
        item.data.metadata.handlers.collapse = collapseNode;

        return item;
      });

      const uniqueNodes = [];
      const traceExistsMap: Record<string, boolean> = {};

      for (let i = updatedData.length - 1; i >= 0; i--) {
        const node = updatedData[i];

        if (!traceExistsMap[node.id]) {
          traceExistsMap[node.id] = true;
          uniqueNodes.push(node);
        }
      }

      return uniqueNodes;
    });

    setEdges((prevEdges) => {
      prevEdges = JSON.parse(JSON.stringify(prevEdges));
      const updatedEdges = [...prevEdges, ...newEdges];

      const uniqueEdges = [];
      const lookUp: Record<string, boolean> = {};
      for (let i = updatedEdges.length - 1; i >= 0; i--) {
        const edge = updatedEdges[i];
        if (!lookUp[edge.id]) {
          lookUp[edge.id] = true;
          uniqueEdges.push(edge);
        }
      }

      return uniqueEdges;
    });

    return { nodes: newNodes, edges: newEdges };
  };

  const collapseNode = (node: TraceNodeType) => {
    const allSubtreeNodes = getSubtreeChildren(node.data.data);
    const allSubtreeNodesIds = allSubtreeNodes.map((n) => n.id);

    setNodes((prevNodes) =>
      prevNodes
        .filter((item) => !allSubtreeNodesIds.includes(item.id))
        .map((item) => {
          if (item.id === node.id) {
            item.data.metadata.isExpanded = false;
            item.data.metadata.childrenInPreview = false;
          }

          return item;
        })
    );

    setEdges((prevEdges) =>
      prevEdges.filter(
        (item) =>
          !allSubtreeNodesIds.includes(item.source) &&
          !allSubtreeNodesIds.includes(item.target)
      )
    );
  };

  const mountSpan = (root: TraceDetails) => {
    const rootNode = mapTraceToNode(
      root,
      {
        horizontal: {
          parentPosition: 0,
          currentIndex: 0,
          totalChildren: 0,
        },
        vertical: {
          parentPosition: 0,
        },
      },
      {
        handlers: {
          expand: expandNode,
          collapse: collapseNode,
        },
        isExpanded: false,
        isPreview: false,
        childrenInPreview: false,
      }
    );

    setNodes([rootNode]);
    setEdges([]);

    setTimeout(() => {
      expandNode(rootNode);
    }, 0);
  };

  useEffect(() => {
    const span = spans.find((span) => span.id === spanId);
    if (span) {
      mountSpan(span);
    }
  }, [spanId]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        colorMode="dark"
        selectionOnDrag
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{ [TRACE_NODE_TYPE]: TraceNode }}
        panOnScroll
        fitView
        selectionMode={SelectionMode.Partial}
        maxZoom={1.3}
        minZoom={0.1}
      >
        <MiniMap
          position="bottom-left"
          pannable
          zoomable
          nodeColor={getNodeColor}
        />
        <Background />
        <Controls showZoom position="bottom-right" />
      </ReactFlow>
    </>
  );
};

export default TracesTreeView;
