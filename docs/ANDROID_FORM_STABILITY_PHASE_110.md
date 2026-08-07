# Android Form Stability — Phase 110

## 1. Симптом

На Android WebView (Capacitor app) при заполнении `/listings/new` часть введённых данных «слетала»:

- при переходе между полями
- при выборе категории / подкатегории
- при заполнении характеристик
- при работе autosuggest
- при открытии/закрытии клавиатуры

Особенно заметно на промышленном оборудовании (смена subcategory → новый набор characteristics).

## 2. Найденная причина

### Primary: reset характеристик при смене category/subcategory

`NewListingForm` содержал `useEffect`, который при каждом изменении `characteristicFields` вызывал:

```typescript
setCharacteristicValues(buildEmptyCharacteristicValues(characteristicFields));
```

При выборе подкатегории менялся `categorySlug` → менялся preset полей → **все введённые характеристики обнулялись**.

### Secondary: stale closure в characteristics onChange

`ListingCharacteristicsFields` обновлял state через `updateField(values, ...)` с `values` из closure render. На mobile WebView при быстром вводе и re-render это могло терять последние изменения.

### Not the root cause (verified)

- Title/price/city хранятся в parent `useState` — не сбрасывались кодом напрямую
- Stepper не размонтирует секции формы
- Нет `key={category}` на всей форме
- Upload/AI не вызывают full form reset

## 3. Что исправлено

| Fix | File |
|---|---|
| Merge characteristics при смене preset (`mergeCharacteristicValuesForFields`) | `listing-characteristics.ts`, `NewListingForm.tsx` |
| Functional update для characteristics fields | `ListingCharacteristicsFields.tsx` |
| Sync `CategoryPicker` root state при external category change | `CategoryPicker.tsx` |
| Draft autosave (localStorage, debounce 800ms) | `listing-form-draft.ts`, `NewListingForm.tsx` |
| Draft restore banner | `ListingFormDraftBanner.tsx` |
| AI не перезаписывает непустое description | `NewListingForm.tsx` |
| `autoComplete="off"` на form | `NewListingForm.tsx` |
| Clear draft после успешной публикации | `NewListingForm.tsx` |

## 4. Как теперь хранится form state

Все поля остаются в parent `useState` в `NewListingForm`:

- vertical, categoryId, title, price, city, description, photos, characteristics, etc.

Characteristics при смене категории:

```typescript
mergeCharacteristicValuesForFields(newFields, previous)
// сохраняет заполненные id, добавляет только новые пустые поля
```

Autosuggest по-прежнему **не применяет** suggestions автоматически — только по кнопке, и не перезаписывает заполненные characteristics (`applyCharacteristicSuggestions`).

## 5. Как работает draft autosave

- **Key:** `vsetut-listing-form-draft:{userId}` в `localStorage`
- **Debounce:** 800ms
- **Сохраняет:** vertical, category, title, price, city, description, characteristics, uploaded photo URLs, etc.
- **Не сохраняет:** file blobs, secrets, API keys
- **Restore:** banner «Найден черновик объявления» → Восстановить / Удалить
- **Clear:** после успешного submit

## 6. Что проверено

| Check | Status |
|---|---|
| Code review: no full form reset on field change | ✅ |
| Characteristics merge on subcategory change | ✅ |
| Functional update for characteristics | ✅ |
| Draft save/restore logic | ✅ |
| Web lint/build | ✅ |
| Android manual scenarios A–E | ⏳ requires device retest |

## 7. Known limitations

- Draft не восстанавливает локальные blob previews фото (только uploaded server URLs)
- Google OAuth в WebView — отдельный риск, не в scope Phase 110
- `type="number"` inputs на старых WebView могут вести себя иначе — monitor on device
- Draft per-user only (requires login)

## 8. Future improvements

- sessionStorage fallback for guest (if guest posting added)
- Confirm dialog before AI overwrites existing description
- IndexedDB for larger draft payloads
- E2E test for category → subcategory → characteristics flow

## Связанные файлы

- `src/components/listings/NewListingForm.tsx`
- `src/components/listings/ListingCharacteristicsFields.tsx`
- `src/components/listings/CategoryPicker.tsx`
- `src/components/listings/ListingFormDraftBanner.tsx`
- `src/features/listings/lib/listing-characteristics.ts`
- `src/features/listings/lib/listing-form-draft.ts`

## Phase 111 Android manual QA polish

См. `docs/ANDROID_MANUAL_QA_POLISH_PHASE_111.md` — keyboard inset, sticky CTA offset, Capacitor back handler, unsaved form guard.
