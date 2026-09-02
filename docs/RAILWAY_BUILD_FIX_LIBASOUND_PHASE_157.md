# Railway Build Fix — libasound Phase 157

## 1. Симптом

Railway build падает на этапе `apt-get install`:

```
Package libasound2 is a virtual package provided by:
  liboss4-salsa-asound2
  libasound2t64

E: Package 'libasound2' has no installation candidate
```

## 2. Root cause

Railway/Nixpacks использует Ubuntu noble (24.04). В noble пакет `libasound2` заменён на `libasound2t64` (time64 transition). Phase 156 добавил `libasound2`, который на noble не является install candidate.

## 3. Исправление

В `nixpacks.toml` заменено:

- `libasound2` → `libasound2t64`

Остальной список Chromium dependencies без изменений.

## 4. Проверка build

Локально: `prisma validate`, `lint`, `build` — ok.

Установка apt packages проверяется на Railway deploy после push.

После успешного deploy:

- `GET /api/admin/import/render-status` → `browserLaunchable: true` (если env включён)

## 5. Known limitations

- Другие дистрибутивы могут требовать иные имена пакетов
- Playwright render остаётся optional; сайт стартует без browser launch

## Migration

Нет.

## Related

- `docs/RAILWAY_PLAYWRIGHT_CHROMIUM_DEPS_PHASE_156.md`
