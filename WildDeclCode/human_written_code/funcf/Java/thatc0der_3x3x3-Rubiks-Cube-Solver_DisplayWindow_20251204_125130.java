```java
private void layDownButtons(JButton [] allButtons, int column , int startingButton, int endingButton, int yLevel){
	int [] allXCoordinates = {20,80,140,200,260,320,380,440,500,560,620,680};	
	int [] allYCoordinates = {50,110,170,230,290,350,410,470,530};
	int currButton = column;
	for(int i = startingButton; i < endingButton;i++){
		allButtons[i].setBounds(allXCoordinates[currButton], allYCoordinates[yLevel], SQUARE_SIZE, SQUARE_SIZE);
		currButton++;
		if(i == startingButton + 2 || i == endingButton - 4){
			yLevel++;
			currButton = column;
		}
	}	
}
```