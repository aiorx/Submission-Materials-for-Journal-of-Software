```java
public void decreaseScore(View view) {
    // Get the ID of the button that was clicked
    int viewID = view.getId();
    switch (viewID) {
        //If it was on Team 1
        case R.id.decreaseTeam1:
            //Decrement the score and update the TextView
            mScore1--;
            mScoreText1.setText(String.valueOf(mScore1));
            break;
        //If it was Team 2
        case R.id.decreaseTeam2:
            //Decrement the score and update the TextView
            mScore2--;
            mScoreText2.setText(String.valueOf(mScore2));
    }
}
```