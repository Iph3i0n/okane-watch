SELECT
  c.name as keys,
  SUM(t.amount) as results
FROM
  categories c
  INNER JOIN transactions t ON c.id = t.category
WHERE
  t.date > :from_date
  AND t.date < :to_date