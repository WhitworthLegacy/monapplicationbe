-- Liste toutes les tables dans le schéma public avec leurs colonnes
SELECT
    t.table_name,
    string_agg(
        c.column_name || ' (' || c.data_type || ')',
        ', '
        ORDER BY c.ordinal_position
    ) as columns
FROM
    information_schema.tables t
LEFT JOIN
    information_schema.columns c
    ON t.table_name = c.table_name
    AND t.table_schema = c.table_schema
WHERE
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
GROUP BY
    t.table_name
ORDER BY
    t.table_name;

-- OU version simple (juste les noms):
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_type = 'BASE TABLE'
-- ORDER BY table_name;
