export type OrderType = {
  id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
};
export type CartType = {
  products: CartItemType[];
  totalItems: number;
  totalPrice: number;
};
export type CartItemType = {
  productVariantId: string;
  productId: string;
  name: string;
  stock: number;
  variant: string;
  size: string;
  image: string;
  price: number;
  quantity: number;
};
export type ActionTypes = {
  addToCart: (item: CartItemType) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
