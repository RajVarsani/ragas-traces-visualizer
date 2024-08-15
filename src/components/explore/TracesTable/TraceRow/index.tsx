import { fontMono } from "@/app/fonts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getAccuracy } from "@/lib/utils";
import useTraceSheetStore from "@/store/traceSheet";
import { CopyIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { getBackgroundColor, getBorderClass } from "./helpers";
import { Props } from "./types";

const TraceRow = ({ data, depth }: Props) => {
  const { openTrace } = useTraceSheetStore();

  const partialId = data.id.split("-").at(-1);
  const isChain = data.type === "chain";

  const accentColor = getBorderClass(data);
  const backgroundColor = getBackgroundColor(data);

  if (!isChain) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, translateY: 10 + depth * 5 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.2 + depth * 0.04 }}
      >
        <div
          className={cn(
            "px-4 min-w-52 flex flex-col py-4 border border-opacity-60 rounded-2xl bg-opacity-5 gap-5 transition-all ease-out",
            accentColor,
            backgroundColor
          )}
        >
          <div className="flex flex-col">
            <div className="flex justify-between gap-5">
              <h3 className="font-semibold capitalize text-slate-100">
                {data.self.name}
              </h3>
              <Badge
                variant="default"
                className={cn(
                  "text-xs font-medium capitalize bg-yellow-400 bg-opacity-20 text-yellow-400"
                )}
                // className={cn("text-xs font-medium capitalize")}
              >
                {data.type}
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

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-row justify-between gap-2 text-sm">
              <span className="font-light text-slate-300">Faithfulness</span>
              <span className="font-medium text-slate-200">
                {getAccuracy(data).toFixed(4)}
              </span>
            </div>
            <div className="flex flex-row justify-between gap-2 text-sm">
              <span className="font-light text-slate-300">Children</span>
              <span className="font-medium text-slate-200">
                {data.children.length}
              </span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant="default"
              className="px-4 text-xs font-medium capitalize"
              size="sm"
              onClick={() => openTrace(data)}
            >
              Details
              <ExternalLinkIcon className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
      {data.children.map((child) => (
        <TraceRow key={child.id} data={child} depth={depth + 1} />
      ))}
    </>
  );
};

export default TraceRow;
