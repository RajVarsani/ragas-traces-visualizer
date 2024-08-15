"use client";

import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  const router = useRouter();
  const [query, setQuery] = useState(searchQuery || "");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`?q=${query}`);
  };

  return (
    <div className="w-full border-b bg-neutral-950">
      <div className="max-w-screen-lg mx-auto py-4 flex justify-between items-center px-5">
        <Link href="/">
          <h1 className="text-xl font-medium text-slate-100">Ragas</h1>
        </Link>
        <form
          className="bg-white bg-opacity-5 ease-out pr-3 flex items-center justify-between w-full max-w-96 rounded-full outline outline-neutral-800 focus-within:bg-white  focus-within:bg-opacity-10  focus-within:outline-yellow-500 transition-all"
          onSubmit={handleSearch}
        >
          <input
            placeholder="Search for a span"
            className="!w-full !py-2 !px-4 h-fit ml-4"
            style={{
              all: "unset",
            }}
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <Button
            type="submit"
            variant="ghost"
            className="py-1 px-2 h-fit w-fit"
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-100" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Header;
