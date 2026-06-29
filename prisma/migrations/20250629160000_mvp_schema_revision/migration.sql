-- MVP schema revision: cities, brands, contact analytics, remove banners, simplify ListingStatus

-- Migrate ListingStatus.PENDING -> PENDING_MODERATION before enum change
UPDATE "listings" SET "status" = 'PENDING_MODERATION' WHERE "status" = 'PENDING';

-- Remove Banner (deferred from MVP)
DROP TABLE IF EXISTS "banners";
DROP TYPE IF EXISTS "BannerPlacement";

-- Replace ListingStatus enum (remove PENDING)
ALTER TYPE "ListingStatus" RENAME TO "ListingStatus_old";
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING_MODERATION', 'PUBLISHED', 'REJECTED', 'ARCHIVED');
ALTER TABLE "listings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "listings"
  ALTER COLUMN "status" TYPE "ListingStatus"
  USING ("status"::text::"ListingStatus");
ALTER TABLE "listings" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
DROP TYPE "ListingStatus_old";

-- Contact event type enum
CREATE TYPE "ContactEventType" AS ENUM ('PHONE', 'WHATSAPP', 'TELEGRAM');

-- Cities
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "region_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "cities_slug_key" ON "cities"("slug");
CREATE INDEX "cities_region_id_idx" ON "cities"("region_id");

ALTER TABLE "cities"
  ADD CONSTRAINT "cities_region_id_fkey"
  FOREIGN KEY ("region_id") REFERENCES "regions"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Brands
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(170) NOT NULL,
    "logo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- Seller profile contacts and city
ALTER TABLE "seller_profiles" ADD COLUMN "whatsapp" VARCHAR(50);
ALTER TABLE "seller_profiles" ADD COLUMN "telegram" VARCHAR(100);
ALTER TABLE "seller_profiles" ADD COLUMN "website" VARCHAR(255);
ALTER TABLE "seller_profiles" ADD COLUMN "city_id" UUID;

CREATE INDEX "seller_profiles_city_id_idx" ON "seller_profiles"("city_id");

ALTER TABLE "seller_profiles"
  ADD CONSTRAINT "seller_profiles_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "cities"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Listing city and brand
ALTER TABLE "listings" ADD COLUMN "city_id" UUID;
ALTER TABLE "listings" ADD COLUMN "brand_id" UUID;

CREATE INDEX "listings_city_id_idx" ON "listings"("city_id");
CREATE INDEX "listings_brand_id_idx" ON "listings"("brand_id");

ALTER TABLE "listings"
  ADD CONSTRAINT "listings_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "cities"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "listings"
  ADD CONSTRAINT "listings_brand_id_fkey"
  FOREIGN KEY ("brand_id") REFERENCES "brands"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- User listing view history
CREATE TABLE "user_listing_views" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "viewed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_listing_views_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_listing_views_user_id_idx" ON "user_listing_views"("user_id");
CREATE INDEX "user_listing_views_listing_id_idx" ON "user_listing_views"("listing_id");

ALTER TABLE "user_listing_views"
  ADD CONSTRAINT "user_listing_views_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_listing_views"
  ADD CONSTRAINT "user_listing_views_listing_id_fkey"
  FOREIGN KEY ("listing_id") REFERENCES "listings"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Category subscriptions
CREATE TABLE "category_subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "category_subscriptions_user_id_category_id_key"
  ON "category_subscriptions"("user_id", "category_id");
CREATE INDEX "category_subscriptions_user_id_idx" ON "category_subscriptions"("user_id");
CREATE INDEX "category_subscriptions_category_id_idx" ON "category_subscriptions"("category_id");

ALTER TABLE "category_subscriptions"
  ADD CONSTRAINT "category_subscriptions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "category_subscriptions"
  ADD CONSTRAINT "category_subscriptions_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "categories"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Email verification tokens
CREATE TABLE "email_verification_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMPTZ,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_verification_tokens_token_key" ON "email_verification_tokens"("token");
CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens"("user_id");
CREATE INDEX "email_verification_tokens_expires_at_idx" ON "email_verification_tokens"("expires_at");

ALTER TABLE "email_verification_tokens"
  ADD CONSTRAINT "email_verification_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Listing contact events (analytics)
CREATE TABLE "listing_contact_events" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "user_id" UUID,
    "type" "ContactEventType" NOT NULL,
    "ip_hash" VARCHAR(64),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_contact_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "listing_contact_events_listing_id_idx" ON "listing_contact_events"("listing_id");
CREATE INDEX "listing_contact_events_type_idx" ON "listing_contact_events"("type");
CREATE INDEX "listing_contact_events_created_at_idx" ON "listing_contact_events"("created_at");

ALTER TABLE "listing_contact_events"
  ADD CONSTRAINT "listing_contact_events_listing_id_fkey"
  FOREIGN KEY ("listing_id") REFERENCES "listings"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "listing_contact_events"
  ADD CONSTRAINT "listing_contact_events_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
