ALTER TABLE
  categories
ADD
  COLUMN IF NOT EXISTS person UUID CONSTRAINT fk_person REFERENCES people (id);