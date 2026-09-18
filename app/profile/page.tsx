"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderStatus, OrderItemDisplay } from "@/lib/types";
import {
  Package,
  Settings,
  LogOut,
  User as UserIcon,
  Star,
  Edit3,
  MapPin,
  Trash2,
  Truck,
  ChevronDown,
  XCircle,
  RefreshCw,
  CheckCircle,
  ChevronUp,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { updateProfile, deleteAccount } from "@/lib/actions/user-actions";
import { deleteReview } from "@/lib/actions/review-actions";
import { getReviewsByUser } from "@/lib/actions/review-actions";
import { getUserOrders } from "@/lib/actions/order-actions";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "reviews" | "settings">(
    "orders",
  );
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    }
  }, [session, isPending, router]);
  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ["userReviews", session?.user?.id],
    queryFn: () => getReviewsByUser(),
    enabled: !!session?.user?.id,
  });
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ["userOrders", session?.user?.id],
    queryFn: () => getUserOrders(),
    enabled: !!session?.user?.id,
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userReviews", session?.user?.id],
      });
    },
  });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };
  const getStatusIcon = (status: OrderStatus | string) => {
    switch (status) {
      case "DELIVERED":
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-[#CCFF00]" />;

      case "SHIPPED":
      case "Shipped":
        return <Truck className="w-4 h-4 text-white" />;

      case "PROCESSING":
      case "Processing":
        return <RefreshCw className="w-4 h-4 text-[#38BDF8] animate-spin" />;

      case "CANCELLED":
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-[#EF4444]" />;

      default:
        return <Package className="w-4 h-4 text-[#8E8E93]" />;
    }
  };
  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-[#CCFF00] font-black uppercase tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    );
  }
  const activeName = name ?? session.user.name ?? "";
  const activeEmail = email ?? session.user.email ?? "";

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
          router.refresh();
        },
      },
    });
  };
  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = session?.user?.id;
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    try {
      await updateProfile(activeName, activeEmail);

      await refetch();
      setName(null);
      setEmail(null);
      setIsEditing(false);

      router.refresh();
    } catch (error) {
      console.error("Failed to update profile view:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (confirmed) {
      try {
        await deleteAccount();
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/auth");
              router.refresh();
            },
          },
        });
      } catch (err) {
        console.error("Could not delete account cleanly:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 border-b border-zinc-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 bg-zinc-900 border-2 border-[#CCFF00] flex items-center justify-center">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon className="h-10 w-10 text-[#CCFF00]" />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">
                {session?.user?.name || "LIFTER"}
              </h1>
              <p className="text-zinc-400 font-bold tracking-widest text-sm uppercase mt-1">
                {session?.user?.email}
              </p>
              <div className="mt-3 inline-block bg-[#CCFF00]/10 text-[#CCFF00] px-3 py-1 text-xs font-black tracking-widest uppercase border border-[#CCFF00]/20">
                {session?.user?.isAdmin ? "Admin" : " Member"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-64 shrink-0">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-3 px-4 py-3 uppercase font-black tracking-widest text-sm transition-all border-l-2 ${
                  activeTab === "orders"
                    ? "border-[#CCFF00] bg-zinc-900 text-[#CCFF00]"
                    : "border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                <Package className="w-5 h-5" />
                Order History
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center gap-3 px-4 py-3 uppercase font-black tracking-widest text-sm transition-all border-l-2 ${
                  activeTab === "reviews"
                    ? "border-[#CCFF00] bg-zinc-900 text-[#CCFF00]"
                    : "border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                <Star className="w-5 h-5" />
                My Reviews
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-4 py-3 uppercase font-black tracking-widest text-sm transition-all border-l-2 ${
                  activeTab === "settings"
                    ? "border-[#CCFF00] bg-zinc-900 text-[#CCFF00]"
                    : "border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 uppercase font-black tracking-widest text-sm text-red-500 border-l-2 border-transparent hover:bg-red-500/10 transition-all mt-4"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </aside>

          <main className="flex-1">
            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-white">
                  Order History
                </h2>
                {orders.length === 0 ? (
                  <div className="p-12 border border-white/10 bg-[#13161C] rounded-2xl text-center">
                    <Package className="w-12 h-12 text-[#8E8E93] mx-auto mb-4" />
                    <p className="text-[#8E8E93] font-bold uppercase tracking-widest">
                      No orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isExpanded = expandedOrderId === order.id;
                      const totalItems =
                        order.items?.reduce(
                          (acc: number, item: OrderItemDisplay) =>
                            acc + item.quantity,
                          0,
                        ) || 0;

                      return (
                        <div
                          key={order.id}
                          className={`border transition-all duration-200 rounded-xl overflow-hidden ${
                            isExpanded
                              ? "border-white/20 bg-[#181c24]"
                              : "border-white/5 bg-[#13161C] hover:border-white/20"
                          }`}
                        >
                          <div
                            onClick={() => toggleOrder(order.id)}
                            className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                          >
                            <div>
                              <p className="text-[#8E8E93] font-bold text-xs uppercase tracking-widest mb-1">
                                Order #{order.id.slice(-8).toUpperCase()}
                              </p>
                              <div className="flex items-center gap-3">
                                <p className="font-black text-2xl text-white">
                                  ${Number(order.totalAmount).toFixed(2)}
                                </p>
                                <span className="text-[#8E8E93] text-sm font-semibold border-l border-white/20 pl-3">
                                  {new Date(
                                    order.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-[#8E8E93] text-xs font-bold uppercase tracking-wider mt-2">
                                {totalItems}{" "}
                                {totalItems === 1 ? "Item" : "Items"}
                              </p>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
                              <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-black uppercase tracking-widest ${
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
                              <button className="text-[#8E8E93] hover:text-white transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
                                {isExpanded ? (
                                  <>
                                    Hide Details <ChevronUp size={16} />
                                  </>
                                ) : (
                                  <>
                                    View Details <ChevronDown size={16} />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="border-t border-white/10 bg-[#0B0D10] p-6 animate-in slide-in-from-top-2 fade-in duration-200">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                  <h3 className="text-[#8E8E93] text-xs uppercase tracking-widest font-bold mb-4">
                                    Items Included
                                  </h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {order.items?.map(
                                      (item: OrderItemDisplay) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center gap-4 bg-[#13161C] p-3 rounded-lg border border-white/5"
                                        >
                                          <div className="w-16 h-16 bg-white/5 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                              src={item.variant.product.image}
                                              alt={item.variant.product.name}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold uppercase tracking-wide text-xs truncate">
                                              {item.variant.product.name}
                                            </p>
                                            <p className="text-[#8E8E93] text-[10px] font-semibold uppercase tracking-wider mt-1">
                                              Size: {item.variant.size} • Qty:{" "}
                                              {item.quantity}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-[#CCFF00] font-black text-sm">
                                              $
                                              {Number(
                                                item.priceAtPurchase,
                                              ).toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-[#8E8E93] text-xs uppercase tracking-widest font-bold mb-4">
                                    Shipping Details
                                  </h3>
                                  <div className="bg-[#13161C] p-4 rounded-lg border border-white/5">
                                    <div className="flex items-start gap-3">
                                      <Truck className="w-5 h-5 text-[#8E8E93] mt-0.5" />
                                      <div className="text-sm font-semibold text-white">
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
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-6">
                  My Reviews
                </h2>
                <div className="grid gap-4">
                  {isReviewsLoading ? (
                    <div className="text-[#CCFF00] font-bold animate-pulse">
                      Loading reviews...
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-zinc-800 bg-zinc-900/30 p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-[#CCFF00] uppercase tracking-widest text-sm">
                            {review.product.name}
                          </h3>
                          <div className="flex text-[#CCFF00]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-[#CCFF00]" : "text-zinc-700"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="font-black uppercase tracking-wide text-lg mb-2">
                          {review.title}
                        </p>
                        <p className="text-zinc-400 mb-4">{review.body}</p>

                        <div className="flex gap-3 pt-4 border-t border-zinc-800">
                          <button
                            disabled={deleteReviewMutation.isPending}
                            onClick={() => {
                              if (window.confirm("Delete this review?")) {
                                deleteReviewMutation.mutate(review.id);
                              }
                            }}
                            className="text-xs flex gap-2 font-bold uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[#CCFF00] font-bold text-xl uppercase tracking-widest">
                      No reviews found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black uppercase tracking-widest">
                    Account Settings
                  </h2>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="ghost"
                      className="text-[#CCFF00] hover:bg-[#CCFF00]/10 hover:text-[#CCFF00] uppercase font-bold tracking-widest rounded-none"
                    >
                      <Edit3 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest uppercase text-zinc-500">
                      Display Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={activeName}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white outline-none focus:border-[#CCFF00] transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest uppercase text-zinc-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={activeEmail}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white outline-none focus:border-[#CCFF00] transition-colors disabled:opacity-50"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        className="bg-[#CCFF00] text-black hover:bg-white rounded-none font-black uppercase tracking-widest px-8"
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="border-zinc-700 text-zinc-400 hover:text-white rounded-none font-black uppercase tracking-widest"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>

                <div className="mt-16 pt-8 border-t border-zinc-800 border-dashed">
                  <h3 className="text-red-500 font-black uppercase tracking-widest mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-zinc-500 text-sm mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <Button
                    variant="destructive"
                    className="rounded-none font-black uppercase tracking-widest bg-red-950 text-red-500 border border-red-900 hover:bg-red-900 hover:text-white"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
