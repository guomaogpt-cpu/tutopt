# Firebase Push Setup — Phase 117

> Настройка Firebase Cloud Messaging для Android push в приложении **ВсеТут** (`kg.vsetut.app`).  
> **Не коммитить** `google-services.json` и service account private keys в git.

---

## 1. Создать Firebase project

1. Откройте [Firebase Console](https://console.firebase.google.com/).
2. **Add project** (или используйте существующий).
3. Запишите **Project ID** — понадобится для `FIREBASE_PROJECT_ID`.

---

## 2. Добавить Android app

| Field | Value |
|---|---|
| Package name | `kg.vsetut.app` |
| App nickname | `ВсеТут Android` |
| Debug signing SHA-1 | опционально для dev; для FCM token обычно не обязателен на MVP |

После регистрации скачайте **`google-services.json`**.

---

## 3. Локальная установка google-services.json

```text
android/app/google-services.json   ← скачанный файл (НЕ в git)
android/app/google-services.json.example   ← шаблон в репозитории
```

**Поведение сборки без файла:** `android/app/build.gradle` применяет Google Services plugin **только если** `google-services.json` существует. Без файла:
- Android app собирается
- Push token / FCM **не работают**
- Web build не затрагивается

**Риски `google-services.json`:** содержит project id и Android API key. Ключ ограничен package name, но файл не публикуем в открытом репозитории — хранить локально и в CI secrets при необходимости.

---

## 4. Server credentials (FCM HTTP v1)

Для отправки push с backend нужен **Firebase service account**:

1. Firebase Console → Project settings → **Service accounts**
2. **Generate new private key** → скачать JSON
3. Из JSON возьмите:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### Railway / production env

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Важно:**
- Private key **только** в Railway Variables / local `.env` (не в git)
- В Railway часто нужны escaped `\n` в одной строке — backend обрабатывает `replace(/\\n/g, "\n")`
- Без env push **тихо отключён** — in-app notifications продолжают работать

---

## 5. Проверка

1. Соберите Android app с `google-services.json`
2. Войдите в аккаунт → `/account` → **Включить уведомления**
3. **Отправить тестовое уведомление**
4. Убедитесь, что push приходит на устройство

---

## 6. Что НЕ делать

- Не коммитить service account JSON / private key
- Не коммитить production `google-services.json` (см. `.gitignore`)
- Не включать Firebase Analytics / Crashlytics в этой фазе без отдельного решения

---

## Связанные документы

- `docs/ANDROID_PUSH_NOTIFICATIONS_PHASE_117.md`
- `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`
- `.env.example`
