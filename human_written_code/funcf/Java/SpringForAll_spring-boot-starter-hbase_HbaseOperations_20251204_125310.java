```java
/**
 * Scans the target table, using the given column family.
 * The content is processed row by row by the given action, returning a list of domain objects.
 *
 * @param tableName target table
 * @param family column family
 * @param <T> action type
 * @return a list of objects mapping the scanned rows
 */
<T> List<T> find(String tableName, String family, final RowMapper<T> mapper);
```