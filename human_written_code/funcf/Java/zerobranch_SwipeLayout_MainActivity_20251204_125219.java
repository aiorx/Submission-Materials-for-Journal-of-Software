```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    findViewById(R.id.left).setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            startActivity(new Intent(getBaseContext(), LeftActivity.class));
        }
    });

    findViewById(R.id.right).setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            startActivity(new Intent(getBaseContext(), RightActivity.class));
        }
    });

    findViewById(R.id.horizontal).setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            startActivity(new Intent(getBaseContext(), HorizontalActivity.class));
        }
    });
}
```