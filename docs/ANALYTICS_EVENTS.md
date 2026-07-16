# Analytics Events

Frontend analytics events for Tutopt. Events are sent to Google Analytics 4 and Yandex Metrika when the corresponding env variables are set.

## Configuration

| Env variable | Purpose |
|--------------|---------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | Yandex Metrika counter ID |

If env variables are empty, all `track*` calls are **no-op** — the site works normally without analytics.

Scripts are loaded by `src/components/analytics/AnalyticsScripts.tsx` in the root layout.

## Helper

`src/lib/analytics/events.ts`

- `trackEvent(eventName, params?)` — base dispatcher
- Specialized helpers: `trackVerticalClick`, `trackSearch`, `trackListingView`, etc.

Requirements:
- Browser-only (`typeof window !== "undefined"`)
- Never throws to callers
- No PII in params

## Event catalog

| Event | Where fired | Params | PII risk |
|-------|-------------|--------|----------|
| `vertical_click` | `VerticalCards` (homepage, vertical page), catalog vertical chips | `vertical`, `source` | None |
| `search_submit` | `SearchWithSuggest` (header, hero), `ListingsCatalogToolbar` | `search_query` (max 80 chars), `search_length`, `has_query`, `vertical?` | Low — query only, trimmed |
| `listing_view` | `ListingViewTracker` on `/listings/[id]` | `listing_id`, `vertical?` | None |
| `favorite_add` | `FavoriteButton` after successful add | `listing_id`, `vertical?`, `is_active` | None |
| `favorite_remove` | `FavoriteButton` after successful remove | `listing_id`, `vertical?`, `is_active` | None |
| `create_listing_start` | `NewListingForm` on mount | `vertical` | None |
| `create_listing_submit` | `NewListingForm` after successful create | `vertical` | None |
| `lead_submit` | `ListingLeadForm` after successful submit | `vertical` | None |
| `seller_onboarding_start` | `SellerOnboardingForm` on mount | — | None |
| `seller_onboarding_complete` | `SellerOnboardingForm` after successful save | — | None |
| `moderation_approve` | `ModerationListingsTable` after successful approve | `vertical?`, `listing_id?` | None |
| `moderation_reject` | `ModerationListingsTable` after successful reject | `vertical?`, `listing_id?` | None |

### `source` values for `vertical_click`

- `homepage` — block «Выберите направление» on `/`
- `vertical_page` — «Направления платформы» on `/opt`, `/market`, etc.
- `catalog` — vertical filter chips on `/listings`

## PII policy

**Never sent in analytics events:**

- Phone numbers
- Email addresses
- User names / company names
- Lead message text
- Listing title / description / price
- Auth tokens or session data

**Allowed:**

- `listing_id` (UUID)
- `vertical` (OPT / MARKET / SERVICES / CARGO)
- Search query (trimmed, max 80 characters)
- Enum-like metadata (`source`, `is_active`)

## Google Analytics

When `window.gtag` is available:

```ts
window.gtag("event", eventName, params);
```

## Yandex Metrika

When `window.ym` is available and `NEXT_PUBLIC_YANDEX_METRIKA_ID` is set:

```ts
window.ym(counterId, "reachGoal", eventName, params);
```

## Related docs

- [`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md) — analytics env verification after deploy
- [`DEPLOY_WORKFLOW.md`](./DEPLOY_WORKFLOW.md) — env setup on Railway
