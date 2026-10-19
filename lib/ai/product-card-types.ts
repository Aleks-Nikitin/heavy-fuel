export type ProductCardVariant = {
  id: string;
  variant: string;
  size: string;
  price: string;
  stock: number;
  image: string;
};

export type ProductCard = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  url: string;
  variants: ProductCardVariant[];
};
