SELECT
  t.date as key,
  SUM(t.amount) as value
FROM
  transactions t
WHERE
  t.date >= :from_date
  AND t.date < :to_date
GROUP BY
  t.date
ORDER BY
  t.date ASC