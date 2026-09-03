import CategoryCard from "./category-card";
import { CATEGORY_DATA } from "@/lib/project-utils";
export default function Category() {
  return (
    <div className="relative w-screen flex  overflow-x-scroll border border-white/10 bg-[#0B0D10]">
      {CATEGORY_DATA.map((category) => (
        <CategoryCard key={category.name} {...category} />
      ))}
    </div>
  );
}
