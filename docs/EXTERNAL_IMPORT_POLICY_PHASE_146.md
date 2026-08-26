# External Import Policy — Phase 146

Правила безопасного импорта объявлений из внешних источников для ВсеТут.

## Основные принципы

1. **Не публиковать чужие данные автоматически**  
   Любой импорт проходит через `ImportedListingDraft` и ручную проверку staff.

2. **Контакты только для внутренней проверки**  
   Номера телефонов, WhatsApp, Telegram и другие контакты из внешних источников хранятся в `rawContact` и **не** переносятся в публичные объявления без явного решения модератора.

3. **Источник хранить для аудита**  
   `source_platform`, `source_url`, `source_external_id` сохраняются для traceability и разбора жалоб.

4. **Публикация только через review**  
   Draft → staff review → publish → `PENDING_MODERATION` → существующая модерация.

5. **Быстрое снятие при жалобе**  
   Если правообладатель или пользователь жалуется — объявление снимается через существующий reports/moderation flow; import draft сохраняет audit trail.

6. **Не обходить защиты сайтов**  
   Запрещены CAPTCHA bypass, scraping workers, browser automation против ToS источников в production без согласования.

7. **Instagram — только ссылки / официальные доступы / ручной импорт**  
   Login bot и автоматический scraping Instagram — запрещены в Phase 146.

## Запрещено в Phase 146

- Массовый парсинг Lalafo и других площадок
- Auto-publish без review
- Server-side download чужих изображений (SSRF risk)
- Копирование phone numbers в public listings
- Cron jobs / background scrapers

## Разрешено

- Ручной ввод данных staff-ом
- Хранение external image URLs (client-side preview only)
- Duplicate check MVP
- Publish в Listing через admin action

## Ответственность

Staff, создающий import draft, несёт ответственность за проверку:

- права на контент (или партнёрское согласие)
- корректность категории и города
- отсутствие персональных данных в публичном описании
- соответствие правилам модерации ВсеТут

## Связанные документы

- `docs/IMPORT_DRAFTS_SYSTEM_PHASE_146.md`
- `docs/USER_GENERATED_CONTENT_SAFETY_PHASE_125.md`
- `docs/TRUST_SAFETY_REPORTS_PHASE_125.md`
