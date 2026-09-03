import Image from "next/image";
import proteinTub from "@/public/protein-tub.jpg";
export default function CategoryCard({
  name,
  image,
  link,
}: {
  name: string;
  image: string;
  link: string;
}) {
  return (
    <div className=" w-[32vw] h-[50vh] flex flex-col items-center justify-center ">
      <div className="flex-1 relative w-full ">
        <Image
          src={proteinTub}
          alt={name}
          fill
          className="size-64 object-contain"
        ></Image>
      </div>
      <div className="text">
        <span> {name}</span>
      </div>
    </div>
  );
}
