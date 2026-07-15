"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  FolderTree,
  Loader2,
  Package,
  Store,
  Tag,
} from "lucide-react";
import type { ReactNode } from "react";
import type { SearchSuggestResponse } from "@/features/search/lib/search-suggest-types";
import { hasSearchSuggestions } from "@/features/search/lib/search-suggest-types";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { cn } from "@/lib/utils";

type SearchSuggestDropdownProps = {
  id: string;
  query: string;
  isOpen: boolean;
  isLoading: boolean;
  suggestions: SearchSuggestResponse;
  onSelect: () => void;
  className?: string;
};

type SuggestGroupProps = {
  title: string;
  children: ReactNode;
};

function SuggestGroup({ title, children }: SuggestGroupProps) {
  return (
    <div className="py-1.5">
      <p className="px-3 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul>{children}</ul>
    </div>
  );
}

type SuggestItemProps = {
  href: string;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  onSelect: () => void;
};

function SuggestItem({ href, icon, title, subtitle, imageUrl, onSelect }: SuggestItemProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onSelect}
        className="flex items-center gap-2.5 px-3 py-2 transition hover:bg-accent"
      >
        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
          {imageUrl ? (
            <Image
              src={normalizeListingImageUrl(imageUrl)}
              alt=""
              width={36}
              height={36}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            icon
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">{title}</span>
          {subtitle ? (
            <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
          ) : null}
        </span>
      </Link>
    </li>
  );
}

export function SearchSuggestDropdown({
  id,
  query,
  isOpen,
  isLoading,
  suggestions,
  onSelect,
  className,
}: SearchSuggestDropdownProps) {
  if (!isOpen || query.trim().length < 2) {
    return null;
  }

  const hasResults = hasSearchSuggestions(suggestions);

  return (
    <div
      id={id}
      role="listbox"
      aria-label="Подсказки поиска"
      className={cn(
        "absolute left-0 top-[calc(100%+8px)] z-40 flex w-full max-w-full flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xl",
        "max-h-[280px] md:max-h-[360px]",
        className,
      )}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-3 py-5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Поиск...
          </div>
        ) : !hasResults ? (
          <p className="px-3 py-5 text-center text-sm text-muted-foreground">Ничего не найдено</p>
        ) : (
          <>
            {suggestions.listings.length > 0 ? (
              <SuggestGroup title="Объявления">
                {suggestions.listings.map((listing) => (
                  <SuggestItem
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    icon={<Package className="size-4" aria-hidden="true" />}
                    imageUrl={listing.imageUrl}
                    title={listing.title}
                    subtitle={listing.priceLabel}
                    onSelect={onSelect}
                  />
                ))}
              </SuggestGroup>
            ) : null}

            {suggestions.categories.length > 0 ? (
              <SuggestGroup title="Категории">
                {suggestions.categories.map((category) => (
                  <SuggestItem
                    key={category.id}
                    href={`/listings?category=${encodeURIComponent(category.id)}`}
                    icon={<FolderTree className="size-4" aria-hidden="true" />}
                    title={category.name}
                    onSelect={onSelect}
                  />
                ))}
              </SuggestGroup>
            ) : null}

            {suggestions.brands.length > 0 ? (
              <SuggestGroup title="Бренды">
                {suggestions.brands.map((brand) => (
                  <SuggestItem
                    key={brand.id}
                    href={`/listings?brand=${encodeURIComponent(brand.id)}`}
                    icon={<Tag className="size-4" aria-hidden="true" />}
                    title={brand.name}
                    onSelect={onSelect}
                  />
                ))}
              </SuggestGroup>
            ) : null}

            {suggestions.sellers.length > 0 ? (
              <SuggestGroup title="Поставщики">
                {suggestions.sellers.map((seller) => (
                  <SuggestItem
                    key={seller.id}
                    href={`/seller/${seller.id}`}
                    icon={<Store className="size-4" aria-hidden="true" />}
                    title={seller.companyName}
                    onSelect={onSelect}
                  />
                ))}
              </SuggestGroup>
            ) : null}
          </>
        )}
      </div>

      {!isLoading && hasResults ? (
        <div className="shrink-0 border-t bg-white px-3 py-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="size-3.5" aria-hidden="true" />
            Нажмите Enter для полного поиска
          </span>
        </div>
      ) : null}
    </div>
  );
}
