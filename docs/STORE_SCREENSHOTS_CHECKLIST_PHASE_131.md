# Store Screenshots Checklist — Phase 131

> Подготовить скриншоты **вручную** на real device или emulator. Не генерировать автоматически в этой фазе.

---

## Общие правила

| Rule | Detail |
|---|---|
| Тестовые данные | Использовать только тестовые объявления, имена, телефоны |
| Не показывать | Реальные телефоны клиентов, email, адреса, паспортные данные |
| Не показывать | Admin panel, debug labels, raw errors, shell output |
| Разрешение | Минимум 1080×1920 или актуальное соотношение устройства |
| Язык UI | Русский (основной) |
| Статус-бар | Чистый, без лишних уведомлений |

**Phase 134-pre / 134:** делать screenshots **только на свежей версии** после hotfix (search, listing create, company page, account nav). Не использовать скриншоты со старого AAB.

**Privacy:**
- Не показывать реальные телефоны клиентов
- Не показывать реальные персональные данные
- Использовать тестовые объявления и тестовый аккаунт

---

## Android (Google Play)

Минимум **2** скриншота, рекомендуется **6–8**.

| # | Экран | Route | Должно быть видно | Не должно быть |
|---|---|---|---|---|
| 1 | Главная | `/` | Logo, search, 2×2 разделы, новые объявления | Welcome card, duplicate search, debug |
| 2 | Поиск / список | `/listings` | Карточки, фильтры, search query | Пустая выдача без контекста |
| 3 | Страница объявления | `/listings/[id]` | Фото, цена, название, «Связаться» | Real client phone in lead history |
| 4 | Подача объявления | `/listings/new` | Форма, категория, фото upload | npm errors, API keys |
| 5 | Заявки | `/account/requests` | Received/sent tabs, status chips | Чужие заявки |
| 6 | Кабинет | `/account` | Моя активность, profile | Overloaded debug blocks |
| 7 | Карго | `/cargo` | Hero, create request CTA | Telegram tokens, internal URLs |

**Optional:**
- Избранное `/favorites`
- Уведомления `/notifications`
- Мои объявления `/account/listings`

---

## Feature graphic (1024×500)

- Название «ВсеТут»
- Tagline: «Объявления, услуги, опт и карго»
- Без мелкого текста
- Без чужих брендов

---

## App icon

- 512×512 (Play listing)
- 1024×1024 (high-res marketing)
- Source: `/public/icons/icon-512.png`, `/public/icons/icon-192.png`

---

## iOS / TestFlight (future)

| # | Экран | Notes |
|---|---|---|
| 1 | Главная | Same as Android #1 |
| 2 | Поиск | Same as Android #2 |
| 3 | Объявление | Same as Android #3 |
| 4 | Подать объявление | Same as Android #4 |
| 5 | Кабинет | Same as Android #6 |

App Store требует screenshots per device class (6.7", 6.5", 5.5" etc.) — подготовить после iOS project.

---

## Pre-capture checklist

- [ ] Test account logged in
- [ ] Test listings published (no real PII)
- [ ] Dark mode off (unless marketing wants dark)
- [ ] Bottom nav visible where expected
- [ ] No keyboard covering key UI
- [ ] Status bar time/battery normal

---

## Связанные документы

- `docs/GOOGLE_PLAY_INTERNAL_TESTING_PHASE_134.md`
- `docs/STORE_LISTING_TEXTS_PHASE_131.md`
- `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`
- `docs/IOS_TESTFLIGHT_PREP_PHASE_131.md`
