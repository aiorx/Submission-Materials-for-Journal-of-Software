```java
countDownTimer = new CountDownTimer(millisUntilTarget, 1000) {
    @Override
    public void onTick(long millisUntilFinished) {
        long hours = millisUntilFinished / (1000 * 60 * 60);
        long minutes = (millisUntilFinished / (1000 * 60)) % 60;
        long seconds = (millisUntilFinished / 1000) % 60;
        String formatted = String.format(typeOfCountdown +"\n%02d:%02d:%02d", hours, minutes, seconds);
        countdownLiveData.postValue(formatted); //uses postValue instead of setValue as this value is updated asynchronously with countdownTimer
    }

    @Override
    public void onFinish() {
        countdownLiveData.postValue("00:00:00");
        setCountdownAdapted();
        /*
         retriggers setCountdownAdapted so that the timer isn't stuck on 00:00:00
         and continues to count down to the next phase (Results -> New Word -> Results etc)
         */
    }
};
```