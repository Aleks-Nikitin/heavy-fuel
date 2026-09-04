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
    link: "/products/1",
    price: 29.99,
    category: "Supplements",
    options: {
      size: ["200g", "500g", "1kg"],
      additionalSizePrice: [0, 5, 10],
      variant: ["Chocolate", "Vanilla", "Strawberry"],
    },
    rating: 4.5,
    reviews: 120,
    description: "High-quality whey protein for muscle growth and recovery.",
  },
  {
    id: 2,
    name: "Creatine Monohydrate",
    image: "/protein-tub.jpg",
    link: "/products/2",
    price: 19.99,
    category: "Supplements",
    options: {
      size: ["100g", "250g", "500g"],
      additionalSizePrice: [0, 3, 7],
      variant: ["Unflavored", "Fruit Punch", "Watermelon"],
    },
    rating: 4.7,
    reviews: 85,
    description:
      "Pure creatine monohydrate to enhance strength and power output.",
  },
  {
    id: 3,
    name: "Pre-Workout Formula",
    image: "/protein-tub.jpg",
    link: "/products/3",
    price: 34.99,
    category: "Supplements",
    options: {
      size: ["100g", "250g", "500g"],
      additionalSizePrice: [0, 5, 10],
      variant: ["Unflavored", "Fruit Punch", "Watermelon"],
    },
    rating: 4.3,
    reviews: 60,
    description: "Energizing pre-workout formula to boost focus and endurance.",
  },
  {
    id: 4,
    name: "Resistance Bands",
    image: "/protein-tub.jpg",
    link: "/products/4",
    price: 14.99,
    category: "Gear",
    options: {
      size: ["Light", "Medium", "Heavy"],
      additionalSizePrice: [0, 2, 4],
      variant: ["Set of 3", "Set of 5", "Set of 7"],
    },
    rating: 4.6,
    reviews: 45,
    description:
      "Durable resistance bands for strength training and rehabilitation.",
  },
  {
    id: 5,
    name: "Weightlifting Gloves",
    image: "/protein-tub.jpg",
    link: "/products/5",
    price: 24.99,
    category: "Gear",
    options: {
      size: ["Small", "Medium", "Large"],
      additionalSizePrice: [0, 2, 4],
      variant: ["Black", "White", "Gray"],
    },

    rating: 4.4,
    reviews: 30,
    description:
      "Comfortable weightlifting gloves to protect your hands during lifts.",
  },
  {
    id: 6,
    name: "Compression Shirt",
    image: "/protein-tub.jpg",
    link: "/products/6",
    price: 39.99,
    category: "Apparel",
    options: {
      size: ["Small", "Medium", "Large"],
      additionalSizePrice: [0, 2, 4],
      variant: ["Black/Red", "Blue/White", "Green/Yellow"],
    },
    rating: 4.5,
    reviews: 50,
    description:
      "High-performance compression shirt for improved blood flow and support.",
  },
  {
    id: 7,
    name: "Athletic Shorts",
    image: "/protein-tub.jpg",
    link: "/products/7",
    price: 29.99,
    category: "Apparel",
    options: {
      size: ["Small", "Medium", "Large"],
      additionalSizePrice: [0, 2, 4],
      variant: ["Black", "Gray", "Navy Blue"],
    },
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
