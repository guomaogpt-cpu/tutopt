# Listing Quality (MVP)

Оценка качества объявления и подсказки для продавца и модератора. Считается **на лету**, без полей в БД и без migration.

## Helper

Файл: `src/lib/moderation/listing-quality.ts`

Использует антиспам-хелперы из `src/lib/moderation/content-checks.ts`:
- `detectPhoneInText`
- `detectLinkInText`
- `hasExcessiveCaps`
- `hasRepeatedCharacters`
- `countLinks`
- `normalizeText`

### API

| Функция | Назначение |
|---------|------------|
| `calculateListingQuality(listing)` | score, level, risk, warnings, tips |
| `getListingQualityLevel(score)` | good / warning / bad |
| `getListingQualityWarnings(listing)` | список причин |
| `getListingModerationRisk(listing)` | low / medium / high |
| `getVerticalQualityTips(vertical)` | советы по vertical |

Входной объект (`ListingQualityInput`) — plain data, **без Prisma queries**.

## Как считается score

Старт: **100**, затем вычитания:

| Условие | Штраф |
|---------|-------|
| Нет фото | −20 |
| Описание &lt; 40 символов | −20 |
| Нет цены | −10 |
| Нет города | −10 |
| Нет категории | −10 |
| Телефон в title | −30 |
| Ссылка в title | −30 |
| CAPS abuse в title | −15 |
| Повторяющиеся символы | −15 |
| ≥3 ссылок в description | −20 |
| Возможный дубль | −15 |

Score ограничен диапазоном **0–100**.

### Уровни качества

| Score | Level | Label |
|-------|-------|-------|
| 80–100 | `good` | Хорошо |
| 50–79 | `warning` | Нужно улучшить |
| 0–49 | `bad` | Проблемное |

### Risk модерации

| Risk | Когда |
|------|-------|
| `high` | телефон/ссылка в title, много ссылок, возможный дубль |
| `medium` | score &lt; 80 |
| `low` | иначе |

Labels: «Низкий риск» / «Проверить» / «Высокий риск».

## Warnings

- Нет фото
- Слишком короткое описание / Нет описания
- Нет цены
- Нет города
- Нет категории
- Телефон в заголовке
- Ссылка в заголовке
- Много CAPS в заголовке
- Повторяющиеся символы
- Много ссылок
- Возможный дубль
- Укажите партию или единицу (OPT, если нет MOQ и unit)

## Где показывается

1. **`/listings/new`** — live-блок «Качество объявления» в sidebar (desktop + mobile), tips по vertical:
   - OPT / MARKET / SERVICES / CARGO
2. **`/seller/dashboard`** — badge качества + 1–2 главных warning на карточке объявления
3. **`/admin/moderation/listings`** — badge риска + качество + причины (не блокирует approve/reject)

Listing detail для владельца: **не сделано** в этом MVP (чтобы не усложнять auth/owner UI).

## Ограничения MVP

- Score не сохраняется в БД
- Нет сортировки очереди модерации по риску
- Нет auto-reject
- Нет проверки качества изображений
- Нет seller trust score
- Duplicate flag приходит снаружи (`hasPossibleDuplicate`), сам helper БД не читает
- Оценка эвристическая, не ML

## Что можно добавить позже

- колонка `risk_score` / `quality_score` в Listing
- сортировка moderation queue по risk
- auto-reject явного спама
- image quality / blur / duplicate image check
- seller trust score
- «Как улучшить» на странице своего объявления
- уведомление продавцу при low quality после reject
