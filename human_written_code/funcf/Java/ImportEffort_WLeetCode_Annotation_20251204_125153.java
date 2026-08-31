```java
public static void getHeroNameInfo(Hero hero) {
    try {
        Class<? extends Hero> clazz = hero.getClass();
        Field field = clazz.getDeclaredField("heroName");
        // Field isAnnotationPresent 判断一个属性是否被对应的注解修饰
        if (field.isAnnotationPresent(HeroName.class)) {
            //field.getAnnotation 获取属性的注解
            HeroName fruitNameAnno = field.getAnnotation(HeroName.class);
            hero.setHeroName("name = " +fruitNameAnno.value() +" alias = " + fruitNameAnno.alias());
        }
    } catch (NoSuchFieldException e) {
        e.printStackTrace();
    }
}
```