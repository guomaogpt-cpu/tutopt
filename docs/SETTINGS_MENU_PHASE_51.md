# Settings menu — Phase 51

## Summary

Правое marketplace-меню настроек в header: аккаунт, город, язык, тема (заготовка), разделы, поддержка.

Полноценный dark mode, i18n и поиск по фото в этой фазе **не** делались.

## 1. Где добавлено меню

| Файл | Роль |
|------|------|
| `src/components/layout/header/HeaderClient.tsx` | Кнопка настроек (desktop) / burger (mobile) |
| `src/components/layout/header/SettingsDrawer.tsx` | Содержимое правого drawer |
| `src/features/preferences/locale-preference.ts` | `getPreferredLocale` / `setPreferredLocale` |
| `src/features/preferences/theme-preference.ts` | UI-заготовка темы в localStorage |
| `src/features/navigation/lib/account-home.ts` | Кабинет по роли |

UI: существующий `Drawer` (`src/components/ui/drawer.tsx`), `side="right"`, ширина `min(85vw, 380px)`.

## 2. Блоки drawer

1. **Верх** — логотип / «ВсеТут» + закрытие (встроенная кнопка Drawer)
2. **Аккаунт** — имя/роль + «Мой кабинет» / Войти+Регистрация + Выйти
3. **Город** — «Бишкек», disabled («скоро»)
4. **Язык** — RU / KG / EN (сохранение в localStorage)
5. **Тема** — Светлая / Тёмная / Системная (только preference, без применения)
6. **Разделы** — Опт, Объявления, Услуги, Карго, Все объявления, Подать объявление
7. **Поддержка** — `/help`, `/contacts` (WhatsApp не добавлен: нет рабочего номера)

## 3. Account section

| Role | «Мой кабинет» |
|------|----------------|
| BUYER | `/buyer/dashboard` |
| SELLER | `/seller/dashboard` |
| MODERATOR / ADMIN | `/admin` |
| иначе | `/buyer/dashboard` |

Auth architecture не менялась. Header actions (избранное, уведомления, login/profile) сохранены.

## 4. Language selector (сейчас)

- Key: `vsetut.locale`
- Values: `ru` \| `kg` \| `en`
- Активная кнопка подсвечивается
- **Интерфейс не переводится**

→ Полный RU/KG/EN: **Phase 53**

## 5. Theme selector (сейчас)

**Theme is active since Phase 52.**

- Package: `next-themes`
- Provider: `src/components/providers/ThemeProvider.tsx`
- Storage key: `vsetut.theme`
- Buttons call `setTheme("light" | "dark" | "system")`
- Active state after client mount

Подробнее: `docs/THEME_PHASE_52.md`.

## 6. Поиск по фото

В Phase 51 **не** добавлялся (ни кнопка камеры, ни upload).

→ Image search UI: **Phase 55**  
→ Image search backend: **Phase 56**

## 7. Что не трогали

- Prisma schema / migrations
- Auth / uploads
- Главная, логотип, primary nav направлений
- Карточки объявлений
