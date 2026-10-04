# T-Travel Booking Orchestrator

Монорепозиторий микросервисов распределенной системы бронирования путешествий на базе **NestJS** и **pnpm workspaces**.

## Структура проекта

```text
├── apps/
│   ├── flight-service/       # Сервис авиабилетов (порт 3001)
│   ├── hotel-service/        # Сервис отелей (порт 3002)
│   ├── insurance-service/    # Сервис страхования (порт 3003)
│   └── transfer-service/     # Сервис трансферов (порт 3004)
├── libs/
│   └── common/               # Общая библиотека (@t-amada/common)
├── pnpm-workspace.yaml
└── nest-cli.json
```

## Требования

- **Node.js**: >= 20
- **pnpm**: >= 10 (`corepack enable && corepack use pnpm`)

## Установка зависимостей

```bash
pnpm install
```

## Сборка

```bash
# Сборка всех микросервисов
pnpm build:all

# Сборка только библиотеки common
pnpm build:common
```

## Запуск сервисов

```bash
# Параллельный запуск всех 4 сервисов в dev-режиме
pnpm start:all

# Запуск конкретного сервиса
pnpm start:flight
pnpm start:hotel
pnpm start:insurance
pnpm start:transfer
```

## Health Checks

Каждый сервис предоставляет эндпоинт проверки состояния:

- `GET http://localhost:3001/health` — Flight Service
- `GET http://localhost:3002/health` — Hotel Service
- `GET http://localhost:3003/health` — Insurance Service
- `GET http://localhost:3004/health` — Transfer Service

## Линтинг и форматирование

```bash
pnpm lint       # Проверка и автоисправление через ESLint
pnpm format     # Форматирование через Prettier
```
