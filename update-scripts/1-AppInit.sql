CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  budget REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS people (id TEXT PRIMARY KEY, name TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  person TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  date DATE NOT NULL,
  CONSTRAINT fk_category FOREIGN KEY(category) REFERENCES categories(id),
  CONSTRAINT fk_person FOREIGN KEY(person) REFERENCES people(id)
);