# Railway Playwright Chromium Deps — Phase 156

## 1. Проблема

Browser render fallback включён на Railway, но Chromium не запускается:

```
browserType.launch: Target page, context or browser has been closed
chrome-headless-shell: error while loading shared libraries:
libglib-2.0.so.0: cannot open shared object file
```

## 2. Симптом

- Node 20 работает
- Playwright package установлен
- Chromium binary скачан
- `renderFallbackAvailable: true` в debug (ложно)
- Import остаётся URL_ONLY без цены/фото/описания

## 3. Root cause

Railway runtime image (Nixpacks) не содержит системные Linux-библиотеки, необходимые headless Chromium.

## 4. Required Node version

```
NODE_VERSION=20.19.0
```

Или `nixpacks.toml` → `NIXPACKS_NODE_VERSION = "20"`.

## 5. Required Chromium system packages

Установлены через `nixpacks.toml` → `[phases.setup].aptPkgs`:

- libglib2.0-0, libnss3, libnspr4, libatk*, libcups2, libdrm2, libgbm1
- libx11-6, libxcb1, libxcomposite1, libxdamage1, libxfixes3, libxrandr2
- libxkbcommon0, libasound2t64, libpango-1.0-0, libcairo2, libgtk-3-0
- fonts-liberation, ca-certificates

## 6. Nixpacks/Railway config

`nixpacks.toml`:

```toml
[variables]
NIXPACKS_NODE_VERSION = "20"

[phases.setup]
aptPkgs = [ ... ]
```

Redeploy required после изменения aptPkgs.

## Ubuntu noble / Railway package note

На Ubuntu noble (24.04, Railway default) пакет `libasound2` недоступен как install candidate. Использовать `libasound2t64`. См. `docs/RAILWAY_BUILD_FIX_LIBASOUND_PHASE_157.md`.

## 7. Render fallback env variables

| Variable | Purpose |
|---|---|
| `NODE_VERSION=20.19.0` | Node 20 runtime |
| `IMPORT_RENDER_FALLBACK_ENABLED=true` | Enable browser render |
| `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` | Must NOT be `true` when render enabled |

Chromium install: `scripts/install-playwright-chromium.mjs` (postinstall, Node 20+ only).

## 8. How to verify render-status

Admin endpoint:

```
GET /api/admin/import/render-status
```

Expected after fix:

```json
{
  "browserLaunchable": true,
  "playwrightPackageAvailable": true,
  "browserExecutableAvailable": true,
  "failureCode": null
}
```

If deps missing:

```json
{
  "browserLaunchable": false,
  "failureCode": "RENDER_BROWSER_SYSTEM_DEPS_MISSING",
  "missingLibrary": "libglib-2.0.so.0"
}
```

## 9. Troubleshooting

| Symptom | Code | Action |
|---|---|---|
| libglib missing | RENDER_BROWSER_SYSTEM_DEPS_MISSING | Redeploy with nixpacks aptPkgs |
| Browser binary missing | RENDER_BROWSER_BINARY_MISSING | Check postinstall, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD |
| Node 18 | RENDER_NODE_VERSION_UNSUPPORTED | Set NODE_VERSION=20.19.0 |
| Launch timeout | RENDER_TIMEOUT | Retry, check memory |
| Env disabled | RENDER_FALLBACK_DISABLED | Set IMPORT_RENDER_FALLBACK_ENABLED=true |

## 10. Safety

- Render fallback optional — app starts without it
- Import by URL creates partial draft on render failure (no 500)
- Re-extract render mode returns `EXTERNAL_IMPORT_ERROR` with short message
- No raw Playwright launch log in user-facing API

## Migration

Нет.

## Phase 158 — Lalafo network extraction

После починки Chromium deps (Phase 156–157), browser render извлекает данные из network JSON responses.

См. `docs/LALAFO_NETWORK_EXTRACTION_PHASE_158.md`.
