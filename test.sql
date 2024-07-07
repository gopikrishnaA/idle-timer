-- Ensure these indexes exist
CREATE INDEX idx_liq_customer_wcis_id ON v_liq_customer (wcis_id);
CREATE INDEX idx_wcis_legalentity_clientid ON v_wcis_legalentity (clientid);

-- Optimized query with filtering before join
SELECT
    COUNT(*) AS duplicates
FROM
    (SELECT
         wcis.clientid,
         upper(regexp_replace(wcis.legal_trade_name, '\\W', '')) AS clean_legal_trade_name
     FROM
         v_wcis_legalentity wcis) wcis
INNER JOIN
    (SELECT
         cust.wcis_id,
         upper(regexp_replace(cust.short_name, '\\W', '')) AS clean_short_name
     FROM
         v_liq_customer cust
     WHERE
         cust.wcis_id = '230527317') cust
ON
    cust.wcis_id <> wcis.clientid
    AND cust.clean_short_name = wcis.clean_legal_trade_name;

---------------------------------------------------------------------

-- Create temporary tables with preprocessed names
CREATE TEMP TABLE temp_liq_customer AS
SELECT
    wcis_id,
    upper(regexp_replace(short_name, '\\W', '')) AS clean_short_name
FROM
    v_liq_customer
WHERE
    wcis_id = '230527317';

CREATE TEMP TABLE temp_wcis_legalentity AS
SELECT
    clientid,
    upper(regexp_replace(legal_trade_name, '\\W', '')) AS clean_legal_trade_name
FROM
    v_wcis_legalentity;

-- Optimized query using temporary tables
SELECT
    COUNT(*) AS duplicates
FROM
    temp_liq_customer cust
INNER JOIN
    temp_wcis_legalentity wcis
    ON cust.wcis_id <> wcis.clientid
    AND cust.clean_short_name = wcis.clean_legal_trade_name;
