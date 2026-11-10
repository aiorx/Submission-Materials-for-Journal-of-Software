```java
public void setColor(int color) {
    currentColor = color;

    GradientDrawable colorDrawable = new GradientDrawable();
    colorDrawable.setColor(currentColor);
    colorDrawable.setCornerRadius(indicatorSize / 2);
    colorDrawable.setStroke(1, Color.LTGRAY);

    LayerDrawable left = new LayerDrawable(new Drawable[]{backgroundDrawable(), colorDrawable});
    left.setBounds(0, 0, indicatorSize, indicatorSize);
    setCompoundDrawables(left, null, null, null);
}
```