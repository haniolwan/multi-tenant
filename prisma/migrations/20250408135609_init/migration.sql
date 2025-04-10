/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_tenant_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "tenant_id";
