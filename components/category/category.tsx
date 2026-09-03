"use client";

import { useState, useRef } from "react";
import CategoryCard from "./category-card";
import { CATEGORY_DATA } from "@/lib/project-utils";

export default function Category() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / (clientWidth * 0.8));
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollTo({
      left: containerWidth * index,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full space-y-6 py-8 bg-[#0B0D10]">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth md:justify-center md:items-center md:gap-8 md:px-8 md:max-w-6xl md:mx-auto md:overflow-visible md:snap-none"
      >
        {CATEGORY_DATA.map((category) => (
          <CategoryCard key={category.name} {...category} />
        ))}
      </div>
      <div className="flex md:hidden justify-center items-center gap-2">
        {CATEGORY_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-8 bg-[#CCFF00]"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
