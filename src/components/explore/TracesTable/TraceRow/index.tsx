import { fontMono } from "@/app/fonts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getAccuracy } from "@/lib/utils";
import useTraceSheetStore from "@/store/traceSheet";
import { CopyIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { getBackgroundColor, getBorderClass } from "./helpers";
import { Props } from "./types";

const TraceRow = ({ data, depth, relationsActive }: Props) => {
  const { openTrace } = useTraceSheetStore();

  const partialId = data.id.split("-").at(-1);
  const isChain = data.type === "chain";

  const borderClass = getBorderClass(data);
  const backgroundClass = getBackgroundColor(data);

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(data.id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.2 + depth * 0.04 }}
        className="flex items-center max-w-7xl"
      >
        {/* Tree Paths */}
        {new Array(depth).fill(null).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-6 h-[6.25rem] my-auto transition-[width] overflow-hidden",
              {
                "w-0": !relationsActive,
              }
            )}
          >
            <div
              className={cn(
                "h-full w-[1px] bg-slate-300 mr-auto ml-1 bg-opacity-0",
                {
                  "bg-opacity-10": relationsActive,
                }
              )}
            />
          </div>
        ))}

        {/* Current Node Data */}
        <div
          className={cn(
            "my-1.5 px-4 min-w-52 h-fit grid py-4 border border-opacity-60 rounded-2xl bg-opacity-5 transition-all ease-out cursor-pointer w-full",
            borderClass,
            backgroundClass
          )}
          style={{
            gridTemplateColumns: "13rem 1fr 1fr 1fr 5rem",
          }}
          onClick={() => openTrace(data)}
        >
          <div className="flex flex-col my-auto">
            <div className="flex gap-3">
              <h3 className="font-semibold capitalize text-slate-100">
                {data.self.name}
              </h3>
              <Badge
                variant="default"
                className="text-xs font-medium capitalize bg-yellow-400 bg-opacity-20 text-yellow-400"
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

          {isChain ? (
            (
              [
                "question",
                "answer",
                "ground_truth",
              ] as (keyof typeof data.inputs)[]
            ).map((key) => (
              <span
                key={key}
                className={cn(
                  "font-normal text-neutral-300 text-sm line-clamp-2 px-2 h-fit my-auto",
                  {
                    "mx-auto": !data.inputs[key],
                  }
                )}
              >
                {data.inputs[key] || "N/A"}
              </span>
            ))
          ) : (
            <>
              <span
                className={cn(
                  "font-normal text-neutral-300 text-sm line-clamp-2 px-2 h-fit my-auto",
                  {
                    "mx-auto": !data.inputs,
                  }
                )}
              >
                {data.inputs || "N/A"}
              </span>
              <span
                className={cn(
                  "font-normal text-neutral-300 text-sm line-clamp-2 px-2 h-fit my-auto",
                  {
                    "mx-auto": !data.outputs,
                  }
                )}
              >
                {data.outputs || "N/A"}
              </span>
              <span
                className={cn(
                  "font-normal text-neutral-300 text-sm line-clamp-2 px-2 h-fit m-auto"
                )}
              >
                N/A
              </span>
            </>
          )}

          <span className="font-light text-slate-200 text-sm my-auto text-right">
            {isChain ? getAccuracy(data).toFixed(4) : "N/A"}
          </span>
        </div>
      </motion.div>

      {/* Sub Tree Nodes */}
      {data.children.map((child) => (
        <TraceRow
          key={child.id}
          data={child}
          depth={depth + 1}
          relationsActive={relationsActive}
        />
      ))}
    </>
  );
};

export default TraceRow;
