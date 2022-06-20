# Okane Watch

Welcome to Okane watch. This is a tool to help families manage budget. It is self hosted through Docker and provides ways of adding family members, setting areas and budgets, and logging transactions.

## Setup

A simple docker compose is your best way to set this up. See example below. Remember to change the admin password when you start.

``` YAML
version: "3.9"
services:
  db:
    image: postgres:latest
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: PG_PASSWORD
      POSTGRES_USER: okane_watch
      POSTGRES_DB: okane_watch
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - ./pg-data:/var/lib/postgresql/data

  okane-watch:
    image: iph3i0n/okane-watch:latest
    restart: unless-stopped
    environment:
      SITE_URL: https://www.your-domain.com/
      DB_USER: okane_watch
      DB_PASSWORD: PG_PASSWORD
      DB_PORT: 5432
      DB_HOST: db
      DB_DATABASE: okane_watch
      ADMIN_USERNAME: admin
      ADMIN_PASSWORD: password
      JWT_SECRET: EXAMPLE_SECRET_KEY
```

TODO:

- [ ] Tags
- [x] Transaction Filtering
- [ ] Import from CSV
- [ ] Dept management
- [ ] Budget after bills
- [ ] Your account
- [ ] Auth0

## Aspirations

One day we would love this to use OpenBanking and work as a budget management tool that would be useful for everyone!