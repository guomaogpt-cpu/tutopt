# Security / Anti-spam Stabilization — Phase 48

Дата: 2026-07-22  
UI freeze. Без schema/migration, без смены auth/uploads architecture.

Дополняет `docs/SECURITY_AND_ANTISPAM.md` (Phase 15 base).

## 1. Protected write actions

Все мутации — API routes (нет `"use server"` actions). Identity из session (`requireAuth` / `requireAdmin` / `requireStaff`), не из client body.

| Area | Routes |
|------|--------|
| Auth | login, register, logout, OTP send/verify, forgot/reset password |
| Listings | create, patch, renew, lifecycle (archive/restore) |
| Leads | POST leads |
| Favorites | POST/DELETE |
| Reports | POST |
| Uploads | POST listing-images |
| Notifications | mark read / read-all |
| Seller | onboarding, upgrade |
| Admin | moderation, reports, role, restrictions |

## 2. Role / ownership

- Seller listing mutations: owner (`sellerProfile.user_id === session.user.id`); non-owner → 404
- Buyer cannot create/edit/upload (role gate)
- Admin role change / restrictions: **ADMIN only**
- Listing moderation / report resolve: **staff** (ADMIN \| MODERATOR)
- Notifications: scoped by `recipient_id`
- Blocked users: `getCurrentUser` → null → auth fails

## 3. User restrictions

| Action | Enforcement |
|--------|-------------|
| Create listing | `getCreateListingRestrictionMessage` |
| Edit listing | `getEditListingRestrictionMessage` |
| Renew | listing restriction + blocked |
| Restore | listing restriction + blocked |
| Archive | blocked only (can still take down) |
| Leads | `getLeadRestrictionMessage` |
| Uploads | same as create listing restriction |
| Reports | blocked excluded via session; no separate report restriction field |

## 4. Rate limit policy (in-memory)

Файл: `src/lib/security/rate-limit.ts` + IP helper `client-ip.ts`

| Action | Limit |
|--------|-------|
| Listing create | 10 / user / hour |
| Listing update | 30 / user / hour |
| Lead | 20 / user / hour + 5 / user+listing / 10 min |
| Report | 10 / user / hour |
| OTP send | 5 / phone / 15 min + 20 / IP / hour (+ existing 60s cooldown) |
| OTP verify | 20 / phone / 15 min + 40 / IP / hour (+ 5 attempts / code) |
| Login | 10 / phone / 15 min + 30 / IP / hour |
| Register | 5 / IP / hour |
| Forgot password | 5 / email / hour + 10 / IP / hour |
| Reset password | 10 / IP / hour |
| Upload | 60 / user / hour |
| Favorite toggle | 60 / user / hour |

**Caveat:** in-memory only — not shared across Railway instances; resets on restart. Production later: Redis/Upstash or DB limiter.

## 5. OTP security notes

- Code stored as SHA-256 hash; verify uses `timingSafeEqual`
- Empty/invalid code rejected by Zod + server regex
- Production: OTP not printed to console; `DEMO_OTP_ENABLED` returns code in API body only — **temporary testing risk**, disable before real users
- `OTP_SECRET` preferred; falls back to `DATABASE_URL` (documented gap)

## 6. Input validation

Zod on auth/listings/leads/reports/admin payloads (unchanged architecture). Content checks on listing title/description. Lead duplicate window 10 min. Listing duplicate check 24h.

## 7. Upload security

- Auth: SELLER \| ADMIN + listing restriction
- MIME whitelist: jpeg/png/webp; **magic-byte check** must match declared type
- Max 5 MB; server-generated filename; path traversal blocked on serve route
- No SVG upload

## 8. XSS / content rendering

- User text rendered as React text (no raw HTML for descriptions)
- JSON-LD via `serializeJsonLd` (escapes `<` → `\u003c`) for listing + SEO landing scripts

## 9. Notification ownership

Mark-read / mark-all-read filter by session `recipient_id` — verified OK.

## 10. Audit log safety

`createAuditLog` swallows errors (try/catch); metadata is primitive fields only (no passwords/OTP/tokens). Admin audit UI is ADMIN-gated.

## 11. Known gaps

1. Production-grade Redis/DB rate limit
2. CSRF/Origin hardening beyond `SameSite=lax` httpOnly cookies
3. No unique DB constraint for duplicate reports (rate limit only)
4. Client MIME still declared; magic bytes mitigate mismatch
5. Forgot-password email delivery not wired (token created; no email send)
6. Soft-delete listing beyond ARCHIVED — not a separate flow

## 12. Smoke later (manual)

- [ ] Login brute → 429 after limit
- [ ] OTP send spam → cooldown + 429
- [ ] Restricted seller: create/edit/upload/renew blocked; archive still OK
- [ ] Non-owner PATCH listing → 404
- [ ] Upload non-image / spoofed MIME → rejected
- [ ] DEMO_OTP_ENABLED=false in real prod
- [ ] JSON-LD title with `<` does not break page
- [ ] Mark another user’s notification → 404

## Phase 48 policy

No Prisma migration. No UI redesign. No auth/uploads architecture rewrite.
