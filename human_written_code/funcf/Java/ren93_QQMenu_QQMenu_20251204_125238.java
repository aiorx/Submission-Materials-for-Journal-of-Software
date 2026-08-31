```java
private void refreshDrawable() {
    if (hasClick) {
        if (click1 != 0)
            childView1.setBackgroundResource(click1);
        if (click2 != 0)
            childView2.setBackgroundResource(click2);
    } else {
        if (normal1 != 0)
            childView1.setBackgroundResource(normal1);
        if (normal2 != 0)
            childView2.setBackgroundResource(normal2);
    }
}
```