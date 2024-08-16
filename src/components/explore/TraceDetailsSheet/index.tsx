"use client";
import useTraceSheetStore from "@/store/traceSheet";

import { fontMono } from "@/app/fonts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getAccuracy } from "@/lib/utils";
import { CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import CodeBlock from "./CodeBlock";
import { getMarkdownFromInputJSON } from "./helpers";

const INPUT_FORMATS = ["JSON", "Markdown"] as const;

const TraceDetailsSheet = () => {
  const { activeTrace, isOpen, closeTrace } = useTraceSheetStore();
  const [inputFormat, setInputFormat] = useState<
    (typeof INPUT_FORMATS)[number]
  >(INPUT_FORMATS[0]);

  const isChain = activeTrace?.type === "chain";

  const copyToClipboard = () => {
    if (activeTrace) {
      navigator.clipboard.writeText(activeTrace.id);
    }
  };

  return (
    <Sheet open={isOpen && activeTrace !== null} onOpenChange={closeTrace}>
      <SheetContent
        style={{
          maxWidth: 600,
          overflowY: "auto",
          padding: "1.25rem",
          paddingTop: "1.5rem",
        }}
      >
        {activeTrace ? (
          <SheetHeader>
            <SheetTitle className="capitalize flex items-center gap-4">
              {activeTrace?.self.name}
              <div>
                <Badge
                  variant="default"
                  className="text-xs font-medium capitalize bg-yellow-400 bg-opacity-20 text-yellow-400"
                >
                  {activeTrace.type}
                </Badge>
              </div>
            </SheetTitle>
            <SheetDescription>
              <Button
                variant="ghost"
                className={cn(
                  "px-0 py-1 h-fit text-slate-400 uppercase",
                  fontMono.className
                )}
                size="sm"
                onClick={copyToClipboard}
              >
                <div className="flex flex-row items-center gap-2">
                  <span className="font-light">
                    {activeTrace.id.split("-").at(-1)}
                  </span>
                  <CopyIcon className="w-3 h-3" />
                </div>
              </Button>
            </SheetDescription>

            <div className="flex flex-col pt-4 gap-8">
              {isChain ? (
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-row justify-between gap-2 text-sm">
                    <span className="font-light text-slate-300">
                      Faithfulness
                    </span>
                    <span className="font-medium text-slate-200">
                      {getAccuracy(activeTrace).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between gap-2 text-sm">
                    <span className="font-light text-slate-300">Children</span>
                    <span className="font-medium text-slate-200">
                      {activeTrace.children.length}
                    </span>
                  </div>
                </div>
              ) : null}

              {isChain ? (
                <Tabs
                  defaultValue={
                    Object.keys(activeTrace.inputs).length > 0
                      ? "input"
                      : "output"
                  }
                >
                  <TabsList className="mb-2">
                    {Object.keys(activeTrace.inputs).length > 0 && (
                      <TabsTrigger value="input">Input</TabsTrigger>
                    )}
                    <TabsTrigger value="output">Output</TabsTrigger>
                  </TabsList>
                  <TabsContent value="input" className="flex flex-col gap-3">
                    <Select
                      value={inputFormat}
                      onValueChange={(value) => setInputFormat(value as any)}
                    >
                      <SelectTrigger className="w-[140px] capitalize truncate bg-white bg-opacity-5 border-none">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {INPUT_FORMATS.map((theme) => (
                          <SelectItem
                            key={theme}
                            value={theme}
                            className="capitalize"
                          >
                            {theme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {inputFormat === INPUT_FORMATS[0] ? (
                      <CodeBlock
                        code={JSON.stringify(activeTrace.inputs, null, 2)}
                        language="json"
                      />
                    ) : (
                      <CodeBlock
                        code={getMarkdownFromInputJSON(activeTrace.inputs)}
                        language="markdown"
                      />
                    )}
                  </TabsContent>
                  <TabsContent value="output">
                    <CodeBlock
                      code={JSON.stringify(activeTrace.outputs, null, 2)}
                      language="json"
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <Tabs defaultValue="input">
                  <TabsList className="mb-2">
                    <TabsTrigger value="input">Input</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                    <TabsTrigger value="config">Configurations</TabsTrigger>
                  </TabsList>
                  <TabsContent value="input">
                    <CodeBlock code={activeTrace.inputs} language="markdown" />
                  </TabsContent>
                  <TabsContent value="output">
                    <CodeBlock code={activeTrace.outputs} language="markdown" />
                  </TabsContent>
                  <TabsContent value="config">
                    <CodeBlock
                      code={JSON.stringify(activeTrace.self, null, 2)}
                      language="json"
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </SheetHeader>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default TraceDetailsSheet;
