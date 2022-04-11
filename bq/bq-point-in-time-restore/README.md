# Description
Demonstration of Point-In-Time restore of BigQuery, for:  
- Use case 1: deleted records
- Use case 2: deleted tables

⚠ Point-in-Time restore has a maximum span of 7 days.

# Tutorial
## Create Sample
```sql
CREATE OR REPLACE TABLE `education.PointInTime` (
  id int64,
  name string
);

INSERT INTO `education.PointInTime` 
VALUES (1, 'a'), (2, 'b'), (3, 'c');
```

## Use Case 1: Lost Rows
Create the sample dataset above and wait around 10 minutes, then:

```sql
DELETE FROM `education.PointInTime`
WHERE id > 1;
```

Our table now has 1 row, but BigQuery can *travel in time* and recover rows 2 and 3.  
Wait around 10 minutes again, then:

```sql
SELECT id, name
FROM `education.PointInTime`
  FOR SYSTEM_TIME AS OF TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 15 MINUTE)
```

See? Rows 2 and 3 can be recovered by taking a snapshot, for example (https://cloud.google.com/bigquery/docs/table-snapshots-intro)

## Use Case 2: Dropped Table
First, take note of the epoch time (https://www.epochconverter.com/).  
Then:

```sql
DROP TABLE `education.PointInTime`;
```

Unfortunately we can't travel in time in a dropped table ..

```sql
SELECT id, name
FROM `education.PointInTime`
  FOR SYSTEM_TIME AS OF TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 15 MINUTE)
```

.. but we can recover its snapshot via CLI:

```sh
bq cp education.PointInTime@1649705420000 education.PointInTime_RecoveredViaCLI
```

The CLI command itself will tell you what's the latest version available by epoch timestamp:

```
BigQuery error in cp operation: Invalid snapshot time 1649705018 for table
cert-339910:education.PointInTime@1649705018. Cannot read before 1649703664192
```

Just update the epoch timestamp.  
Table restored!