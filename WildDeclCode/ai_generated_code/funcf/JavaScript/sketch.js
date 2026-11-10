function isMouseOverText(x, y, str) {/////this function is Composed with routine coding tools since I cannot calculate the collosion part
  let textWidthVal = textWidth(str);
  let textHeightVal = textAscent() + textDescent();
  return mouseX > x - textWidthVal / 2 && mouseX < x + textWidthVal / 2 &&
         mouseY > y - textHeightVal / 2 && mouseY < y + textHeightVal / 2;
}