"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  searchProducts,
  type SearchResult,
} from "@/lib/actions/search-actions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedTerm = useDebounce(searchTerm, 300);

  const { data: results = [], isLoading } = useQuery<SearchResult[]>({
    queryKey: ["liveSearch", debouncedTerm],
    queryFn: async () => {
      return await searchProducts(debouncedTerm);
    },
    enabled: debouncedTerm.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearchTerm("");
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="h-12 w-12 text-white hover:text-[#CCFF00] hover:bg-transparent transition-colors"
          >
            <Search className="!h-7 !w-7" />
          </Button>
        }
      />

      <DialogContent
        showCloseButton={false}
        className="
          !fixed !top-0 !left-0 !right-0 !bottom-auto 
          !translate-x-0 !translate-y-0
          w-full max-w-full sm:max-w-full md:max-w-full
          m-0 p-0 rounded-none sm:rounded-none
          border-b border-x-0 border-t-0 border-zinc-800 bg-zinc-950
          duration-300
          
          data-open:animate-in data-closed:animate-out 
          data-closed:fade-out-0 data-open:fade-in-0 
          data-closed:slide-out-to-top-[100%] data-open:slide-in-from-top-[100%]
        "
      >
        <DialogTitle className="sr-only">Search HeavyFuel</DialogTitle>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-full px-4 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto border-b border-zinc-900 gap-3"
        >
          <Search className="h-6 w-6 sm:h-7 sm:w-7 text-[#CCFF00] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="SEARCH GEAR..."
            className="flex-1 w-full text-xl sm:text-2xl font-black tracking-widest uppercase bg-transparent border-0 outline-none focus:ring-0 text-white placeholder:text-zinc-700"
            autoFocus
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-zinc-500 hover:text-[#CCFF00] transition-colors p-2"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
          <div className="pl-3 sm:pl-4 border-l border-zinc-800">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-zinc-500 hover:text-white uppercase font-bold tracking-widest text-xs sm:text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </form>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 min-h-[250px] max-h-[75vh] overflow-y-auto">
          {!debouncedTerm ? (
            <div className="flex items-center justify-center h-32 text-zinc-600 font-bold uppercase tracking-widest text-sm">
              Start typing to search products...
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-32 text-[#CCFF00] font-bold uppercase tracking-widest text-sm animate-pulse">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => setOpen(false)}
                  className="group flex flex-col"
                >
                  <div className="aspect-square bg-zinc-900 rounded-md overflow-hidden relative mb-3 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <span className="text-[#CCFF00] font-black tracking-widest text-sm sm:text-base">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-zinc-400 font-bold uppercase text-xs sm:text-sm truncate mt-1 group-hover:text-white transition-colors">
                    {product.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-zinc-500 font-bold uppercase tracking-widest text-sm">
              No gear found for "{debouncedTerm}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
