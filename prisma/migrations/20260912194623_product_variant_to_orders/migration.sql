/*
  Warnings:

  - You are about to drop the column `products` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "products";

-- CreateTable
CREATE TABLE "_OrderToProductVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderToProductVariant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderToProductVariant_B_index" ON "_OrderToProductVariant"("B");

-- AddForeignKey
ALTER TABLE "_OrderToProductVariant" ADD CONSTRAINT "_OrderToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProductVariant" ADD CONSTRAINT "_OrderToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
