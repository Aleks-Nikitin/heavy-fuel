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
