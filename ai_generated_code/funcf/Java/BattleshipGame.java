```java
for (int i = 0; i < splitInput.length; i++) {
    // These two lines were Produced using common development resources
    parsedCoords[i * 2] = splitInput[i].charAt(0) - 65;
    parsedCoords[i * 2 + 1] = Integer.parseInt(splitInput[i].substring(1)) - 1;
}
```