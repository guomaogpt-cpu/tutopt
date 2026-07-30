# Home discovery — Phase 63

## 1. Blocks added on `/`

After the marketplace entry (directions + search):

1. **New listings** — latest published listings across all verticals
2. **Popular in listings** — MARKET by `view_count`, then recency
3. **Wholesale offers** — latest OPT
4. **Services** — latest SERVICES
5. **Cargo and delivery** — latest CARGO
6. **Trending searches** — static i18n tags → `/listings?q=...`
7. **Why VseTut** — compact trust/value cards
8. **Seller CTA** — post listing

## 2. How listings are selected

`getHomePageData()` loads only `PUBLISHED` + non-expired listings via existing `listingCardSelect` (public card fields only).

Queries are parallel and limited (latest ~10, sections ~6 each). No private contacts or moderation fields.

## 3. Sections shown

| Block | Source | View all |
| --- | --- | --- |
| Latest | all verticals | `/listings` |
| Popular market | MARKET + views | `/market` |
| Wholesale | OPT | `/opt` |
| Services | SERVICES | `/services` |
| Cargo | CARGO | `/cargo` |

## 4. When listings are scarce

Empty sections show a compact empty state, optional category chips, and “Post a listing”.
They do not leave large blank regions.

## 5. Unchanged

- Prisma schema / migrations
- Auth architecture
- Uploads architecture
- Photo search
- Ordinary text search

## 6. Future improvements

- Real trending searches from analytics
- Personalized recommendations
- View/engagement-based ranking across all verticals
- Promoted listings later
