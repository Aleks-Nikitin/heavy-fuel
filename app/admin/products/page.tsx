"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Package, Plus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { getAllProducts, deleteProduct } from "@/lib/actions/product-actions";

export default function AdminProductsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/auth");
      } else if (!session.user.isAdmin) {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  const { isLoading, data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      return await getAllProducts();
    },
    enabled: !!session?.user.isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await deleteProduct(productId);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      toast.error(
        "Failed to delete product. It may be tied to existing orders.",
      );
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${name.toUpperCase()}? This cannot be undone.`,
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  if (isPending || !session?.user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#CCFF00] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0D10] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
            Inventory <span className="text-[#CCFF00]">Control</span>
          </h1>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#CCFF00] text-black rounded-xl font-black uppercase tracking-wider hover:bg-[#b3e600] transition-colors">
            <Plus size={20} />
            Add Product
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#13161C]">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-[#8E8E93] text-xs uppercase tracking-widest">
                <th className="py-5 px-6 font-bold w-16">Item</th>
                <th className="py-5 px-4 font-bold">Details</th>
                <th className="py-5 px-4 font-bold text-center">Variants</th>
                <th className="py-5 px-4 font-bold text-center">Total Stock</th>
                <th className="py-5 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8E8E93]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading inventory...
                  </td>
                </tr>
              ) : products?.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-[#8E8E93] uppercase font-bold tracking-widest"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products?.map((product: any) => {
                  const totalStock =
                    product.variants?.reduce(
                      (acc: number, variant: any) => acc + (variant.stock || 0),
                      0,
                    ) || 0;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 hover:bg-[#181c24] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="w-16 h-16 bg-[#0B0D10] rounded-lg border border-white/5 overflow-hidden flex items-center justify-center relative">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-white/20" />
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <p className="text-white font-bold uppercase tracking-wide">
                          {product.name}
                        </p>
                        <p className="text-[#8E8E93] text-xs font-semibold uppercase tracking-wider mt-1">
                          {product.category?.title || "Uncategorized"}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-center max-w-[200px]">
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {product.variants?.length ? (
                            product.variants.map((v: any) => (
                              <span
                                key={v.id}
                                className="inline-flex items-center bg-white/5 border border-white/10 rounded overflow-hidden text-[10px] uppercase font-bold tracking-wider"
                              >
                                <span className="px-1.5 py-1 text-[#8E8E93] border-r border-white/10">
                                  {v.size}
                                </span>
                                <span className="px-1.5 py-1 text-white">
                                  {v.variant}
                                </span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#8E8E93]">
                              No variants
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`font-black text-lg ${
                            totalStock === 0
                              ? "text-red-500"
                              : totalStock < 10
                                ? "text-yellow-500"
                                : "text-[#CCFF00]"
                          }`}
                        >
                          {totalStock}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleteMutation.isPending}
                          className="p-3 text-[#8E8E93] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
