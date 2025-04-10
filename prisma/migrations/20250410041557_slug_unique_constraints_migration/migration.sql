/*
  Warnings:

  - You are about to drop the column `is_active` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `Tenant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenant_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "is_active",
DROP COLUMN "metadata",
DROP COLUMN "owner_id",
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" DEFAULT 'VIEWER',
ADD COLUMN     "tenant_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
