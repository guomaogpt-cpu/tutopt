# Production Render Fallback Diagnostics — Phase 155

## Цель

Честная диагностика browser render fallback на production для admin.

## Endpoint

`GET /api/admin/import/render-status` (staff only)

## Response fields

| Field | Description |
|---|---|
| `nodeVersion` | Current Node.js version |
| `renderFallbackEnabled` | `IMPORT_RENDER_FALLBACK_ENABLED=true` |
| `playwrightPackageAvailable` | Dynamic import playwright-core OK |
| `browserExecutableAvailable` | Chromium binary path exists |
| `browserLaunchable` | Test launch succeeded |
| `failureCode` | Structured failure code or null |
| `failureMessage` | Short admin-safe message |
| `missingLibrary` | e.g. `libglib-2.0.so.0` |

## Import debug fields

Import by URL / reextract debug includes:

- `renderFallbackEnabled`, `renderFallbackAttempted`, `renderFallbackSucceeded`
- `renderFallbackAvailable` (= `browserLaunchable` after attempt)
- `browserLaunchable`, `playwrightPackageAvailable`, `browserExecutableAvailable`
- `renderFallbackFailureCode`, `missingLibrary`, `technicalReason` (admin only)

## Phase 156

System deps fix — см. `docs/RAILWAY_PLAYWRIGHT_CHROMIUM_DEPS_PHASE_156.md`.

## Phase 158 — Network extraction diagnostics

Import debug теперь включает:

- `documentTitle`, `pageUrl`, `bodyTextSample`
- `h1Texts`, `imageCountTotal`, `candidateImageCount`
- `jsonResponseCount`, `jsonResponsesWithTargetId`
- `blockedPageDetected`, `captchaDetected`
- `extractionSource`: `network-json` | `embedded-json` | `dom` | `open-graph` | `url-slug-fallback`

См. `docs/LALAFO_NETWORK_EXTRACTION_PHASE_158.md`.
