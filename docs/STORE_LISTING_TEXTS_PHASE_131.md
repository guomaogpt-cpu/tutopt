# Store Listing Texts — Phase 131

> Тексты для Google Play и будущего App Store. **Не публиковать автоматически** — скопировать в Console вручную после финальной проверки.

---

## App name

**ВсеТут**

---

## Short description (≤80 символов)

```
ВсеТут — объявления, услуги, опт и карго в одном приложении.
```

Character count: ~56

---

## Full description (русский)

```
ВсеТут — маркетплейс объявлений, услуг, оптовых предложений и карго-заявок в Кыргызстане.

Что можно делать:
• Просматривать объявления — товары, услуги, опт
• Искать по названию и фильтрам
• Отправлять заявки продавцам по интересующим объявлениям
• Публиковать свои объявления
• Управлять объявлениями в личном кабинете
• Следить за полученными и отправленными заявками
• Добавлять объявления в избранное
• Оставлять карго-заявки на перевозку
• Жаловаться на объявления, нарушающие правила

Разделы:
• Объявления — товары и предложения
• Услуги — специалисты и сервисы
• Опт — оптовые предложения
• Карго — заявки на перевозку

Безопасность:
• Модерация объявлений
• Жалобы на нарушения
• Поддержка пользователей

ВсеТут — площадка для связи между пользователями. Платформа не является стороной сделок между покупателями и продавцами.
```

---

## Что НЕ обещать в описании

- ❌ Оплата внутри приложения
- ❌ Доставка и гарантия сделки
- ❌ Встроенный чат
- ❌ Push-уведомления (если не включены в production)
- ❌ AI-поиск / photo search (если не в production)
- ❌ iOS версия (пока не опубликована)

---

## Keywords (для ASO notes)

```
объявления, маркетплейс, услуги, опт, карго, Кырgyzstan, Bishkek, бишкек, продажа, покупка, заявки, объявления кг
```

---

## App category suggestion

| Store | Category |
|---|---|
| Google Play | Shopping / Business (primary: Shopping) |
| App Store (future) | Shopping |

---

## Content rating notes

- User-generated content (listings, photos)
- Contact between users (requests/leads)
- No in-app purchases in current version
- Report/moderation flow available

---

## URLs (production)

| Field | URL |
|---|---|
| Privacy Policy | https://tutopt-production.up.railway.app/privacy |
| Terms | https://tutopt-production.up.railway.app/terms |
| Support | https://tutopt-production.up.railway.app/support |
| Account deletion | https://tutopt-production.up.railway.app/delete-account |
| Website | https://tutopt-production.up.railway.app |

---

## Google Play draft checklist

| Item | Status | Source |
|---|---|---|
| App name | ВсеТут | This doc |
| Short description (≤80) | Ready | § Short description |
| Full description | Ready | § Full description |
| App icon 512×512 | Ready | `/public/icons/icon-512.png` |
| Feature graphic 1024×500 | Manual | Design — optional for first internal |
| Phone screenshots | Manual | `STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md` |
| Privacy Policy URL | Live | production `/privacy` |
| Support email/contact | Confirm | `/support` page |
| App category | Shopping | § App category suggestion |
| Content rating | Manual | UGC questionnaire in Console |

**Phase 134:** paste into Play Console store listing draft for internal testing.

---

## Release notes template (первая версия)

```
Первая версия приложения ВсеТут:
• объявления, услуги, опт и карго
• поиск и фильтры
• заявки продавцам
• личный кабинет
• модерация и жалобы
```

---

## Связанные документы

- `docs/GOOGLE_PLAY_INTERNAL_TESTING_PHASE_134.md`
- `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md`
- `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
