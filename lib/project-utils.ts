export const CATEGORY_DATA = [
  {
    name: "Supplements",
    image: "/supplements.jpg",
    link: "/shop/supplements",
  },
  { name: "Gear", image: "/gear.jpg", link: "/shop/gear" },
  { name: "Apparel", image: "/apparel.jpg", link: "/shop/apparel" },
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
