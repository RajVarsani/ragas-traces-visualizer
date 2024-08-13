import { fontMono } from "@/app/fonts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getAccuracy } from "@/lib/utils";
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
import useTraceSheetStore from "@/store/traceSheet";

const TraceNode = (nodeDetails: Props) => {
  const { openTrace } = useTraceSheetStore();
  const traceData = nodeDetails.data.data;
  const meta = nodeDetails.data.metadata;
  const handlers = meta.handlers;

  const id = traceData.id;
  const partialId = id.split("-").at(-1);

  const accentColor = getBorderClass(traceData);
  const backgroundColor = getBackgroundColor(traceData);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
  };

  const isChain = traceData.type === "chain";
  const isExpanded = meta.isExpanded;
  const isPreview = meta.isPreview;
  const isExpandedInPreview = meta.childrenInPreview;

  const node = {
    id: traceData.id,
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
          accentColor,
          backgroundColor,
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
              {traceData.self.name}
            </h3>
            <Badge
              variant="default"
              className={cn(
                "text-xs font-medium capitalize bg-yellow-400 bg-opacity-20 text-yellow-400"
              )}
              // className={cn("text-xs font-medium capitalize")}
            >
              {traceData.type}
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
                {getAccuracy(traceData).toFixed(4)}
              </span>
            </div>
            <div className="flex flex-row justify-between gap-2 text-sm">
              <span className="font-light text-slate-300">Children</span>
              <span className="font-medium text-slate-200">
                {traceData.children.length}
              </span>
            </div>
          </div>
        ) : null}
        <div className="flex gap-2 items-center">
          <Button
            variant="default"
            className="px-4 text-xs font-medium capitalize"
            // className="text-xs font-medium text-yellow-400 capitalize bg-yellow-400 bg-opacity-20"
            size="sm"
            onClick={() => openTrace(traceData)}
          >
            Details
            <ExternalLinkIcon className="w-3 h-3 ml-2" />
          </Button>
          {isChain && traceData.children.length > 0 ? (
            <Button
              variant="link"
              className="text-xs font-normal capitalize"
              size="sm"
              onClick={() => {
                console.log("CALLED CLICK", isExpanded, !isExpandedInPreview);
                isExpanded && !isExpandedInPreview
                  ? handlers.collapse(node)
                  : handlers.expand(node, false);
              }}
              onMouseOver={() => {
                console.log("HOVER STARTED");
                !isExpanded && handlers.expand(node, true);
              }}
              onMouseOut={() => {
                console.log("HOVER ENDED");
                console.log(meta.childrenInPreview);
                meta.childrenInPreview && handlers.collapse(node);
              }}
            >
              {isExpanded && !isExpandedInPreview ? (
                <>
                  Collapse
                  <DoubleArrowUpIcon className="w-3 h-3 ml-2" />
                </>
              ) : (
                <>
                  Expand
                  <DoubleArrowDownIcon className="w-3 h-3 ml-2" />
                </>
              )}
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
