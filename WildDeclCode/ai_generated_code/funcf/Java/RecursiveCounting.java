```java
public static void printFilesRecursively(File file, int indent) {
    if (file.isDirectory()) {
        System.out.println(getIndentString(indent) + "[" + file.getName() + "]");
        File[] files = file.listFiles();
        if (files != null) {
            for (File subFile : files) {
                printFilesRecursively(subFile, indent + 1);
            }
        }
    } else {
        System.out.println(getIndentString(indent) + file.getName());
    }
}
```