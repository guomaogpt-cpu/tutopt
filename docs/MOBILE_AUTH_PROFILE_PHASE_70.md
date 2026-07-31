# Phase 70 — Mobile auth and profile UX

## 1. Mobile login / register

- Compact auth shell: logo on mobile, brand panel only from `lg`
- Denser form cards, larger touch inputs (`h-12` on phones)
- Login order: title → phone → password → submit → Google (if enabled) → register link
- Register: role, name, OTP phone flow, password, submit, Google, login link
- Friendly error sanitization (no Prisma/stack dumps)

## 2. OTP UX

`PhoneOtpFields` (unchanged backend):

- Clear send / resend with cooldown
- Large numeric code field on mobile
- i18n: code sent, enter SMS code, resend, invalid/expired code
- Errors shown next to the field

## 3. Return URL (`next`)

Existing safe internal redirect via `resolveNextParam` / `isSafeInternalPath`:

- Login & register preserve `?next=`
- Google OAuth receives the same `next`
- Seller onboarding preserves safe `next` after phone verify
- Open redirects to external sites remain blocked

## 4. Profile tab (bottom nav)

`getMobileProfileHref`:

| User | Target |
| --- | --- |
| Guest | `/login` |
| Buyer | `/buyer/dashboard` |
| Seller | `/seller/dashboard` |
| Admin / Moderator | `/admin` |

Roles and auth architecture unchanged.

## 5. Buyer / seller dashboards (mobile)

- Tighter vertical spacing
- Buyer: quick actions (favorites, notifications, leads, post) near the top, 2×2 grid
- Seller: quick actions earlier; stats still available
- Dark-mode friendly surfaces

## 6. What did not change

- Prisma schema / migrations
- Auth architecture, roles, session model
- OTP backend / Google OAuth protocols
- Seller onboarding API contract

## 7. Known gaps

- Later: richer password-reset UX
- Later: biometric login in a native app
- Later: push notification permission flow
- Later: stronger account security (2FA beyond SMS OTP)
