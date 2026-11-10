```java
@Override
public void onBackPressed() {
    if (viewPager.getCurrentItem() == 0) {
        // If the user is currently looking at the first step, allow the system to handle the
        // Back button. This calls finish() on this activity and pops the back stack.
        super.onBackPressed();
    } else {
        // Otherwise, select the previous step.
        viewPager.setCurrentItem(viewPager.getCurrentItem() - 1);
    }
}
```