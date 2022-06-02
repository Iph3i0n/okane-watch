SELECT
  c.name as key,
  SUM(t.amount) as value
FROM
  categories c
  INNER JOIN transactions t ON c.id = t.category
WHERE
  t.date > :from_date
  AND t.date < :to_date
GROUP BY
  c.id