-- PostgreSQL extensions (docs/04_DATABASE.md)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BUYER', 'SELLER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING', 'PENDING_MODERATION', 'PUBLISHED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ListingUnit" AS ENUM ('PIECE', 'PACK', 'BOX', 'KG', 'LITER', 'PALLET');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'VIEWED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'FRAUD', 'WRONG_CATEGORY', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('REGISTRATION', 'LICENSE', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BannerPlacement" AS ENUM ('HOME_HERO', 'HOME_MIDDLE', 'CATEGORY_TOP');

-- CreateTable
CREATE TABLE "regions" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'BUYER',
    "name" VARCHAR(100) NOT NULL,
    "avatar_url" TEXT,
    "city" VARCHAR(100),
    "region_id" UUID,
    "email_verified_at" TIMESTAMPTZ,
    "phone_verified_at" TIMESTAMPTZ,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "company_name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "inn" VARCHAR(20),
    "legal_address" TEXT,
    "contact_phone" VARCHAR(20) NOT NULL,
    "contact_email" VARCHAR(255),
    "region_id" UUID NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_pro" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMPTZ,
    "rating_avg" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "seller_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_documents" (
    "id" UUID NOT NULL,
    "seller_profile_id" UUID NOT NULL,
    "file_url" TEXT NOT NULL,
    "doc_type" "DocumentType" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_by" UUID,
    "review_note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "parent_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(170) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(50),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "listings_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" UUID NOT NULL,
    "seller_profile_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "region_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(250) NOT NULL,
    "short_id" VARCHAR(8) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'KGS',
    "price_negotiable" BOOLEAN NOT NULL DEFAULT false,
    "unit" "ListingUnit" NOT NULL,
    "moq" INTEGER NOT NULL DEFAULT 1,
    "stock_quantity" INTEGER,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "rejection_reason" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "contact_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMPTZ,
    "expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_images" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_attributes" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" VARCHAR(500) NOT NULL,

    CONSTRAINT "listing_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "seller_profile_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "message" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewed_at" TIMESTAMPTZ,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "reporter_id" UUID NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "comment" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "resolved_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_views" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "viewed_at" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "listing_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "image_url" TEXT NOT NULL,
    "link_url" TEXT NOT NULL,
    "placement" "BannerPlacement" NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "starts_at" TIMESTAMPTZ,
    "ends_at" TIMESTAMPTZ,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_pages" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "meta_title" VARCHAR(70) NOT NULL,
    "meta_description" VARCHAR(160) NOT NULL,
    "content" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "seo_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "regions_slug_key" ON "regions"("slug");

-- CreateIndex
CREATE INDEX "regions_sort_order_idx" ON "regions"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "seller_profiles_user_id_key" ON "seller_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "seller_profiles_slug_key" ON "seller_profiles"("slug");

-- CreateIndex
CREATE INDEX "seller_profiles_slug_idx" ON "seller_profiles"("slug");

-- CreateIndex
CREATE INDEX "seller_profiles_region_id_idx" ON "seller_profiles"("region_id");

-- CreateIndex
CREATE INDEX "seller_profiles_is_verified_idx" ON "seller_profiles"("is_verified");

-- CreateIndex
CREATE INDEX "seller_documents_seller_profile_id_idx" ON "seller_documents"("seller_profile_id");

-- CreateIndex
CREATE INDEX "seller_documents_status_idx" ON "seller_documents"("status");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_sort_order_idx" ON "categories"("sort_order");

-- CreateIndex
CREATE INDEX "listings_status_published_at_idx" ON "listings"("status", "published_at" DESC);

-- CreateIndex
CREATE INDEX "listings_category_id_status_idx" ON "listings"("category_id", "status");

-- CreateIndex
CREATE INDEX "listings_seller_profile_id_idx" ON "listings"("seller_profile_id");

-- CreateIndex
CREATE INDEX "listings_region_id_status_idx" ON "listings"("region_id", "status");

-- CreateIndex
CREATE INDEX "listings_price_idx" ON "listings"("price");

-- CreateIndex
CREATE UNIQUE INDEX "listings_slug_short_id_key" ON "listings"("slug", "short_id");

-- CreateIndex
CREATE INDEX "listing_images_listing_id_idx" ON "listing_images"("listing_id");

-- CreateIndex
CREATE INDEX "listing_attributes_listing_id_idx" ON "listing_attributes"("listing_id");

-- CreateIndex
CREATE INDEX "favorites_user_id_idx" ON "favorites"("user_id");

-- CreateIndex
CREATE INDEX "favorites_listing_id_idx" ON "favorites"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_listing_id_key" ON "favorites"("user_id", "listing_id");

-- CreateIndex
CREATE INDEX "leads_seller_profile_id_status_idx" ON "leads"("seller_profile_id", "status");

-- CreateIndex
CREATE INDEX "leads_buyer_id_idx" ON "leads"("buyer_id");

-- CreateIndex
CREATE INDEX "leads_listing_id_idx" ON "leads"("listing_id");

-- CreateIndex
CREATE INDEX "reports_listing_id_idx" ON "reports"("listing_id");

-- CreateIndex
CREATE INDEX "reports_reporter_id_idx" ON "reports"("reporter_id");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "listing_views_listing_id_idx" ON "listing_views"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "listing_views_listing_id_viewed_at_key" ON "listing_views"("listing_id", "viewed_at");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expires_at_idx" ON "password_reset_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "banners_placement_is_active_sort_order_idx" ON "banners"("placement", "is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "seo_pages_slug_key" ON "seo_pages"("slug");

-- CreateIndex
CREATE INDEX "seo_pages_is_published_idx" ON "seo_pages"("is_published");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_profiles" ADD CONSTRAINT "seller_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_profiles" ADD CONSTRAINT "seller_profiles_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_documents" ADD CONSTRAINT "seller_documents_seller_profile_id_fkey" FOREIGN KEY ("seller_profile_id") REFERENCES "seller_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_documents" ADD CONSTRAINT "seller_documents_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_seller_profile_id_fkey" FOREIGN KEY ("seller_profile_id") REFERENCES "seller_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_attributes" ADD CONSTRAINT "listing_attributes_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_seller_profile_id_fkey" FOREIGN KEY ("seller_profile_id") REFERENCES "seller_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_views" ADD CONSTRAINT "listing_views_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Custom constraints and search indexes (docs/04_DATABASE.md)
ALTER TABLE "users"
ADD CONSTRAINT "users_email_or_phone_required"
CHECK ("email" IS NOT NULL OR "phone" IS NOT NULL);

CREATE INDEX "listings_search_gin_idx"
ON "listings"
USING GIN (to_tsvector('russian', "title" || ' ' || "description"));

CREATE INDEX "listings_title_trgm_idx"
ON "listings"
USING GIN ("title" gin_trgm_ops);
