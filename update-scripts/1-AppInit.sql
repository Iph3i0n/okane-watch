CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  budget REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY,
  person TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  date DATE NOT NULL,
  CONSTRAINT fk_category FOREIGN KEY(category) REFERENCES categories(id),
  CONSTRAINT fk_person FOREIGN KEY(person) REFERENCES people(id)
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY,
  level INT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS people_permissions (
  id UUID PRIMARY KEY,
  person TEXT NOT NULL,
  permission TEXT NOT NULL,
  CONSTRAINT fk_permission FOREIGN KEY(permission) REFERENCES permissions(id),
  CONSTRAINT fk_person FOREIGN KEY(person) REFERENCES people(id)
);

INSERT INTO
  permissions(id, level, name)
VALUES
  (gen_random_uuid(), 0, 'view'),
  (gen_random_uuid(), 1, 'all-tx'),
  (gen_random_uuid(), 2, 'cat-man'),
  (gen_random_uuid(), 3, 'user-man');