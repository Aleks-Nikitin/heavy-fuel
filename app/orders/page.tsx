"use client";
import { Package, Truck, CheckCircle } from "lucide-react";

const ORDERS_DATA = [
  {
    id: "HF-882910",
    date: "Sep 02, 2026",
    price: 134.97,
    products: "Whey Protein (Chocolate), Creatine Monohydrate",
    status: "Delivered",
  },
  {
    id: "HF-883104",
    date: "Sep 04, 2026",
    price: 89.99,
    products: "10mm Lever Belt (Matte Black)",
    status: "Shipped",
  },
  {
    id: "HF-884099",
    date: "Sep 05, 2026",
    price: 34.99,
    products: "Pre-Workout Formula (Fruit Punch)",
    status: "Processing",
  },
];

export default function OrdersPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-[#CCFF00]" />;
      case "Shipped":
        return <Truck className="w-4 h-4 text-white" />;
      default:
        return <Package className="w-4 h-4 text-[#8E8E93]" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0D10] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-8">
          Order History
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[#8E8E93] text-sm uppercase tracking-widest">
                <th className="py-4 px-4 font-bold">Order ID</th>
                <th className="py-4 px-4 font-bold">Date</th>
                <th className="py-4 px-4 font-bold">Total</th>
                <th className="hidden md:table-cell py-4 px-4 font-bold">
                  Products
                </th>
                <th className="py-4 px-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS_DATA.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 bg-[#13161C] hover:bg-[#181c24] transition-colors"
                >
                  <td className="py-6 px-4 text-white font-bold tracking-wider">
                    {order.id}
                  </td>
                  <td className="py-6 px-4 text-[#8E8E93] text-sm font-semibold">
                    {order.date}
                  </td>
                  <td className="py-6 px-4 text-[#CCFF00] font-black">
                    ${order.price.toFixed(2)}
                  </td>
                  <td className="hidden md:table-cell py-6 px-4 text-[#8E8E93] text-sm truncate max-w-[250px]">
                    {order.products}
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
