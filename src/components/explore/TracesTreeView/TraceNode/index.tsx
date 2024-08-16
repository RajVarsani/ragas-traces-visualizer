import { fontMono } from "@/app/fonts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getAccuracy } from "@/lib/utils";
import useTraceSheetStore from "@/store/traceSheet";
import {
  CopyIcon,
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { getBackgroundColor, getBorderClass } from "./helpers";
import { Props } from "./types";

const TraceNode = (nodeDetails: Props) => {
  const { openTrace } = useTraceSheetStore();

  const traceDetails = nodeDetails.data.data;
  const isChain = traceDetails.type === "chain";
  const id = traceDetails.id;
  const partialId = id.split("-").at(-1);

  const meta = nodeDetails.data.metadata;
  const handlers = meta.handlers;
  const isExpanded = meta.isExpanded;
  const isPreview = meta.isPreview;
  const isExpandedInPreview = meta.childrenInPreview;

  const borderClass = getBorderClass(traceDetails);
  const backgroundClass = getBackgroundColor(traceDetails);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
  };

  const nodeData = {
    id: traceDetails.id,
    data: nodeDetails.data,
    position: {
      x: nodeDetails.positionAbsoluteX,
      y: nodeDetails.positionAbsoluteY,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          "px-4 min-w-52 flex flex-col py-4 border border-opacity-60 rounded-2xl bg-opacity-5 gap-5 transition-all ease-out",
          borderClass,
          backgroundClass,
          {
            "opacity-40 scale-95": isPreview,
          }
        )}
      >
        <Handle
          id="target-top"
          type="target"
          position={Position.Top}
          isConnectable={false}
        />

        <div className="flex flex-col">
          <div className="flex justify-between gap-5">
            <h3 className="font-semibold capitalize text-slate-100">
              {traceDetails.self.name}
            </h3>
            <Badge
              variant="default"
              className="text-xs font-medium capitalize bg-yellow-400 bg-opacity-20 text-yellow-400"
            >
              {traceDetails.type}
            </Badge>
          </div>
          <div>
            <Button
              variant="ghost"
              className={cn(
                "px-0 py-0 text-slate-400 uppercase",
                fontMono.className
              )}
              size="sm"
              onClick={copyToClipboard}
            >
              <div className="flex flex-row items-center gap-2">
                <span className="font-light">{partialId}</span>
                <CopyIcon className="w-3 h-3" />
              </div>
            </Button>
          </div>
        </div>

        {isChain ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-row justify-between gap-2 text-sm">
              <span className="font-light text-slate-300">Faithfulness</span>
              <span className="font-medium text-slate-200">
                {getAccuracy(traceDetails).toFixed(4)}
              </span>
            </div>
            <div className="flex flex-row justify-between gap-2 text-sm">
              <span className="font-light text-slate-300">Children</span>
              <span className="font-medium text-slate-200">
                {traceDetails.children.length}
              </span>
            </div>
          </div>
        ) : null}

        <div className="flex gap-2 items-center">
          <Button
            variant="default"
            className="px-4 text-xs font-medium capitalize"
            size="sm"
            onClick={() => openTrace(traceDetails)}
          >
            Details
            <ExternalLinkIcon className="w-3 h-3 ml-2" />
          </Button>

          {isChain && traceDetails.children.length > 0 ? (
            <Button
              variant="link"
              className="text-xs font-normal capitalize"
              size="sm"
              onClick={() => {
                isExpanded && !isExpandedInPreview
                  ? handlers.collapse(nodeData)
                  : handlers.expand(nodeData, false);
              }}
              onMouseOver={() => {
                !isExpanded && handlers.expand(nodeData, true);
              }}
              onMouseOut={() => {
                meta.childrenInPreview && handlers.collapse(nodeData);
              }}
            >
              {isExpanded && !isExpandedInPreview ? "Collapse" : "Expand"}
              <DoubleArrowUpIcon
                className={cn(
                  "w-3 h-3 ml-2 -scale-y-100 transition-transform",
                  {
                    "scale-y-100": isExpanded && !isExpandedInPreview,
                  }
                )}
              />
            </Button>
          ) : null}
        </div>

        <Handle
          id="source-bottom"
          type="source"
          position={Position.Bottom}
          isConnectable={false}
        />
      </div>
    </motion.div>
  );
};

export default TraceNode;
