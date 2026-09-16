"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
  Package,
  Settings,
  LogOut,
  User as UserIcon,
  Star,
  Edit3,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfile, deleteAccount } from "@/lib/actions/user-actions";

const MOCK_ORDERS = [
  {
    id: "cm12x9a",
    totalAmount: 145.0,
    status: "DELIVERED",
    createdAt: "2026-09-10",
  },
  {
    id: "cm13y8b",
    totalAmount: 65.5,
    status: "PROCESSING",
    createdAt: "2026-09-14",
  },
];

const MOCK_REVIEWS = [
  {
    id: "rv1",
    productName: "Oversized Heavyweight Hoodie",
    rating: 5,
    title: "Best pump cover",
    body: "Fits perfectly. The zinc color is super clean.",
    createdAt: "2026-09-12",
  },
];

export default function ProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "reviews" | "settings">(
    "orders",
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    }
  }, [session, isPending, router]);

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
                HeavyFuel Member
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
                <h2 className="text-2xl font-black uppercase tracking-widest mb-6">
                  Order History
                </h2>
                {MOCK_ORDERS.length === 0 ? (
                  <div className="p-8 border border-zinc-800 bg-zinc-900/50 text-center">
                    <p className="text-zinc-500 font-bold uppercase tracking-widest">
                      No orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {MOCK_ORDERS.map((order) => (
                      <div
                        key={order.id}
                        className="border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                      >
                        <div>
                          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-1">
                            Order #{order.id}
                          </p>
                          <p className="font-black text-lg">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-zinc-500 text-sm mt-1">
                            {order.createdAt}
                          </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-3">
                          <span
                            className={`px-3 py-1 text-xs font-black uppercase tracking-widest ${
                              order.status === "DELIVERED"
                                ? "bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20"
                                : order.status === "CANCELLED"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : "bg-zinc-800 text-white"
                            }`}
                          >
                            {order.status}
                          </span>
                          <Button
                            variant="outline"
                            className="border-zinc-700 hover:border-[#CCFF00] hover:text-[#CCFF00] hover:bg-transparent rounded-none uppercase font-bold tracking-widest text-xs"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
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
                  {MOCK_REVIEWS.map((review) => (
                    <div
                      key={review.id}
                      className="border border-zinc-800 bg-zinc-900/30 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#CCFF00] uppercase tracking-widest text-sm">
                          {review.productName}
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
                        <button className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                          Edit
                        </button>
                        <button className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
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
