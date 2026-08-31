```java
@Override
public void apply(ImageView imageView) {
    BitmapDrawable imageDrawable = (BitmapDrawable) imageView.getDrawable();
    Bitmap source = imageDrawable.getBitmap();
    Bitmap bitmap = apply(source);
    imageView.setImageBitmap(bitmap);
}
```