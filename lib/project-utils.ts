export const CATEGORY_DATA = [
  {
    name: "Supplements",
    image: "/images/supplements.jpg",
    link: "/shop/supplements",
  },
  { name: "Gear", image: "/images/gear.jpg", link: "/shop/gear" },
  { name: "Apparel", image: "/images/apparel.jpg", link: "/shop/apparel" },
] as const;
export const PRODUCT_DATA: Product[] = [
  {
    id: 1,
    name: "Whey Protein",
    image: "/protein-tub.jpg",
    link: "/shop/supplements/whey-protein",
    price: 29.99,
    category: "Supplements",
    variant: "Chocolate",
    rating: 4.5,
    reviews: 120,
    description: "High-quality whey protein for muscle growth and recovery.",
  },
  {
    id: 2,
    name: "Creatine Monohydrate",
    image: "/protein-tub.jpg",
    link: "/shop/supplements/creatine-monohydrate",
    price: 19.99,
    category: "Supplements",
    variant: "Unflavored",
    rating: 4.7,
    reviews: 85,
    description:
      "Pure creatine monohydrate to enhance strength and power output.",
  },
  {
    id: 3,
    name: "Pre-Workout Formula",
    image: "/protein-tub.jpg",
    link: "/shop/supplements/pre-workout-formula",
    price: 34.99,
    category: "Supplements",
    variant: "Fruit Punch",
    rating: 4.3,
    reviews: 60,
    description: "Energizing pre-workout formula to boost focus and endurance.",
  },
  {
    id: 4,
    name: "Resistance Bands",
    image: "/protein-tub.jpg",
    link: "/shop/gear/resistance-bands",
    price: 14.99,
    category: "Gear",
    variant: "Set of 5",
    rating: 4.6,
    reviews: 45,
    description:
      "Durable resistance bands for strength training and rehabilitation.",
  },
  {
    id: 5,
    name: "Weightlifting Gloves",
    image: "/protein-tub.jpg",
    link: "/shop/gear/weightlifting-gloves",
    price: 24.99,
    category: "Gear",
    variant: "Black",
    rating: 4.4,
    reviews: 30,
    description:
      "Comfortable weightlifting gloves to protect your hands during lifts.",
  },
  {
    id: 6,
    name: "Compression Shirt",
    image: "/protein-tub.jpg",
    link: "/shop/apparel/compression-shirt",
    price: 39.99,
    category: "Apparel",
    variant: "Black/Red",
    rating: 4.5,
    reviews: 50,
    description:
      "High-performance compression shirt for improved blood flow and support.",
  },
  {
    id: 7,
    name: "Athletic Shorts",
    image: "/protein-tub.jpg",
    link: "/shop/apparel/athletic-shorts",
    price: 29.99,
    category: "Apparel",
    variant: "Navy Blue",
    rating: 4.2,
    reviews: 40,
    description:
      "Lightweight and breathable athletic shorts for optimal comfort during workouts.",
  },
] as const;
export type Product = {
  id: number;
  name: string;
  image: string;
  link: string;
  price: number;
  variant: string;
  rating: number;
  reviews: number;
  category: string;
  description: string;
};
