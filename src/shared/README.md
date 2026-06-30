# Shared

Переиспользуемый код, не привязанный к одному домену. Используется несколькими features и слоем `src/app`.

## Принципы

- Не содержит бизнес-логики конкретного домена
- Не импортирует из `src/features/*`
- Зависимости направлены вниз: `app` → `features` → `shared`

## Слои

| Папка          | Назначение                                                   |
| -------------- | ------------------------------------------------------------ |
| `ui`           | Базовые UI-компоненты (обёртки shadcn/ui, layout primitives) |
| `lib`          | Инфраструктурные обёртки (Prisma client, auth helpers)       |
| `config`       | Конфигурация приложения, env-валидация                       |
| `types`        | Общие TypeScript-типы и DTO                                  |
| `constants`    | Константы (роли, статусы, лимиты)                            |
| `validators`   | Zod-схемы валидации                                          |
| `services`     | Сервисный слой (оркестрация, внешние интеграции)             |
| `repositories` | Доступ к данным через Prisma                                 |
| `hooks`        | Общие React hooks                                            |
| `utils`        | Чистые утилиты без side effects                              |

## Правила импорта

```
shared/repositories  →  Prisma, shared/types
shared/services      →  repositories, shared/types
features/*           →  shared/*
src/app              →  features/*, shared/*
```
