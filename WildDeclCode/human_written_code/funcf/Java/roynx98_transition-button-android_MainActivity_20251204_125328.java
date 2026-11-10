```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    WindowUtils.makeStatusbarTransparent(this);
    getSupportActionBar().hide();

    transitionButton = findViewById(R.id.transition_button);

    transitionButton.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            // Then start the loading animation when the user tap the button
            transitionButton.startAnimation();

            // Do your networking task or background work here.
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    boolean isSuccessful = false;

                    if (isSuccessful) {
                        transitionButton.stopAnimation(TransitionButton.StopAnimationStyle.EXPAND, new TransitionButton.OnAnimationStopEndListener() {
                            @Override
                            public void onAnimationStopEnd() {
                                Intent intent = new Intent(getBaseContext(), NewActivity.class);
                                intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                                startActivity(intent);
                            }
                        });
                    } else {
                        transitionButton.stopAnimation(TransitionButton.StopAnimationStyle.SHAKE, null);
                    }
                }
            }, 2000);
        }
    });
}
```