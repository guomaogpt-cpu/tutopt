-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('STORE', 'SUPPLIER', 'SERVICE', 'CARGO', 'OTHER');

-- AlterTable
ALTER TABLE "seller_profiles" ADD COLUMN "company_type" "CompanyType";

-- AlterTable
ALTER TABLE "listings" ADD COLUMN "posted_as_company" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "seller_profiles_company_type_idx" ON "seller_profiles"("company_type");
