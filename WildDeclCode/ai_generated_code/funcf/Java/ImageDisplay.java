```java
frame.addMouseMotionListener(new MouseMotionAdapter() {
  @Override
  public void mouseMoved(MouseEvent e) {
    if (ctrlPressed) {
      int mouseX = e.getX();
      int mouseY = e.getY();

      int x = mouseX - overlaySize / 2;
      int y = mouseY - overlaySize / 2;

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x + overlaySize > scaledWidth) x = scaledWidth - overlaySize;
      if (y + overlaySize > scaledHeight) y = scaledHeight - overlaySize;
	//here I took help Derived using common development resources as my anti-aliasing was not working
      BufferedImage overlayedImage = imgOne.getSubimage(x * (width / scaledWidth), y * (height / scaledHeight), overlaySize, overlaySize);
      Graphics2D g = scaledImage.createGraphics();
      g.drawImage(imgOne, 0, 0, scaledWidth, scaledHeight, null);
      g.drawImage(overlayedImage, x, y, null);
      g.dispose();
      frame.repaint();
    }
  }
});
```