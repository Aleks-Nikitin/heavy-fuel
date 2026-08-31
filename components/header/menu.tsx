"use client";
import useState from "react";
export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
        <a href="/shop" className="text-lg font-semibold text-gray-800 hover:text-gray-600">
            Shop   
        </a>
        <a href="/supplements" className="text-lg font-semibold text-gray-800 hover:text-gray-600">
            Supplements
        </a>
        <a href="/gear" className="text-lg font-semibold text-gray-800 hover:text-gray-600">
            Gear
        </a>
        <a href="/apparel" className="text-lg font-semibold text-gray-800 hover:text-gray-600">
            Apparel
        </a>
    </div>
  );
}