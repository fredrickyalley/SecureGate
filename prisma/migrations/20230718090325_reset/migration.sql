/*
  Warnings:

  - Added the required column `resetToken` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resetTokenExpiration` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetToken" TEXT NOT NULL,
ADD COLUMN     "resetTokenExpiration" TEXT NOT NULL;
