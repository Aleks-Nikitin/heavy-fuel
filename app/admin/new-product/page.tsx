"use client";

import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

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

  const handleCloudinaryUpload = () => {
    console.log("Trigger Cloudinary Upload Widget");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      categoryId,
      image: imageUrl,
      variants,
    };

    console.log("Submitting:", payload);
  };

  const inputStyles =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] " +
    "px-3 text-sm text-white placeholder:text-white/30 " +
    "outline-none transition-all " +
    "hover:border-white/20 " +
    "focus:border-[#CCFF00]/70 focus:ring-2 focus:ring-[#CCFF00]/10";

  const labelStyles = "block text-sm font-medium text-white/80";

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create New Product
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Add a new product, configure variants, and set pricing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 sm:p-6">
                <div>
                  <h2 className="text-lg font-semibold">General Information</h2>

                  <p className="mt-1 text-xs text-white/40">
                    Basic information displayed on the product page.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className={labelStyles}>Product Name</label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., 100% Gold Standard Whey"
                    className={`${inputStyles} h-11`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelStyles}>Description</label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe the product..."
                    className={`${inputStyles} resize-none py-3`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelStyles}>Category</label>

                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`${inputStyles} h-11 appearance-none`}
                  >
                    <option value="" className="bg-[#151515]">
                      Select a category...
                    </option>

                    <option value="cat_1" className="bg-[#151515]">
                      Protein Powders
                    </option>

                    <option value="cat_2" className="bg-[#151515]">
                      Pre-Workouts
                    </option>
                  </select>
                </div>
              </section>
              <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 sm:p-6">
                <div>
                  <h2 className="text-lg font-semibold">Product Options</h2>

                  <p className="mt-1 text-xs text-white/40">
                    Create the available flavors and sizes.
                  </p>
                </div>
                <div className="space-y-3">
                  <label className={labelStyles}>Flavors</label>

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
                      className={`${inputStyles} h-11`}
                    />

                    <button
                      type="button"
                      onClick={handleAddFlavor}
                      className="
                        h-11 shrink-0 rounded-xl
                        bg-[#CCFF00] px-5
                        text-sm font-bold text-black
                        transition-colors
                        hover:bg-[#b3e600]
                      "
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
                            inline-flex items-center gap-2
                            rounded-full border border-[#CCFF00]/20
                            bg-[#CCFF00]/10
                            px-3 py-1.5
                            text-sm font-medium text-[#CCFF00]
                          "
                        >
                          {flavor}

                          <button
                            type="button"
                            onClick={() => handleRemoveFlavor(flavor)}
                            className="
                              rounded-full p-0.5
                              text-[#CCFF00]/70
                              transition-colors
                              hover:bg-white/10 hover:text-white
                            "
                            aria-label={`Remove ${flavor}`}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-3 border-t border-white/10 pt-6">
                  <label className={labelStyles}>Sizes</label>

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
                      className={`${inputStyles} h-11`}
                    />

                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="
                        h-11 shrink-0 rounded-xl
                        bg-[#CCFF00] px-5
                        text-sm font-bold text-black
                        transition-colors
                        hover:bg-[#b3e600]
                      "
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
                            inline-flex items-center gap-2
                            rounded-full border border-[#CCFF00]/20
                            bg-[#CCFF00]/10
                            px-3 py-1.5
                            text-sm font-medium text-[#CCFF00]
                          "
                        >
                          {size}

                          <button
                            type="button"
                            onClick={() => handleRemoveSize(size)}
                            className="
                              rounded-full p-0.5
                              text-[#CCFF00]/70
                              transition-colors
                              hover:bg-white/10 hover:text-white
                            "
                            aria-label={`Remove ${size}`}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 sm:p-6">
                <div>
                  <h2 className="text-lg font-semibold">Product Image</h2>

                  <p className="mt-1 text-xs text-white/40">
                    Upload the primary product image.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloudinaryUpload}
                  className="
                    group flex min-h-56 w-full
                    flex-col items-center justify-center
                    overflow-hidden rounded-xl
                    border-2 border-dashed border-white/10
                    bg-white/[0.02] p-6
                    text-center
                    transition-all
                    hover:border-[#CCFF00]/50
                    hover:bg-[#CCFF00]/[0.03]
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
                          rounded-full
                          border border-white/10
                          bg-white/[0.06]
                          transition-all
                          group-hover:border-[#CCFF00]/30
                          group-hover:bg-[#CCFF00]/10
                        "
                      >
                        <Upload
                          size={22}
                          className="
                            text-white/50 transition-colors
                            group-hover:text-[#CCFF00]
                          "
                        />
                      </div>

                      <p className="text-sm font-medium text-white/80">
                        Click to upload image
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        Upload via Cloudinary
                      </p>
                    </>
                  )}
                </button>
              </section>
            </div>
          </div>

          {variants.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-xl shadow-black/10">
              <div className="p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Pricing & Inventory</h2>

                <p className="mt-1 text-sm text-white/40">
                  Set the price, stock, and SKU for each flavor and size
                  combination.
                </p>
              </div>

              <div className="overflow-x-auto border-t border-white/10">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-white/[0.035] text-xs uppercase tracking-wide text-white/40">
                    <tr>
                      {flavors.length > 0 && (
                        <th className="px-5 py-3.5 font-medium">Flavor</th>
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
                      <tr
                        key={variant.id}
                        className="
                          transition-colors
                          hover:bg-white/[0.025]
                        "
                      >
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
                            className={`${inputStyles} h-10 w-28`}
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
                            className={`${inputStyles} h-10 w-24`}
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
                            className={`${inputStyles} h-10 min-w-36`}
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
              className="
                rounded-xl
                bg-[#CCFF00]
                px-8 py-3
                text-sm font-bold text-black
                shadow-lg shadow-[#CCFF00]/5
                transition-all
                hover:bg-[#b3e600]
                hover:shadow-[#CCFF00]/10
                active:scale-[0.98]
              "
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
