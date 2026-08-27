# Railway Node 20 + Playwright — Phase 154

## 1. Проблема

После Phase 153 Railway deploy показывал runtime warning:

```
You are running Node.js 18.20.5.
Playwright requires Node.js 20 or higher.
```

Сайт стартовал через `next start`, но Playwright не мог работать на Node 18.

## 2. Причина

Railway/Nixpacks использовал Node 18 по умолчанию. Playwright (даже через dynamic import) требует Node 20+.

Postinstall script `playwright-core install chromium` также вызывал Playwright CLI на Node 18 при `IMPORT_RENDER_FALLBACK_ENABLED=true`.

## 3. Required env / config

**Railway variable (recommended):**

```
NODE_VERSION=20.19.0
```

**Project pins:**

- `package.json` → `"engines": { "node": ">=20 <23" }`
- `.nvmrc` → `20.19.0`
- `nixpacks.toml` → `NIXPACKS_NODE_VERSION = "20"`

Redeploy после установки Node 20.

## 4. Optional env

```
IMPORT_RENDER_FALLBACK_ENABLED=true
```

Включать **только после** успешного deploy на Node 20.

Chromium устанавливается в postinstall только если:

- `IMPORT_RENDER_FALLBACK_ENABLED=true`
- Node major >= 20

## 5. Почему Playwright optional

- Обычный сайт не использует Playwright
- Dynamic import только при explicit render fallback call
- Env flag + Node guard перед import
- Если module/browser недоступен → graceful `RENDER_FALLBACK_UNAVAILABLE`
- Если Node < 20 → `RENDER_FALLBACK_UNAVAILABLE_NODE_VERSION`
- Import by URL продолжает работать (partial draft из slug)

## 6. Как проверить deploy

1. Railway logs: Node version 20.x при build и start
2. Нет warning «Playwright requires Node.js 20» при старте
3. `/admin/import` открывается
4. Import by URL без render env → partial draft, сайт не падает
5. С `IMPORT_RENDER_FALLBACK_ENABLED=true` на Node 20 → browser reextract доступен

## 7. Как отключить render fallback при проблемах

```
IMPORT_RENDER_FALLBACK_ENABLED=false
```

Или удалить переменную. Сайт продолжит работать; Lalafo import вернёт partial draft + понятное сообщение.

## Migration

Нет.

## Related docs

- `docs/LALAFO_BROWSER_RENDER_IMPORT_PHASE_153.md`
