"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useEffect, useState } from "react";
import {
  buildChildren,
  getAllSubtreeNodes,
  getNodeColor,
  mapTraceToNode,
} from "./helpers";
import TraceNode from "./TraceNode";
import { TRACE_NODE_TYPE } from "./TraceNode/constants";
import { TraceNode as TraceNodeType } from "./TraceNode/types";

const TracesTreeView = () => {
  const { spans, tracesWithRelations } = useTracesDetails();
  const [activeItem, setActiveItem] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState<TraceNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const expandNode = (
    node: TraceNodeType,
    isPreview: boolean = false
  ): {
    nodes: TraceNodeType[];
    edges: Edge[];
  } => {
    const { nodes, edges } = buildChildren(node, {
      handlers: {
        expand: expandNode,
        collapse: collapseNode,
      },
      isExpanded: false,
      isPreview,
      childrenInPreview: false,
    });

    console.log("EX");
    setNodes((nds) => {
      // console.log(nds, nodes);
      console.log(
        JSON.parse(JSON.stringify(nds)),
        JSON.parse(JSON.stringify(nodes))
      );
      nds = JSON.parse(JSON.stringify(nds));
      const updatedData = [
        ...nds.map((item) => {
          console.log("Setting expanded", item.data.data.id, node.id);
          if (item.data.data.id === node.id) {
            console.log("SUCCESS");
            item.data.metadata.isExpanded = true;
            item.data.metadata.childrenInPreview = isPreview;
          }
          return item;
        }),
        ...nodes,
      ].map((item) => {
        item.data.metadata.handlers.expand = expandNode;
        item.data.metadata.handlers.collapse = collapseNode;
        return item;
      });

      // remove duplicate nodes
      // start from the end
      const uniqueNodes = [];
      const lookUp: Record<string, boolean> = {};
      for (let i = updatedData.length - 1; i >= 0; i--) {
        const node = updatedData[i];
        if (!lookUp[node.id]) {
          lookUp[node.id] = true;
          uniqueNodes.push(node);
        }
      }

      // console.log("UNIQUE NODES", uniqueNodes);
      console.log("UNIQUE NODES", JSON.parse(JSON.stringify(uniqueNodes)));
      return uniqueNodes;
    });
    // setEdges((eds) => JSON.parse(JSON.stringify([...eds, ...edges])));
    setEdges((eds) => {
      eds = JSON.parse(JSON.stringify(eds));
      const updatedEdges = [...eds, ...edges];
      console.log(
        "EDGES",
        JSON.parse(JSON.stringify(eds)),
        JSON.parse(JSON.stringify(edges))
      );
      // remove duplicate edges
      // start from the end

      const uniqueEdges = [];
      const lookUp: Record<string, boolean> = {};
      for (let i = updatedEdges.length - 1; i >= 0; i--) {
        const edge = updatedEdges[i];
        if (!lookUp[edge.id]) {
          lookUp[edge.id] = true;
          uniqueEdges.push(edge);
        }
      }

      console.log("UNIQUE EDGES", JSON.parse(JSON.stringify(uniqueEdges)));
      return uniqueEdges;
    });
    return { nodes, edges };
  };

  const collapseNode = (node: TraceNodeType) => {
    const allSubtreeNodes = getAllSubtreeNodes(node.data.data);
    const allSubtreeNodesIds = allSubtreeNodes.map((n) => n.id);

    setNodes((nds) =>
      nds
        .filter((nd) => !allSubtreeNodesIds.includes(nd.id))
        .map((item) => {
          if (item.id === node.id) {
            item.data.metadata.isExpanded = false;
            item.data.metadata.childrenInPreview = false;
          }
          return item;
        })
    );

    setEdges((eds) =>
      eds.filter(
        (ed) =>
          !allSubtreeNodesIds.includes(ed.source) &&
          !allSubtreeNodesIds.includes(ed.target)
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
    mountSpan(spans[activeItem]);
  }, [activeItem]);

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
      <div className="absolute top-5 left-5">
        <Select
          value={activeItem.toString()}
          onValueChange={(value) => setActiveItem(parseInt(value))}
        >
          <SelectTrigger className="w-[280px] capitalize truncate rounded-sm bg-white bg-opacity-5">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {spans.map((span, index) => (
              <SelectItem
                key={span.id}
                value={index.toString()}
                className="capitalize"
              >
                {span.self.name} - {span.id.split("-").at(-1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default TracesTreeView;
