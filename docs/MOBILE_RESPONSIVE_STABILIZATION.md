# Mobile / Responsive Stabilization — Phase 46

Дата: 2026-07-22  
UI freeze: только критические overflow / wrap / touch-safe правки. Без редизайна.

## 1. Страницы в scope (код-аудит)

### Public
`/`, `/listings`, `/listings/[id]`, `/opt`, `/market`, `/services`, `/cargo`, `/seller/[id]`

### Auth
`/login`, `/register`, `/seller/onboarding`

### Buyer
`/buyer/dashboard`, `/favorites`, `/notifications`  
`/compare` — отсутствует (нет UI-ссылок)

### Seller
`/seller/dashboard`, `/seller/listings`, `/seller/leads`, `/listings/new`, `/listings/[id]/edit`

### Admin
`/admin`, `/admin/users`, `/admin/moderation/listings`, `/admin/reports`, `/admin/audit`

## 2. Найденные mobile проблемы

1. Header: широкий logo + action buttons → риск horizontal scroll на ~320px  
2. CategoryPicker: `whitespace-nowrap` на кнопках в `grid-cols-2` → overflow длинных имён  
3. Seller listing actions: `grid-cols-2` + nowrap labels → squeeze/overflow  
4. AdminAuditTable filters: fixed widths без wrap на tablet  
5. Home listings grid: нет 1-col fallback на очень узких экранах  
6. Listing title/description: длинные строки без `break-words`

## 3. Что исправлено

| Area | Fix |
|------|-----|
| Header / BrandLogo | Mobile: меньший max-width (`max-w-[min(55vw,180px)]`), чуть ниже bar; desktop sizes сохранены с `md:`/`lg:` |
| CategoryPicker | `min-w-0 whitespace-normal break-words` на плитках |
| SellerListingManageCard | 1 col &lt;380px, 2 col шире; `whitespace-normal` на actions |
| AdminAuditTable | `flex-wrap`, fluid select widths, search `min-w-0` |
| HomeListingsSection | `max-[339px]:grid-cols-1` |
| Listing detail h1 | `break-words` |
| ListingDescription | `break-words` |

## 4. Tables / overflow

Уже имели `overflow-x-auto`:
- `AdminUsersTable`
- `AdminAuditTable` (data table)
- AdminNav, moderation/report tabs

Phase 46: filter bar audit table больше не выталкивает layout.

## 5. Forms

- CategoryPicker (create/edit) — overflow fixed  
- Catalog search already `flex-col` + full-width mobile button  
- Auth layouts already stack on mobile  

## 6. Known gaps

1. Admin tables remain wide (intentional scroll) — usable, not phone-perfect  
2. `/compare` not built  
3. Touch target audit not exhaustive  
4. No browser device matrix in this phase  

## 7. Smoke later (manual)

- [ ] iPhone SE / 375px: header без horizontal scroll  
- [ ] Homepage cards 1–2 cols, no overflow  
- [ ] `/listings` filters + search  
- [ ] Listing detail title wrap + lead form  
- [ ] Create listing category tiles  
- [ ] Seller listings action buttons  
- [ ] Admin audit filters + table scroll  
- [ ] Favorites / notifications wrap  

## Phase 46 policy

Desktop header look and logo asset unchanged for `md+`.  
No vertical color / card redesign.
