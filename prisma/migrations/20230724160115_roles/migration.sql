/*
  Warnings:

  - The primary key for the `RoleUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RoleUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoleUser" DROP CONSTRAINT "RoleUser_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "RoleUser_pkey" PRIMARY KEY ("userId", "roleId");
