# База данных Coffee Test

## Описание

База данных MongoDB для проекта Coffee Test. Использует Docker для изоляции и автоматизации развертывания.

## Структура базы данных

### Коллекции

- `categories` - Категории товаров
- `products` - Товары
- `orders` - Заказы
- `users` - Пользователи системы
- `migrations` - История миграций

### Индексы

- `categories`: name (unique)
- `products`: name, categoryId
- `orders`: userId, status, createdAt
- `users`: username (unique), email (unique)

### Роли пользователей

- `admin` - Администратор системы
- `user` - Обычный пользователь
- `observer` - Пользователь с правами только на просмотр

## Установка и запуск

### Предварительные требования

- Docker
- Node.js
- Bun

### Запуск базы данных

```bash
# Запуск MongoDB
bun run dev

# Остановка MongoDB
bun run stop
```

## Миграции

### Команды

```bash
# Применение миграций
bun run migrate

# Просмотр статуса миграций
bun run migrate:status

# Откат миграций
bun run migrate:rollback

# Очистка базы данных
bun run clean

# Проверка состояния базы данных
bun run check
```

### Структура миграций

Миграции хранятся в папке `migrations/` и выполняются в алфавитном порядке. Каждая миграция должна экспортировать функции:

- `up(db)` - применение миграции
- `down(db)` - откат миграции
- `description` - описание миграции

## Тестовые пользователи

После применения миграций в базе данных создаются следующие тестовые пользователи:

1. Администратор:

   - Логин: admin
   - Email: admin@coffee-test.com
   - Роль: admin

2. Пользователь 1:

   - Логин: user1
   - Email: user1@coffee-test.com
   - Роль: user

3. Пользователь 2:

   - Логин: user2
   - Email: user2@coffee-test.com
   - Роль: user

4. Наблюдатель:
   - Логин: observer
   - Email: observer@coffee-test.com
   - Роль: observer

## Отладка

### Подключение к MongoDB

```bash
mongosh mongodb://admin:admin123@localhost:27017/coffee_test
```

### Мониторинг

- Логи MongoDB: `docker logs coffee_test_mongodb`
- Статус контейнера: `docker ps`

## Безопасность

- База данных доступна только локально
- Используется аутентификация
- Данные сохраняются в Docker volume
- Пароли пользователей хешируются

## Устранение неполадок

### Проблемы с подключением

1. Проверьте, запущен ли контейнер: `docker ps`
2. Проверьте логи: `docker logs coffee_test_mongodb`
3. Убедитесь, что порт 27017 свободен

### Проблемы с миграциями

1. Проверьте статус: `bun run migrate:status`
2. При необходимости откатите миграции: `bun run migrate:rollback`
3. Очистите базу: `bun run clean`
4. Примените миграции заново: `bun run migrate`
