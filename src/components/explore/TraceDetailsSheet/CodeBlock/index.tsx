import { fontMono } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CopyIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 5 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "relative",
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={codeTheme}
        wrapLines
        wrapLongLines
        customStyle={{
          fontSize: 8,
          fontFamily: fontMono.variable,
          borderRadius: "1rem",
          padding: "1rem",
          margin: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
      <Button
        variant="ghost"
        className={cn(
          "px-0 py-2 h-fit text-slate-400 uppercase absolute top-2 right-2 bg-white bg-opacity-5",
          fontMono.className
        )}
        size="icon"
        onClick={() => navigator.clipboard.writeText(code)}
      >
        <div className="flex flex-row items-center gap-2">
          <CopyIcon className="w-4 h-4" />
        </div>
      </Button>
    </motion.div>
  );
};

export default CodeBlock;
