export const CATEGORY_DATA = [
  {
    name: "Supplements",
    image: "/images/supplements.jpg",
    link: "/shop/supplements",
  },
  { name: "Gear", image: "/images/gear.jpg", link: "/shop/gear" },
  { name: "Apparel", image: "/images/apparel.jpg", link: "/shop/apparel" },
] as const;
export type Product = {
  id: number;
  name: string;
  image: string;
  link: string;
  price: number;
  options: {
    size: string[];
    additionalSizePrice: number[];
    variant: string[];
  };
  rating: number;
  reviews: number;
  category: string;
  description: string;
};
