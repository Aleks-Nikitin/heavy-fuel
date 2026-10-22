-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "productIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
