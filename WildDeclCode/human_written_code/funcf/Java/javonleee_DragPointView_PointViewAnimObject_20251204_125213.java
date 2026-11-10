```java
private void start(Animator object, final OnPointDragListener removeListener) {
    view.setVisibility(View.VISIBLE);
    Animator copy = object.clone();
    copy.setTarget(view);
    copy.removeAllListeners();
    copy.addListener(new AnimatorListenerAdapter() {

        @Override
        public void onAnimationEnd(Animator animation) {
            animation.removeListener(this);
            end(removeListener);
        }
    });
    copy.start();
}
```