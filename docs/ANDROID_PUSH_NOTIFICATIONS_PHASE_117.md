# Android Push Notifications — Phase 117

> **Цель:** foundation для native Android push без marketing broadcast и без iOS.  
> **Не в scope:** Google Play publish, admin mass notifications, notification campaigns.

---

## 1. Цель

Добавить native push как **продолжение** существующих in-app notifications:

1. Сначала создаётся in-app notification (`Notification` model)
2. Затем, если у пользователя есть активный push token и push enabled → FCM push

Web/PWA и Telegram cargo notifications **не затронуты**.

---

## 2. Архитектура

```text
Event (lead, moderation, cargo, …)
  → create in-app Notification (Prisma)
  → dispatchUserPush(userId, payload)
       → get enabled PushToken[]
       → FCM HTTP v1 (Firebase service account)
  → Android Capacitor app receives push
  → tap → deep link (relative path)
```

| Layer | Location |
|---|---|
| Prisma | `PushToken`, `NotificationType.LISTING_*` |
| Token storage | `src/features/push/lib/push-token-data.ts` |
| FCM sender | `src/lib/push/send-push-notification.ts` |
| Dispatch hook | `src/lib/push/dispatch-user-push.ts` |
| Deep link sanitize | `src/lib/push/push-path.ts` |
| Client (Android) | `src/lib/push/push-notifications-client.ts` |
| Account UI | `src/components/account/PushNotificationsSettings.tsx` |

---

## 3. Firebase setup

См. **`docs/FIREBASE_PUSH_SETUP_PHASE_117.md`**

- Package: `kg.vsetut.app`
- `google-services.json` → `android/app/` (local, gitignored)
- Env: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

---

## 4. Android permission flow

- **Не** запрашиваем permission при первом запуске
- Блок в `/account`: описание + кнопка **Включить уведомления**
- После нажатия: `PushNotifications.requestPermissions()` → `register()` → token → `POST /api/push/register`
- Отказ: текст про настройки Android
- В браузере/PWA: «Доступно в приложении Android»

Capacitor plugin: `@capacitor/push-notifications`  
Manifest: `POST_NOTIFICATIONS`

---

## 5. Push token storage

Model `PushToken`:

| Field | Notes |
|---|---|
| token | unique |
| user_id | from session only |
| platform | ANDROID / PWA / IOS |
| device_id, app_version | optional |
| enabled | default true; unregister → false |
| last_seen_at | updated on register |

Migration: `prisma/migrations/20260808130000_push_tokens/`

---

## 6. Backend APIs

| Method | Route | Auth | Behavior |
|---|---|---|---|
| POST | `/api/push/register` | yes | upsert token, enabled=true |
| POST | `/api/push/unregister` | yes | disable token(s) |
| POST | `/api/push/test` | yes | test push to **current user only** |

Rate limits: `src/lib/security/rate-limit.ts`

---

## 7. Test push

`POST /api/push/test` (authenticated):

- Title: **ВсеТут**
- Body: **Тестовое push-уведомление включено.**
- Click URL: `/notifications`
- Does **not** create in-app notification (avoid duplicate inbox noise)

---

## 8. Events connected

| Event | In-app | Push |
|---|---|---|
| New lead on listing | ✅ | ✅ owner |
| Listing approved/rejected | ✅ | ✅ author |
| New cargo request | ✅ | ✅ recipients |
| New cargo response | ✅ | ✅ owner/admins |
| Company verification | ✅ | ✅ (via existing notify) |
| Test push | — | ✅ self only |

**Future:** more granular preferences by type; remaining edge events without refactor.

---

## 9. Deep links

Push `data.url` — только **relative path** (`/notifications`, `/account/requests`, `/listings/[id]`, …).

`sanitizePushPath()`:
- must start with `/`
- no `://`, no `//`
- whitelist prefixes; fallback `/notifications`

Tap handler: `router.push(sanitizePushPath(url))`

---

## 10. Privacy / data safety

- Privacy draft: раздел «Push-уведомления» на `/privacy`
- Data safety notes updated: push tokens, FCM, no sale, user can disable
- See `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`

---

## 11. Known limitations

- Firebase credentials required on server for real delivery
- Real Android device test required (emulator FCM may need extra setup)
- iOS not included
- No notification type preferences yet
- Invalid FCM tokens disabled on send failure (best-effort)

---

## 12. Future

- iOS push (APNs + Capacitor)
- Admin broadcast (explicitly out of scope)
- Notification preferences by type
- Scheduled reminders
- PWA Web Push (optional `PushPlatform.PWA`)

---

## Связанные документы

- `docs/FIREBASE_PUSH_SETUP_PHASE_117.md`
- `docs/APP_NOTIFICATIONS_ACTIVITY_PHASE_116.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
