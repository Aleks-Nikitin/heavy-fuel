"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createProduct, getCategories } from "@/lib/actions/product-actions";
import {
  createProductSchema,
  type CreateProductInput,
} from "@/lib/validations/product";
import React, { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
type VariantMatrixItem = {
  id: string;
  flavor: string;
  size: string;
  price: string;
  stock: string;
  sku: string;
};

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [currentFlavor, setCurrentFlavor] = useState("");
  const [flavors, setFlavors] = useState<string[]>([]);

  const [currentSize, setCurrentSize] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);

  const [variants, setVariants] = useState<VariantMatrixItem[]>([]);
  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: () => {
      toast.success("Product created!");
      setName("");
      setDescription("");
      setCategoryId("");
      setImageUrl("");
      setCurrentFlavor("");
      setFlavors([]);
      setCurrentSize("");
      setSizes([]);
      setVariants([]);
    },

    onError: (error) => {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Product creation failed",
      );
    },
  });
  const {
    isLoading,
    error,
    data: categories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategories(),
  });
  useEffect(() => {
    const newVariants: VariantMatrixItem[] = [];

    if (flavors.length === 0 && sizes.length === 0) {
      setVariants([]);
      return;
    }

    const activeFlavors = flavors.length > 0 ? flavors : ["Default"];
    const activeSizes = sizes.length > 0 ? sizes : ["Default"];

    activeFlavors.forEach((flavor) => {
      activeSizes.forEach((size) => {
        const existing = variants.find(
          (v) => v.flavor === flavor && v.size === size,
        );

        if (existing) {
          newVariants.push(existing);
        } else {
          newVariants.push({
            id: `${flavor}-${size}`,
            flavor: flavor !== "Default" ? flavor : "",
            size: size !== "Default" ? size : "",
            price: "",
            stock: "0",
            sku: "",
          });
        }
      });
    });

    setVariants(newVariants);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flavors, sizes]);

  const handleAddFlavor = (e: React.FormEvent) => {
    e.preventDefault();

    const flavor = currentFlavor.trim();

    if (flavor && !flavors.includes(flavor)) {
      setFlavors([...flavors, flavor]);
      setCurrentFlavor("");
    }
  };

  const handleRemoveFlavor = (flavorToRemove: string) => {
    setFlavors(flavors.filter((f) => f !== flavorToRemove));
  };

  const handleAddSize = (e: React.FormEvent) => {
    e.preventDefault();

    const size = currentSize.trim();

    if (size && !sizes.includes(size)) {
      setSizes([...sizes, size]);
      setCurrentSize("");
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleVariantChange = (
    id: string,
    field: keyof VariantMatrixItem,
    value: string,
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createProductSchema.safeParse({
      name,
      description,
      categoryId,
      image: imageUrl,
      variants,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid product data");
      return;
    }

    createProductMutation.mutate(result.data);
  };

  return (
    <main className="admin-page">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create New Product
          </h1>

          <p className="mt-2 text-sm admin-muted">
            Add a new product, configure variants, and set pricing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <section className="space-y-5 admin-card">
                <div>
                  <h2 className="admin-card-title">General Information</h2>

                  <p className="admin-card-description">
                    Basic information displayed on the product page.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="admin-label">Product Name</label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., 100% Gold Standard Whey"
                    className="admin-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="admin-label">Description</label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe the product..."
                    className="admin-textarea"
                  />
                </div>
                <div className="space-y-2">
                  <label className="admin-label">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="admin-select h-12"
                  >
                    <option value="" disabled className="bg-[#0B0D10]">
                      Select a category...
                    </option>
                    {isLoading ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      categories?.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                          className="bg-[#0B0D10]"
                        >
                          {category.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </section>
              <section className="space-y-6 admin-card">
                <div>
                  <h2 className="admin-card-title">Product Options</h2>
                  <p className="admin-card-description">
                    Create the available variants and sizes.
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="admin-label">Variants</label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentFlavor}
                      onChange={(e) => setCurrentFlavor(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddFlavor(e);
                        }
                      }}
                      placeholder="e.g., Double Rich Chocolate"
                      className="admin-input h-12"
                    />

                    <button
                      type="button"
                      onClick={handleAddFlavor}
                      className="admin-primary-button h-12 shrink-0 px-5 "
                    >
                      Add
                    </button>
                  </div>

                  {flavors.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {flavors.map((flavor) => (
                        <span
                          key={flavor}
                          className="
                           admin-tag
                          "
                        >
                          {flavor}

                          <button
                            type="button"
                            onClick={() => handleRemoveFlavor(flavor)}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-[#CCFF00]/70 transition-colors hover:bg-[#CCFF00]/15 hover:text-[#CCFF00]"
                            aria-label={`Remove ${flavor}`}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-3 border-t border-white/10 pt-6">
                  <label className="admin-label">Sizes</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentSize}
                      onChange={(e) => setCurrentSize(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddSize(e);
                        }
                      }}
                      placeholder="e.g., 2 lbs, 5 lbs, XL"
                      className="admin-input h-12"
                    />

                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="admin-primary-button h-12 shrink-0 px-5"
                    >
                      Add
                    </button>
                  </div>

                  {sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {sizes.map((size) => (
                        <span
                          key={size}
                          className="
                           admin-tag
                          "
                        >
                          {size}

                          <button
                            type="button"
                            onClick={() => handleRemoveSize(size)}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-[#CCFF00]/70 transition-colors hover:bg-[#CCFF00]/15 hover:text-[#CCFF00]"
                            aria-label={`Remove ${size}`}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="space-y-4 admin-card">
                <div>
                  <h2 className="admin-card-title">Product Image</h2>
                  <p className="admin-card-description">
                    Upload the primary product image.
                  </p>
                </div>

                <CldUploadWidget
                  uploadPreset="heavyfuel_products"
                  options={{
                    multiple: false,
                    maxFiles: 1,
                    resourceType: "image",
                    clientAllowedFormats: [
                      "jpg",
                      "jpeg",
                      "png",
                      "webp",
                      "avif",
                    ],
                    maxFileSize: 5_000_000,
                    folder: "heavyfuel/products",
                  }}
                  onSuccess={(result) => {
                    if (
                      typeof result.info === "object" &&
                      "secure_url" in result.info
                    ) {
                      setImageUrl(result.info.secure_url);
                      toast.success("Image uploaded!");
                    }
                  }}
                  onError={() => {
                    toast.error("Image upload failed");
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="
                        group flex min-h-56 w-full
                        flex-col items-center justify-center
                        overflow-hidden rounded-xl
                        border-2 border-dashed border-white/10
                        bg-[#0B0D10] p-6
                        text-center transition-all
                        hover:border-[#CCFF00]/50
                    "
                    >
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt="Uploaded product"
                          className="max-h-52 w-full rounded-lg object-contain"
                        />
                      ) : (
                        <>
                          <div
                            className="
                        mb-4 flex h-12 w-12
                        items-center justify-center
                        rounded-full border border-white/10
                        bg-[#181c24]
                        transition-colors
                        group-hover:border-[#CCFF00]/30
                        "
                          >
                            <Upload
                              size={22}
                              className="
                                text-[#8E8E93]
                                transition-colors
                                group-hover:text-[#CCFF00]
                            "
                            />
                          </div>
                          <p className="text-sm font-medium text-white/80">
                            Click to upload image
                          </p>
                          <p className="mt-1 text-xs text-[#8E8E93]">
                            JPG, PNG, WEBP or AVIF · Max 5 MB
                          </p>
                        </>
                      )}
                    </button>
                  )}
                </CldUploadWidget>
              </section>
            </div>
          </div>

          {variants.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#13161C] shadow-2xl">
              <div className="p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Pricing & Inventory</h2>

                <p className="mt-1 text-sm text-white/40">
                  Set the price, stock, and SKU for each variant and size
                  combination.
                </p>
              </div>

              <div className="overflow-x-auto border-t border-white/10">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="admin-table-header">
                    <tr>
                      {flavors.length > 0 && (
                        <th className="px-5 py-3.5 font-medium">Variant</th>
                      )}
                      {sizes.length > 0 && (
                        <th className="px-5 py-3.5 font-medium">Size</th>
                      )}
                      <th className="px-5 py-3.5 font-medium">Price ($)</th>
                      <th className="px-5 py-3.5 font-medium">Stock</th>
                      <th className="px-5 py-3.5 font-medium">SKU</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {variants.map((variant) => (
                      <tr key={variant.id} className="admin-table-row border-t">
                        {flavors.length > 0 && (
                          <td className="px-5 py-4 font-medium text-white">
                            {variant.flavor}
                          </td>
                        )}

                        {sizes.length > 0 && (
                          <td className="px-5 py-4 text-white/60">
                            {variant.size}
                          </td>
                        )}

                        <td className="px-5 py-4">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(
                                variant.id,
                                "price",
                                e.target.value,
                              )
                            }
                            className="admin-input h-10 w-28"
                          />
                        </td>

                        <td className="px-5 py-4">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(
                                variant.id,
                                "stock",
                                e.target.value,
                              )
                            }
                            className="admin-input h-10 w-28"
                          />
                        </td>

                        <td className="px-5 py-4">
                          <input
                            type="text"
                            placeholder="SKU-..."
                            value={variant.sku}
                            onChange={(e) =>
                              handleVariantChange(
                                variant.id,
                                "sku",
                                e.target.value,
                              )
                            }
                            className="admin-input h-10 min-w-36"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <div className="flex justify-end border-t border-white/10 pt-6">
            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="admin-primary-button flex min-w-44 items-center justify-center gap-2 px-8 py-3"
            >
              {createProductMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
