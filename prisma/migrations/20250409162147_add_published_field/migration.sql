/*
  Warnings:

  - You are about to drop the column `slug` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `User` table. All the data in the column will be lost.
  - Made the column `published_at` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenant_id_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "slug",
DROP COLUMN "status",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "published_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tenant_id",
ALTER COLUMN "name" SET NOT NULL;
