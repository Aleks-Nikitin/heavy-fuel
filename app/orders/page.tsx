"use client";
import { getAllOrders } from "@/lib/actions/order-actions";
import { useSession } from "@/lib/auth-client";
import { OrderType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  Truck,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function OrdersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    }
  }, [session, isPending, router]);
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const orders = await getAllOrders();
      return orders;
    },
  });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };
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
                  Items
                </th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((order) => {
                const isExpanded = expandedOrderId === order.id;

                const totalItems = order.items.reduce(
                  (acc, item) => acc + item.quantity,
                  0,
                );

                return (
                  <Fragment key={order.id}>
                    <tr
                      onClick={() => toggleOrder(order.id)}
                      className={`border-b border-white/5 bg-[#13161C] hover:bg-[#181c24] transition-colors cursor-pointer ${
                        isExpanded ? "border-transparent bg-[#181c24]" : ""
                      }`}
                    >
                      <td className="py-6 px-4 text-white font-bold tracking-wider">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-6 px-4 text-[#8E8E93] text-sm font-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-6 px-4 text-[#CCFF00] font-black">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="hidden md:table-cell py-6 px-4 text-[#8E8E93] text-sm font-bold uppercase tracking-wider">
                        {totalItems} {totalItems === 1 ? "Item" : "Items"}
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </td>
                      <td className="py-6 px-4 text-right text-[#8E8E93]">
                        {isExpanded ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-[#0B0D10] border-b border-white/10">
                        <td colSpan={6} className="p-0">
                          <div className="p-6 md:p-8 animate-in slide-in-from-top-2 fade-in duration-200">
                            <h3 className="text-[#8E8E93] text-xs uppercase tracking-widest font-bold mb-6">
                              Order Items
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-4 bg-[#13161C] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                                >
                                  <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={item.variant.product.image}
                                      alt={item.variant.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold uppercase tracking-wide text-sm truncate">
                                      {item.variant.product.name}
                                    </p>
                                    <p className="text-[#8E8E93] text-xs font-semibold uppercase tracking-wider mt-1">
                                      Size: {item.variant.size}
                                    </p>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-[#CCFF00] font-black">
                                      ${Number(item.priceAtPurchase).toFixed(2)}
                                    </p>
                                    <p className="text-[#8E8E93] text-xs font-semibold uppercase tracking-wider mt-1">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
