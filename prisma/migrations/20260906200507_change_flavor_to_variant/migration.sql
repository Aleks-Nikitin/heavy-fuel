/*
  Warnings:

  - You are about to drop the column `flavor` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `variant` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "flavor",
ADD COLUMN     "variant" TEXT NOT NULL;
