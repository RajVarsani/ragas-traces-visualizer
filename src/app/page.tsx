import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fontMono } from "./fonts";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div
        className={cn(
          "z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex",
          fontMono.className
        )}
      >
        <Button variant="outline">Learn More</Button>
        <p>Hello</p>
      </div>
    </main>
  );
}
