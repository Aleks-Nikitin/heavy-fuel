export type ProductVariantDisplay = {
  id: string;
  size: string;
  variant: string;
  price: number;
  stock: number;
};
export type ProductVariantImageDisplay = {
  id: string;
  variant: string;
  image: string;
  imagePublicId: string | null;
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
  variantImages: ProductVariantImageDisplay[];
  reviews: {
    id: string;
    rating: number;
    title: string;
    body: string;
    userId: string;
    createdAt: string;
  }[];
};
