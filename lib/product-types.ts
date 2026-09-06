export type ProductVariantDisplay = {
  id: string;
  size: string;
  variant: string;
  price: number;
  stock: number;
};

export type ProductDisplay = {
  id: string;
  name: string;
  image: string;
  description: string;
  category: {
    title: string;
    slug: string;
  };
  variants: ProductVariantDisplay[];
  reviews: {
    id: string;
    rating: number;
    title: string;
    body: string;
    author: string;
    createdAt: string;
  }[];
};
