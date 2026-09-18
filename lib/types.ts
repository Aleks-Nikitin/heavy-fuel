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
  id: string;
  productVariantId: string;
  name: string;
  stock: number;
  variant: string;
  size: string;
  image: string;
  price: number;
  priceAtPurchase: number;
  quantity: number;
};
export type ActionTypes = {
  addToCart: (item: CartItemType) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};
export type OrderItemDisplay = {
  id: string;
  productVariantId: string;
  quantity: number;
  priceAtPurchase: number;
  variant: {
    id: string;
    variant: string;
    size: string;
    product: {
      id: string;
      name: string;
      image: string;
    };
  };
};
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
