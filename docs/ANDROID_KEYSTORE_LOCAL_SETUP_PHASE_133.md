# Android Keystore — Local Setup (Phase 133)

> **Статус:** инструкция для владельца проекта.  
> **Не коммитить** keystore, `key.properties`, пароли.

---

## 1. Зачем нужен keystore

Google Play принимает только **signed release AAB**. Подпись создаётся локальным release keystore и привязывается к package `kg.vsetut.app`.

**Потеря keystore** = невозможность публиковать обновления того же приложения в Play Store. Храните резервную копию в безопасном месте (password manager, encrypted backup).

---

## 2. Что создаётся только локально

| Asset | Где | Git |
|---|---|---|
| Release keystore (`*.jks` / `*.keystore`) | Локально, например `android/keystore/` | ❌ never |
| `android/key.properties` | Локально | ❌ never |
| Пароли store/key | Только у владельца | ❌ never |

Шаблон в репозитории: `android/key.properties.example` (placeholders only).

---

## 3. Шаги (владелец проекта)

### 3.1 Создать keystore

Выполнить **локально** (пароли не записывать в git/docs):

```text
keytool -genkeypair -v \
  -keystore android/keystore/vsetut-release.jks \
  -alias YOUR_KEY_ALIAS \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storetype JKS
```

Замените `YOUR_KEY_ALIAS` на свой alias (пример в template: `vsetut`).

### 3.2 Создать key.properties

```text
cp android/key.properties.example android/key.properties
```

Заполнить `android/key.properties`:

```properties
storeFile=../keystore/vsetut-release.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=YOUR_KEY_ALIAS
keyPassword=YOUR_KEY_PASSWORD
```

Placeholders:
- `YOUR_KEYSTORE_PATH` — путь к `.jks` относительно `android/` (в template: `../keystore/vsetut-release.jks`)
- `YOUR_KEY_ALIAS`
- `YOUR_STORE_PASSWORD`
- `YOUR_KEY_PASSWORD`

### 3.3 Собрать signed AAB

Prerequisites: JDK 17+, Android SDK — `npm run android:check`

```text
npm run android:release
```

Output (не коммитить):

```text
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 4. Как Gradle использует signing

`android/app/build.gradle`:

- **Debug build** — не требует release keystore (debug signing по умолчанию).
- **Release build** — если `android/key.properties` существует, подключает `signingConfigs.release`.
- Если `key.properties` **отсутствует** — release AAB может собраться **unsigned**; Google Play такой bundle не примет.

---

## 5. .gitignore protection

Root `.gitignore` и `android/.gitignore` игнорируют:

- `*.jks`, `*.keystore`, `*.p12`
- `key.properties`, `signing.properties`, `release-signing.properties`
- `*.aab`, `*.apk` (build outputs)

---

## 6. Backup checklist

- [ ] Keystore файл сохранён в secure vault
- [ ] Store password записан в password manager
- [ ] Key alias и key password записаны
- [ ] Проверена сборка signed AAB после настройки
- [ ] AAB **не** добавлен в git

---

## 7. Phase 133 result

| Item | Status |
|---|---|
| `key.properties.example` | ✅ in repo |
| Local `key.properties` | ⏳ owner creates |
| Local keystore | ⏳ owner creates |
| Signed AAB | ⏳ pending local keystore |

---

## Связанные документы

- `docs/ANDROID_RELEASE_AAB_PHASE_113.md`
- `docs/ANDROID_RELEASE_CANDIDATE_PHASE_132.md`
- `docs/ANDROID_REAL_DEVICE_RELEASE_TEST_PHASE_133.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
