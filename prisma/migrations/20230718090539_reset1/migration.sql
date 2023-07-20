/*
  Warnings:

  - Changed the type of `resetTokenExpiration` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "resetTokenExpiration",
ADD COLUMN     "resetTokenExpiration" TIMESTAMP(3) NOT NULL;
