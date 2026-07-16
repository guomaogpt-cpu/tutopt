# Phase 11 — Stabilization notes

После Phases 1–10: без новых крупных features. Готовность к commit/deploy.

## Railway после push

1. `npx prisma migrate deploy` — обязательно (миграция `20260715093645_add_listing_verticals` уже в репо).
2. `npm run db:seed` — если нужны категории MARKET/SERVICES/CARGO (upsert, без удаления данных).
3. Env: `UPLOAD_DIR`, Google OAuth, OTP — **не менялись** в этих фазах.

## Известные gaps (не блокеры commit)

- `/seller/settings` нет (есть onboarding).
- Reject reason UI нет (поле schema есть).
- Label copy частично дублируется вне `verticals.ts`.
- Публичные `/seller/[id]` не в sitemap.
