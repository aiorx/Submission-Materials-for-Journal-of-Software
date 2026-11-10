```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    AutoSwitchView aswBanner = (AutoSwitchView) findViewById(R.id.auto_roll_banner);
    aswBanner.setAdapter(new BannerAdapter());
    aswBanner.setSwitchStrategy(
            new CarouselStrategyBuilder().
                    setAnimDuration(900).
                    setInterpolator(new AccelerateDecelerateInterpolator()).
                    setMode(DirectionMode.right2Left).
                    build()
    );
    aswBanner.setOnItemClickListener(new BaseSwitchView.OnItemClickListener() {
        @Override
        public void onItemClick(BaseSwitchView parent, View child, int position) {
            Toast.makeText(MainActivity.this, "position=" + position, Toast.LENGTH_SHORT).show();
        }
    });

    AutoSwitchView autoSwitchView = (AutoSwitchView) findViewById(R.id.auto_roll_0);
    autoSwitchView.setAdapter(new HornAdapter(mEntityList));

    AutoSwitchView autoSwitchView1 = (AutoSwitchView) findViewById(R.id.auto_roll_1);
    autoSwitchView1.setAdapter(new HornAdapter(mEntityList));
    autoSwitchView1.setSwitchStrategy(
            new CarouselStrategyBuilder().
                    setAnimDuration(500).
                    setInterpolator(new DecelerateInterpolator()).
                    setMode(DirectionMode.bottom2Top).
                    build()
    );

    AutoSwitchView autoSwitchView2 = (AutoSwitchView) findViewById(R.id.auto_roll_2);
    autoSwitchView2.setAdapter(new SingleTextAdapter("I am Animation"));
    autoSwitchView2.setSwitchStrategy(
            new AnimationStrategyBuilder(this, R.anim.anim_in, R.anim.anim_out).
                    build()
    );

    AutoSwitchView autoSwitchView3 = (AutoSwitchView) findViewById(R.id.auto_roll_3);
    autoSwitchView3.setAdapter(new SingleTextAdapter("I am Animator"));
    autoSwitchView3.setSwitchStrategy(
            new AnimatorStrategyBuilder(this, R.animator.anim_in, R.animator.anim_out).
                    build()
    );

    AutoSwitchView autoSwitchView4 = (AutoSwitchView) findViewById(R.id.auto_roll_4);
    autoSwitchView4.setAdapter(new PortraitAdapter());
    autoSwitchView4.setSwitchStrategy(
            new ContinuousStrategyBuilder().
                    setDuration(2000).
                    setMode(DirectionMode.left2Right).
                    build()
    );
}
```