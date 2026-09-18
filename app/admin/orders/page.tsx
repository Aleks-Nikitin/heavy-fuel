"use client";
import { getAdminOrders, updateOrderStatus } from "@/lib/actions/order-actions";
import { useSession } from "@/lib/auth-client";
import { OrderStatus, OrderType } from "@/lib/types";
import StatusUpdater from "@/components/orders/status-updater";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  Truck,
  Package,
  ChevronDown,
  RefreshCw,
  XCircle,
  ChevronUp,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
type OrderItemDisplay = {
  id: string;
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
export default function OrdersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/auth");
      } else if (!session.user.isAdmin) {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getAdminOrders(),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => {
      return await updateOrderStatus(orderId, status);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const getStatusIcon = (status: OrderStatus | string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4 text-[#CCFF00]" />;
      case "SHIPPED":
        return <Truck className="w-4 h-4 text-white" />;
      case "PROCESSING":
        return <RefreshCw className="w-4 h-4 text-[#38BDF8] animate-spin" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-[#EF4444]" />;
      default:
        return <Package className="w-4 h-4 text-[#8E8E93]" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0D10] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-8">
          Order Management
        </h1>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#13161C]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[#8E8E93] text-xs uppercase tracking-widest bg-[#0B0D10]">
                <th className="py-5 px-6 font-bold">Order ID</th>
                <th className="py-5 px-6 font-bold">Date</th>
                <th className="py-5 px-6 font-bold">Total</th>
                <th className="hidden md:table-cell py-5 px-6 font-bold">
                  Items
                </th>
                <th className="py-5 px-6 font-bold">Status</th>
                <th className="py-5 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const totalItems = order.items.reduce(
                  (acc: number, item: OrderItemDisplay) => acc + item.quantity,
                  0,
                );

                return (
                  <Fragment key={order.id}>
                    <tr
                      onClick={() => toggleOrder(order.id)}
                      className={`border-b border-white/5 transition-colors cursor-pointer ${
                        isExpanded
                          ? "bg-[#181c24] border-transparent"
                          : "hover:bg-[#181c24]"
                      }`}
                    >
                      <td className="py-6 px-6 text-white font-bold tracking-wider">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-6 px-6 text-[#8E8E93] text-sm font-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-6 px-6 text-[#CCFF00] font-black text-lg">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="hidden md:table-cell py-6 px-6 text-[#8E8E93] text-sm font-bold uppercase tracking-wider">
                        {totalItems} {totalItems === 1 ? "Item" : "Items"}
                      </td>
                      <td className="py-6 px-6">
                        {session?.user.isAdmin ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <StatusUpdater
                              order={order}
                              mutation={mutation}
                              getStatusIcon={getStatusIcon}
                            />
                          </div>
                        ) : (
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-black uppercase tracking-widest ${
                              order.status === "DELIVERED"
                                ? "bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20"
                                : order.status === "SHIPPED"
                                  ? "bg-white/10 text-white border border-white/20"
                                  : order.status === "CANCELLED"
                                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                    : "bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20"
                            }`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </div>
                        )}
                      </td>
                      <td className="py-6 px-6 text-right text-[#8E8E93]">
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
                            <div className="flex flex-col lg:flex-row gap-8">
                              <div className="flex-1">
                                <h3 className="text-[#8E8E93] text-xs uppercase tracking-widest font-bold mb-5">
                                  Order Items
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {order.items.map((item: OrderItemDisplay) => (
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
                                          $
                                          {Number(item.priceAtPurchase).toFixed(
                                            2,
                                          )}
                                        </p>
                                        <p className="text-[#8E8E93] text-xs font-semibold uppercase tracking-wider mt-1">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                                <h3 className="text-[#8E8E93] text-xs uppercase tracking-widest font-bold mb-5">
                                  Delivery Details
                                </h3>
                                <div className="bg-[#13161C] p-5 rounded-xl border border-white/5 space-y-4">
                                  <div className="flex gap-3">
                                    <MapPin className="w-5 h-5 text-[#8E8E93] shrink-0" />
                                    <div>
                                      <p className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                                        Shipping Address
                                      </p>
                                      <div className="text-sm text-white">
                                        <p className="uppercase tracking-wider">
                                          {order.shippingName ||
                                            session?.user?.name ||
                                            "Customer"}
                                        </p>

                                        {order.addressLine1 && (
                                          <p className="mt-1 text-[#8E8E93]">
                                            {order.addressLine1}
                                          </p>
                                        )}

                                        {order.addressLine2 && (
                                          <p className="text-[#8E8E93]">
                                            {order.addressLine2}
                                          </p>
                                        )}

                                        {(order.city ||
                                          order.state ||
                                          order.zipCode) && (
                                          <p className="text-[#8E8E93]">
                                            {[
                                              order.city,
                                              order.state,
                                              order.zipCode,
                                            ]
                                              .filter(Boolean)
                                              .join(", ")}
                                          </p>
                                        )}

                                        {order.country && (
                                          <p className="text-[#8E8E93]">
                                            {order.country}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
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
          {data?.length === 0 && !isLoading && (
            <div className="p-16 text-center text-[#8E8E93]">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-bold uppercase tracking-widest">
                No orders found.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
