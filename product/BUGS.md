# Bugs — Tutopt

**Обновлено:** июль 2026

Статусы: **Open** | **Fixed** | **Won't fix**

---

## Open

| ID | Severity | Описание | Область | Заметки |
|----|----------|----------|---------|---------|
| BUG-001 | Medium | Дубли пунктов меню SELLER: «Кабинет продавца» и «Мои объявления» → один URL | Nav | P1 из UX audit |
| BUG-002 | Medium | Дубли login/register для гостя: inline + UserMenu dropdown | Nav | P1 |
| BUG-003 | Low | ADMIN: дубли «Админка» и «Пользователи» → `/admin/users` | Nav | P2 |
| BUG-004 | Medium | «Кабинет покупателя» показывается всем ролям, включая SELLER/MODERATOR | Nav | P1 |
| BUG-005 | Low | Logout при ошибке API — нет сообщения пользователю | Auth | P3 |
| BUG-006 | Low | Login: после success `isSubmitting` сбрасывается до redirect — можно повторно submit | Auth | P2 |
| BUG-007 | Medium | Empty states на buyer dashboard слабее, чем на full pages | UI | P1 |
| BUG-008 | Low | Similar listings: секция скрывается без сообщения при пустом результате | Listings | P3 |
| BUG-009 | Low | Disabled stub «Позвонить» на карточке объявления выглядит как сломанная кнопка | Listings | P3 |
| BUG-010 | Medium | Forgot password: email не отправляется, token только в server log (dev) | Auth | P0 backlog |

---

## Fixed

| ID | Описание | Исправлено |
|----|----------|------------|
| BUG-F01 | Return URL после login отсутствовал | `?next=` + `resolveNextParam` |
| BUG-F02 | `/catalog` вёл на 404 `/listing/[slug]` | redirect → `/listings` |
| BUG-F03 | `/categories` вёл на 404 `/category/[slug]` | реальные категории из БД |
| BUG-F04 | `/sellers` mock slugs → 404 | placeholder страница |
| BUG-F05 | CTA «Подать объявление» для не-продавцов без контекста | role-aware CTA |
| BUG-F06 | Английские validation errors в формах | русские сообщения Zod |
| BUG-F07 | Badge уведомлений не обновлялся после read | unread store + optimistic UI |
| BUG-F08 | Polling перезаписывал локальный unread count | mutationGeneration guard |
| BUG-F09 | Повторная заявка блокировалась success-экраном | «Отправить ещё заявку» |
| BUG-F10 | `/auth/reset-password` страница отсутствовала | UI страницы добавлены |

---

## Won't fix (MVP)

| ID | Описание | Причина |
|----|----------|---------|
| BUG-W01 | Просмотр `/notifications` не помечает все как прочитанные | By design: только клик или «Отметить все» |
