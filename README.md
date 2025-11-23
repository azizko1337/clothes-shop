# Clothes shop

## Projekt sklepu odzieżowego z modelami 3D

Stanowi on zaliczenie modułu WIG,

## Seedowanie bazy danych
- `npx prisma db seed`

## Uruchamianie z Dockerem

### Tryb Development
Aby uruchomić aplikację w trybie deweloperskim (z hot-reloading):

```bash
docker compose -f docker-compose.dev.yml up --build
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

### Tryb Produkcyjny
Aby uruchomić aplikację w trybie produkcyjnym:

```bash
docker compose up --build -d
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

### Migracje i Seedowanie w Dockerze
Jeśli uruchamiasz aplikację po raz pierwszy w Dockerze, może być konieczne wykonanie migracji i seedowania bazy danych:

```bash
# Wykonanie migracji
docker compose exec app npx prisma migrate deploy

# Seedowanie bazy danych
docker compose exec app npx prisma db seed
```