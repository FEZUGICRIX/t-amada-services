# T-Travel Booking Services

Монорепозиторий микросервисов бронирования распределенной системы (участники паттерна Saga) на базе NestJS и pnpm workspaces.

## Структура проекта

```text
├── apps/
│   ├── flight-service/       # Сервис авиабилетов (порт 3001, префикс api/v1/flight)
│   ├── hotel-service/        # Сервис отелей (порт 3002, префикс api/v1/hotel)
│   ├── insurance-service/    # Сервис страхования (порт 3003, префикс api/v1/insurance)
│   └── transfer-service/     # Сервис трансферов (порт 3004, префикс api/v1/transfer)
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

## Запуск через Docker

### 1. Запуск только БД для локальной разработки
Запуск PostgreSQL 16 с автоматической инициализацией 4 независимых баз данных (`flight_db`, `hotel_db`, `insurance_db`, `transfer_db`):

```bash
docker compose up -d postgres
```

После запуска БД примените схему и наполните базы тестовыми данными:
```bash
pnpm db:push:all   # Применить схему Drizzle ко всем 4 базам
pnpm db:seed:all   # Наполнить базы реалистичными тестовыми данными (рейсы, отели, полисы, авто)
```

### 2. Полный запуск всей системы
Сборка multi-stage образов и одновременный запуск БД и всех 4 микросервисов:

```bash
docker compose up -d --build
```

### 3. Остановка и сброс данных
```bash
# Остановка контейнеров (данные в томах сохраняются)
docker compose down

# Остановка с удалением томов (полный сброс баз данных)
docker compose down -v
```

## Запуск сервисов локально (без Docker для приложений)

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

Каждый сервис предоставляет стандартизированный эндпоинт проверки состояния (исключен из глобального префикса для совместимости с инфраструктурными проверками Docker / K8s / балансировщиков):

- `GET http://localhost:3001/health` — Flight Service
- `GET http://localhost:3002/health` — Hotel Service
- `GET http://localhost:3003/health` — Insurance Service
- `GET http://localhost:3004/health` — Transfer Service

## Swagger Документация

Каждый сервис предоставляет интерактивную документацию Swagger UI по своему маршруту (согласованному с API Gateway):

- `http://localhost:3001/api/v1/flight/docs` — Flight Service API
- `http://localhost:3002/api/v1/hotel/docs` — Hotel Service API
- `http://localhost:3003/api/v1/insurance/docs` — Insurance Service API
- `http://localhost:3004/api/v1/transfer/docs` — Transfer Service API

## Линтинг и форматирование

```bash
pnpm lint       # Проверка и автоисправление через ESLint
pnpm format     # Форматирование через Prettier
```
