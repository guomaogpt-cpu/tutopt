# First-run Onboarding — Phase 121

Лёгкий onboarding и быстрый старт для Android/PWA без блокирующих экранов, без push и без изменений Prisma schema.

---

## 1. Цель

Сделать первый опыт понятным:

- пользователь быстро понимает, что можно делать;
- главное действие видно сразу;
- пустые экраны не выглядят «мёртвыми»;
- регистрация не навязывается до действия;
- подсказки можно скрыть и они не возвращаются после dismiss.

---

## 2. Что добавлено на главной

**Компонент:** `HomeWelcomeBlock` в `HomepagePaperEntry.tsx` (только mobile, `sm:hidden`).

| Элемент | Значение |
|---|---|
| Текст | ВсеТут — объявления, услуги, опт и карго. Подайте объявление, найдите товар или создайте карго-заявку. |
| CTA | Подать объявление → `/listings/new`, Найти товар → `/listings` |
| Dismiss | «Скрыть» + крестик |
| Storage | `vsetut_home_welcome_dismissed_v1` |
| Guard | Не показывается при viewport &lt; 320×520 |

Не modal, не overlay, не блокирует экран.

---

## 3. Быстрый старт в кабинете

**Компонент:** `AccountQuickStart` на `/account` (заменяет `AccountQuickActions` + убран `MobileOnboardingHints`).

Заголовок: **Быстрый старт**.

Карточки:

- Подать объявление / Подать первое объявление (primary если нет объявлений)
- Мои объявления
- Мои заявки
- Настроить компанию / Добавить компанию (dashed если нет компании)
- Карго-заявка

Контекст из `getAccountDashboardData`: `listingStats.total`, `company`.

---

## 4. Подсказка первого объявления

**Компонент:** `ListingFormFirstHint` на `/listings/new`.

- Только если у пользователя ещё нет объявлений (`hasExistingListings={false}`)
- Collapsible hint с пунктами: категория, фото, цена/город, «Составить описание»
- Dismiss: `listingFormHintDismissed`

---

## 5. Empty states

| Route | Изменения |
|---|---|
| `/account/requests` | received: «Мои объявления» + «Подать объявление»; noListings: обновлён copy |
| `/favorites` | Кнопка «Найти объявления» |
| `/notifications` | Copy без push; CTA «Перейти в кабинет» для всех ролей |

---

## 6. Cargo guide

**Компонент:** `CargoQuickGuide` на `/cargo` — компактный блок над поиском, hero не тронут.

1. Создайте заявку  
2. Укажите маршрут и груз  
3. Получите отклики от карго-компаний  

CTA: **Создать заявку** → открывает `CargoRequestModal`.

Полный `CargoHowItWorks` ниже по странице сохранён.

---

## 7. Auth prompts

При редиректе на `/login?next=/listings/new`:

- Заголовок: **Войдите, чтобы продолжить**
- Описание: **Это нужно, чтобы сохранить объявление в вашем кабинете.**
- Кнопки: Войти + ссылка на Регистрацию (с `next`)

Ключи: `auth.continueLoginTitle`, `auth.continueLoginDescription`.

---

## 8. Android / WebView considerations

- Подсказки inline, не перекрывают bottom nav
- `localStorage` только в `useEffect` / client handlers (SSR-safe)
- Dismiss персистентный — Back не восстанавливает hint
- Welcome block скрыт на очень маленьких экранах
- Home mobile layout не перегружен (welcome между search и quick actions)

---

## 9. Микро-тексты (UI labels)

Обновлены формулировки без «AI», «Lead», «Generate» в user-facing RU:

- `listingForm.*` compose wording
- `listingCharacteristics.usedForAi`
- `accountListings.leadsCount` EN → Requests

---

## 10. Что осталось

- Обязательный multi-screen onboarding — не нужен
- Push notifications — Phase 117 infra, opt-in отложен
- Google Play publish / iOS
- Аналитика first-run funnel
- Персонализация welcome по auth state (optional)

---

## Файлы

| File | Role |
|---|---|
| `src/lib/onboarding/onboarding-storage.ts` | Storage keys + helpers |
| `src/components/onboarding/HomeWelcomeBlock.tsx` | Mobile home welcome |
| `src/components/account/AccountQuickStart.tsx` | Account quick start |
| `src/components/listings/ListingFormFirstHint.tsx` | First listing hint |
| `src/components/cargo/CargoQuickGuide.tsx` | Cargo compact guide |

---

## Связанные документы

- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/LISTING_LEADS_CONTACT_FLOW_PHASE_119.md`
- `docs/APP_NOTIFICATIONS_ACTIVITY_PHASE_116.md`
