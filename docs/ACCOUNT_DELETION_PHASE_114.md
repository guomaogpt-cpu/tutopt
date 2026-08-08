# Account Deletion — Phase 114

> **Статус:** request-based MVP для Google Play readiness.  
> **Не финальная GDPR/automation** — ручная обработка запросов.

---

## 1. Зачем нужна функция

Google Play (и Apple App Store) требуют понятный способ удаления аккаунта для приложений с регистрацией:

- публичная web-страница с инструкцией (доступна без входа);
- in-app / authenticated путь для авторизованных пользователей;
- не мгновенное «опасное» удаление без review связанных данных.

Phase 114 закрывает **store readiness MVP**, не полную автоматизацию.

---

## 2. Routes

| Route | Auth | Назначение |
|---|---|---|
| `/delete-account` | нет | Публичная инструкция для Google Play web link |
| `/account/delete` | да | Форма запроса удаления для авторизованного пользователя |
| `POST /api/account/deletion-request` | да | Создание запроса (status `PENDING`) |

Ссылки также в:
- Footer → «Удаление аккаунта» → `/delete-account`
- Account quick actions → `/account/delete`
- `/privacy`, `/terms`, `/support` → cross-links

---

## 3. Request-based deletion flow

### Авторизованный пользователь

1. Открывает `/account/delete`
2. Читает предупреждение (объявления, заявки, карго не удаляются автоматически)
3. Опционально указывает причину
4. Ставит галочку подтверждения
5. Нажимает «Запросить удаление аккаунта»
6. `POST /api/account/deletion-request` → запись в `AuditLog` с action `account_deletion_requested`, metadata `{ status: "PENDING", reason? }`
7. UI показывает подтверждение; аккаунт **остаётся активным**

### Неавторизованный пользователь

Страница `/delete-account`:
- инструкция войти и открыть `/account/delete`;
- mailto на support email с шаблоном темы;
- ссылка на `/login?next=/account/delete`

### Duplicate guard

Повторный запрос от того же userId в течение 30 дней → `409 Conflict`.

### Rate limit

3 запроса / user / 24h.

---

## 4. Что происходит с данными

**При submit запроса (MVP):**
- пользователь **не удаляется** из БД;
- объявления, leads, cargo requests, audit history **не трогаются**;
- создаётся audit log для ручной обработки оператором.

**После ручной обработки (future / ops):**
- деактивация или anonymization профиля;
- снятие/архивация объявлений;
- сохранение минимальных записей, если требует закон (audit, fraud).

---

## 5. Что пока не автоматизировано

- [ ] Admin queue UI для deletion requests
- [ ] Email уведомление пользователю о принятии/завершении
- [ ] Автоматическая anonymization User + Listings
- [ ] Export personal data (GDPR-style)
- [ ] SLA трекинг (Google: до 30 дней на обработку запроса)
- [ ] Отдельная Prisma модель `AccountDeletionRequest` (не добавлена — используется AuditLog)

---

## 6. Что нужно для финального Google Play

| Item | Phase 114 | Still needed |
|---|---|---|
| Public delete URL | ✅ `/delete-account` | — |
| In-app delete path | ✅ `/account/delete` | — |
| Support email in flow | ✅ placeholder `hello@tutopt.kg` | Final support email + legal entity |
| Actual deletion within 30 days | ⚠️ manual ops | Ops process + admin tools |
| Privacy Policy mentions deletion | ✅ link in `/privacy` | Lawyer final review |

---

## 7. Риски

1. **Запрос без последующей обработки** — пользователь видит «принято», но аккаунт жив; нужен ops SLA.
2. **Связанные UGC** — listings остаются после anonymization user без отдельного workflow.
3. **Duplicate AuditLog queries** — фильтр по JSON metadata; при масштабе лучше dedicated table.
4. **Legal entity placeholder** — support email и operator не финальные до юридической проверки.

---

## 8. Future phases

| Feature | Notes |
|---|---|
| Full anonymization pipeline | User fields → null/hash; listings → archived |
| Admin deletion queue | Filter audit logs `account_deletion_requested` |
| `AccountDeletionRequest` model | If audit log filtering becomes insufficient |
| Data export | User-requested JSON export |
| Retention policy automation | Scheduled purge of inactive accounts |
| Email confirmations | On request + on completion |

---

## Backend implementation (no migration)

```text
AuditLog.action = "account_deletion_requested"
AuditLog.metadata = { status: "PENDING", reason?: string }
AuditLog.userId = current user
```

Файлы:
- `src/features/account/lib/account-deletion-request.ts`
- `src/features/account/validators/account-deletion.validators.ts`
- `src/app/api/account/deletion-request/route.ts`
- `src/lib/security/rate-limit.ts` → `assertAccountDeletionRequestRateLimit`

---

## Связанные документы

- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
