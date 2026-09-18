import { z } from "zod";
export const variantImageSchema = z.object({
  variant: z.string().trim().min(1),
  image: z.string().trim().url(),
  imagePublicId: z.string().trim().min(1),
});
export const productVariantSchema = z.object({
  flavor: z.string().trim().min(1, "Variant is required"),

  size: z.string().trim().min(1, "Size is required"),

  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine(
      (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
      "Price must be greater than 0",
    ),

  stock: z
    .string()
    .trim()
    .min(1, "Stock is required")
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
      "Stock must be a non-negative whole number",
    ),

  sku: z.string().trim(),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000),

  categoryId: z.string().trim().min(1, "Please select a category"),

  image: z.string().trim().url("Product image must be a valid URL"),

  imagePublicId: z.string().trim().min(1),

  variantImages: z
    .array(variantImageSchema)
    .min(1, "Upload at least one variant image"),

  variants: z
    .array(productVariantSchema)
    .min(1, "Add at least one product variant"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
