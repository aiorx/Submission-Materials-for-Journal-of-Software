```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main2);
    personLinearLayout = findViewById(R.id.person_linear_layout);
    favorite = findViewById(R.id.favorite);
    cactusCardView = findViewById(R.id.cactus_card_view);
    personLinearLayout.setOnClickListener(view -> {
        Intent intent = new Intent(getApplicationContext(), Main3Activity.class);
        startActivity(intent);
    });
    favorite.setOnClickListener(view -> {
        Intent intent = new Intent(getApplicationContext(), Main4Activity.class);
        startActivity(intent);
    });
    cactusCardView.setOnClickListener(view -> {
        Intent intent = new Intent(getApplicationContext(), Main5Activity.class);
        startActivity(intent);

    });
}
```