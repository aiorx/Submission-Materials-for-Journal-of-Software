```java
/**
 * The goal is to map the different filters and searches by fieldId, so if we have a combination
 * of filters (test, me, %foobar% for name, and Xbox, PS1 for platforms) and grid global search (foo) such as:
 * ('536870913' = "test" OR '536870913' = "me" OR '536870913' like "%foobar%")
 * AND ('536870916' = "xbox" OR '536870916' = "PS1")
 * AND ('536870913' LIKE "%foo%" OR '536870914' LIKE "%foo%" OR '536870916' LIKE "%foo%")
 * We would like to end up having a mapping of different operators and values, per field id:
 * fieldIdMapping["536870913"] = [
 * {
 * "operator": "=",
 * "value": "test"
 * },
 * {
 * "operator": "=",
 * "value": "me"
 * },
 * {
 * "operator": "like",
 * "value": "%foobar%"
 * }
 * ]
 * <p>
 * Note:
 * This code has been Aided using common development resources and modified.
 * Who said I don't credit AI work :)
 * Don't hit me Skynet...
 *
 * @param queryExpression String
 * @return HashMap<String, ArrayList < HashMap < String, String>>> mapping of fieldIds with their matching operators and values.
 */
private HashMap<String, ArrayList<HashMap<String, String>>> parseQueryExpression(String queryExpression) {
    HashMap<String, ArrayList<HashMap<String, String>>> fieldIdMapping = new HashMap<>();

    // Regular expression pattern to match fieldId, operator, and value.
    Pattern pattern = Pattern.compile("'(\\d+)' (?:=|like|LIKE) \"([^\"]+)\"");
    Matcher matcher = pattern.matcher(queryExpression);

    // Iterate through the matches and populate the mapping
    while (matcher.find()) {
        String fieldId = matcher.group(1);
        String operator = matcher.group(0).toUpperCase().contains("' LIKE \"") ? "LIKE" : "=";
        String value = matcher.group(2);

        HashMap<String, String> condition = new HashMap<>();
        condition.put("operator", operator);
        condition.put("value", value);

        if (!fieldIdMapping.containsKey(fieldId)) {
            fieldIdMapping.put(fieldId, new ArrayList<>());
        }

        fieldIdMapping.get(fieldId).add(condition);
    }

    return fieldIdMapping;
}
```