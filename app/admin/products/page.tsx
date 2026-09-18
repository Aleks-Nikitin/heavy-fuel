"use client";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Package,
  Loader2,
  ChevronDown,
  ChevronRight,
  Boxes,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  getAllProducts,
  deleteProduct,
  updateProductVariant,
} from "@/lib/actions/product-actions";

export default function AdminProductsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null,
  );
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const toggleExpanded = (productId: string) => {
    setExpandedProductId((current) =>
      current === productId ? null : productId,
    );
  };
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
  const updateVariantMutation = useMutation({
    mutationFn: updateProductVariant,
    onSuccess: () => {
      toast.success("Variant updated");
      setEditingVariantId(null);
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update variant",
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
  const handleStartEdit = (variant: any) => {
    setEditingVariantId(variant.id);
    setEditPrice(String(variant.price));
    setEditStock(String(variant.stock));
  };

  const handleCancelEdit = () => {
    setEditingVariantId(null);
    setEditPrice("");
    setEditStock("");
  };

  const handleSaveVariant = (variantId: string) => {
    const price = Number(editPrice);
    const stock = Number(editStock);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      toast.error("Stock must be a non-negative whole number");
      return;
    }

    updateVariantMutation.mutate({
      id: variantId,
      price,
      stock,
    });
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
            Product Management
          </h1>
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

                  const isExpanded = expandedProductId === product.id;

                  const uniqueVariants = [
                    ...new Set(
                      product.variants.map((variant: any) => variant.variant),
                    ),
                  ];

                  const uniqueSizes = [
                    ...new Set(
                      product.variants.map((variant: any) => variant.size),
                    ),
                  ];

                  return (
                    <Fragment key={product.id}>
                      <tr
                        onClick={() => toggleExpanded(product.id)}
                        className="border-b border-white/5 hover:bg-[#181c24] transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="text-[#8E8E93] hover:text-[#CCFF00] transition-colors"
                              aria-label={
                                isExpanded
                                  ? `Collapse ${product.name}`
                                  : `Expand ${product.name}`
                              }
                            >
                              {isExpanded ? (
                                <ChevronDown size={18} />
                              ) : (
                                <ChevronRight size={18} />
                              )}
                            </button>

                            <div className="w-16 h-16 bg-[#0B0D10] rounded-lg border border-white/5 overflow-hidden flex items-center justify-center relative shrink-0">
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

                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-white font-bold">
                              {uniqueVariants.length}
                            </span>

                            <span className="text-[#8E8E93] text-[10px] uppercase tracking-wider">
                              {uniqueVariants.length === 1
                                ? "Variant"
                                : "Variants"}
                            </span>
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

                        <td
                          className="py-4 px-6 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            disabled={deleteMutation.isPending}
                            className="p-3 text-[#8E8E93] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50"
                            title="Delete Product"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0B0D10] border-b border-white/10">
                          <td colSpan={5} className="p-0">
                            <div className="p-5 md:p-8 animate-in slide-in-from-top-2 fade-in duration-200">
                              <div className="flex items-center justify-between gap-4 mb-6">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Boxes
                                      size={18}
                                      className="text-[#CCFF00]"
                                    />

                                    <h3 className="text-white font-bold uppercase tracking-wider">
                                      Inventory Breakdown
                                    </h3>
                                  </div>

                                  <p className="text-[#8E8E93] text-xs mt-1">
                                    Stock and pricing for each product
                                    combination.
                                  </p>
                                </div>

                                <div className="hidden sm:flex gap-2">
                                  <span className="px-3 py-1.5 rounded-lg bg-[#13161C] border border-white/10 text-xs text-[#8E8E93]">
                                    {uniqueVariants.length} variants
                                  </span>

                                  <span className="px-3 py-1.5 rounded-lg bg-[#13161C] border border-white/10 text-xs text-[#8E8E93]">
                                    {uniqueSizes.length} sizes
                                  </span>

                                  <span className="px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-xs font-bold text-[#CCFF00]">
                                    {totalStock} units
                                  </span>
                                </div>
                              </div>

                              <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#13161C]">
                                <table className="w-full min-w-[650px] text-left text-sm">
                                  <thead className="admin-table-header">
                                    <tr>
                                      <th className="px-5 py-3.5 font-medium">
                                        Image
                                      </th>

                                      <th className="px-5 py-3.5 font-medium">
                                        Variant
                                      </th>

                                      <th className="px-5 py-3.5 font-medium">
                                        Size
                                      </th>

                                      <th className="px-5 py-3.5 font-medium">
                                        Price
                                      </th>

                                      <th className="px-5 py-3.5 font-medium">
                                        Stock
                                      </th>

                                      <th className="px-5 py-3.5 font-medium">
                                        SKU
                                      </th>
                                      <th className="px-5 py-3.5 font-medium text-right">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody className="divide-y divide-white/10">
                                    {product.variants.map((variant: any) => {
                                      const isEditing =
                                        editingVariantId === variant.id;
                                      const variantImage =
                                        product.variantImages?.find(
                                          (image: any) =>
                                            image.variant === variant.variant,
                                        );

                                      return (
                                        <tr
                                          key={variant.id}
                                          className="admin-table-row"
                                        >
                                          <td className="px-5 py-3">
                                            <div className="relative w-12 h-12 rounded-lg bg-[#0B0D10] border border-white/10 overflow-hidden">
                                              <Image
                                                src={
                                                  variantImage?.image ??
                                                  product.image
                                                }
                                                alt={`${product.name} ${variant.variant}`}
                                                fill
                                                className="object-contain p-1"
                                              />
                                            </div>
                                          </td>

                                          <td className="px-5 py-4">
                                            <span className="font-bold text-white">
                                              {variant.variant || "Default"}
                                            </span>
                                          </td>

                                          <td className="px-5 py-4 text-[#8E8E93]">
                                            {variant.size || "Default"}
                                          </td>

                                          <td className="px-5 py-4">
                                            {isEditing ? (
                                              <div className="relative w-28">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">
                                                  $
                                                </span>
                                                <input
                                                  type="number"
                                                  min="0.01"
                                                  step="0.01"
                                                  value={editPrice}
                                                  onChange={(e) =>
                                                    setEditPrice(e.target.value)
                                                  }
                                                  className="admin-input h-10 w-28 pl-7"
                                                />
                                              </div>
                                            ) : (
                                              <span className="font-bold text-white">
                                                ${" "}
                                                {Number(variant.price).toFixed(
                                                  2,
                                                )}
                                              </span>
                                            )}
                                          </td>

                                          <td className="px-5 py-4">
                                            {isEditing ? (
                                              <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={editStock}
                                                onChange={(e) =>
                                                  setEditStock(e.target.value)
                                                }
                                                className="admin-input h-10 w-24"
                                              />
                                            ) : (
                                              <div className="flex items-center gap-2">
                                                <span
                                                  className={`w-2 h-2 rounded-full ${
                                                    variant.stock === 0
                                                      ? "bg-red-500"
                                                      : variant.stock <= 5
                                                        ? "bg-yellow-500"
                                                        : "bg-[#CCFF00]"
                                                  }`}
                                                />
                                                <span
                                                  className={`font-black ${
                                                    variant.stock === 0
                                                      ? "text-red-500"
                                                      : variant.stock <= 5
                                                        ? "text-yellow-500"
                                                        : "text-white"
                                                  }`}
                                                >
                                                  {variant.stock}
                                                </span>
                                                <span className="text-[#8E8E93] text-xs">
                                                  units
                                                </span>
                                              </div>
                                            )}
                                          </td>

                                          <td className="px-5 py-4">
                                            {variant.sku ? (
                                              <code className="text-xs text-[#8E8E93] bg-[#0B0D10] border border-white/10 rounded-md px-2 py-1">
                                                {variant.sku}
                                              </code>
                                            ) : (
                                              <span className="text-white/20">
                                                —
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-5 py-4 text-right">
                                            {isEditing ? (
                                              <div className="flex items-center justify-end gap-1">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleSaveVariant(
                                                      variant.id,
                                                    )
                                                  }
                                                  disabled={
                                                    updateVariantMutation.isPending
                                                  }
                                                  className="p-2.5 rounded-lg text-[#CCFF00] hover:bg-[#CCFF00]/10 transition-colors disabled:opacity-50"
                                                  title="Save changes"
                                                >
                                                  {updateVariantMutation.isPending ? (
                                                    <Loader2
                                                      size={18}
                                                      className="animate-spin"
                                                    />
                                                  ) : (
                                                    <Check size={18} />
                                                  )}
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={handleCancelEdit}
                                                  disabled={
                                                    updateVariantMutation.isPending
                                                  }
                                                  className="p-2.5 rounded-lg text-[#8E8E93] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                                                  title="Cancel"
                                                >
                                                  <X size={18} />
                                                </button>
                                              </div>
                                            ) : (
                                              <button
                                                type="button"
                                                disabled={
                                                  editingVariantId !== null &&
                                                  editingVariantId !==
                                                    variant.id
                                                }
                                                onClick={() =>
                                                  handleStartEdit(variant)
                                                }
                                                className="p-2.5 rounded-lg text-[#8E8E93] hover:text-[#CCFF00] hover:bg-[#CCFF00]/10 transition-colors"
                                                title="Edit price and stock"
                                              >
                                                <Pencil size={18} />
                                              </button>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
