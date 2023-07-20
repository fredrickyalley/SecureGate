-- AlterTable
ALTER TABLE "users" ALTER COLUMN "resetToken" DROP NOT NULL,
ALTER COLUMN "resetTokenExpiration" DROP NOT NULL;
