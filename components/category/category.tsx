"use client";

import { useRef, useState } from "react";
import CategoryCard from "./category-card";
import { CATEGORY_DATA } from "@/lib/project-utils";

export default function Category() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = Array.from(container.children);

    if (!cards.length) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const element = card as HTMLElement;
      const cardCenter = element.offsetLeft + element.offsetWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.children[index] as HTMLElement | undefined;

    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section className="w-full bg-[#0B0D10] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 px-4 sm:mb-8 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Shop by Category
          </h2>
        </div>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="
            flex w-full gap-3 overflow-x-auto
            snap-x snap-mandatory scroll-smooth
            px-4 pb-1
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden

            sm:gap-5 sm:px-6

            md:grid md:grid-cols-3 md:gap-6
            md:overflow-visible md:snap-none
            lg:px-8
          "
        >
          {CATEGORY_DATA.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 md:hidden">
          {CATEGORY_DATA.map((category, index) => (
            <button
              key={category.name}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`View ${category.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-6 bg-[#CCFF00]" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
