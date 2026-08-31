```java
boolean isEligibleForQuery(String query) {
  query = query.toLowerCase();
  return getName().toLowerCase().contains(query)
      || getIso().toLowerCase().contains(query)
      || getPhoneCode().toLowerCase().contains(query);
}
```