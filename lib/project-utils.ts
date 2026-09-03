export const CATEGORY_DATA = [
  {
    name: "Supplements",
    image: "/images/supplements.jpg",
    link: "/shop/supplements",
  },
  { name: "Gear", image: "/images/gear.jpg", link: "/shop/gear" },
  { name: "Apparel", image: "/images/apparel.jpg", link: "/shop/apparel" },
] as const;
export const productData: Product[] = [
  {
    id: 1,
    name: "Whey Protein",
    image: "/images/whey-protein.jpg",
    link: "/shop/supplements/whey-protein",
    price: 29.99,
    variant: "Chocolate",
    rating: 4.5,
    reviews: 120,
    description: "High-quality whey protein for muscle growth and recovery.",
  },
  {
    id: 2,
    name: "Creatine Monohydrate",
    image: "/images/creatine.jpg",
    link: "/shop/supplements/creatine-monohydrate",
    price: 19.99,
    variant: "Unflavored",
    rating: 4.7,
    reviews: 85,
    description:
      "Pure creatine monohydrate to enhance strength and power output.",
  },
  {
    id: 3,
    name: "Pre-Workout Formula",
    image: "/images/pre-workout.jpg",
    link: "/shop/supplements/pre-workout-formula",
    price: 34.99,
    variant: "Fruit Punch",
    rating: 4.3,
    reviews: 60,
    description: "Energizing pre-workout formula to boost focus and endurance.",
  },
  {
    id: 4,
    name: "Resistance Bands",
    image: "/images/resistance-bands.jpg",
    link: "/shop/gear/resistance-bands",
    price: 14.99,
    variant: "Set of 5",
    rating: 4.6,
    reviews: 45,
    description:
      "Durable resistance bands for strength training and rehabilitation.",
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
  description: string;
};
