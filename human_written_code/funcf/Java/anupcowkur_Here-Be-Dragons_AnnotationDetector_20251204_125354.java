```java
public static boolean hasAnnotation(PsiElement element, String annotationName) {
    return findAnnotation(element, annotationName) != null;
}
```