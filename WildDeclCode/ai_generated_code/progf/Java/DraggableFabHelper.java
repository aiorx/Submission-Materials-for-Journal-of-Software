package hcmuaf.fit.pami.fab;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import hcmuaf.fit.pami.R;
import hcmuaf.fit.pami.model.CartManager;
import hcmuaf.fit.pami.view.cart.CartFragment;

/**
 * Aided using common development resources
 */
public class DraggableFabHelper {
    private static float downRawX, downRawY;
    private static final int CLICK_DRAG_TOLERANCE = 10; // pixel, tương đương khoảng ~2-3 dp
    private static final String PREFS_NAME = "fab_position";
    private static final String KEY_X = "x";
    private static final String KEY_Y = "y";
    private static long lastClickTime = 0; // Thêm biến này để giới hạn click
    private static final long CLICK_INTERVAL = 500; // ms

    @SuppressLint("ClickableViewAccessibility")
    public static void setupDraggableFab(AppCompatActivity activity, FrameLayout container, ConstraintLayout fab) {
        CartManager.loadCartFromApi();
        // Badge
        TextView badge = fab.findViewById(R.id.badge);
        CartManager.itemCountLiveData.observe(activity, count -> {
            String badgeText = count + "";
            badge.setText(badgeText);
        });

        final SharedPreferences prefs = activity.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        final int savedX = prefs.getInt(KEY_X, 0);
        final int savedY = prefs.getInt(KEY_Y, 0);
        FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) fab.getLayoutParams();
        params.leftMargin = savedX;
        params.topMargin = savedY;
        fab.setLayoutParams(params);

        fab.setOnClickListener(v -> CartFragment.newInstance().show(activity.getSupportFragmentManager(), "dialog"));

        fab.setOnTouchListener(new View.OnTouchListener() {
            private float dX, dY;
            private int lastAction;

            @Override
            public boolean onTouch(View view, MotionEvent event) {
                int containerWidth = container.getWidth();
                int containerHeight = container.getHeight();

                int fabWidth = fab.getWidth();
                int fabHeight = fab.getHeight();

                switch (event.getActionMasked()) {
                    case MotionEvent.ACTION_DOWN:
                        dX = event.getRawX() - params.leftMargin;
                        dY = event.getRawY() - params.topMargin;
                        downRawX = event.getRawX(); // lưu lại tọa độ khi bắt đầu chạm
                        downRawY = event.getRawY();
                        lastAction = MotionEvent.ACTION_DOWN;
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        int newX = (int) (event.getRawX() - dX);
                        int newY = (int) (event.getRawY() - dY);

                        // Giới hạn trong container
                        newX = Math.max(0, Math.min(newX, containerWidth - fabWidth));
                        newY = Math.max(0, Math.min(newY, containerHeight - fabHeight));

                        params.leftMargin = newX;
                        params.topMargin = newY;
                        fab.setLayoutParams(params);
                        lastAction = MotionEvent.ACTION_MOVE;
                        return true;

                    case MotionEvent.ACTION_UP:
                        float upRawX = event.getRawX();
                        float upRawY = event.getRawY();

                        float deltaX = Math.abs(upRawX - downRawX);
                        float deltaY = Math.abs(upRawY - downRawY);

                        if (deltaX < CLICK_DRAG_TOLERANCE && deltaY < CLICK_DRAG_TOLERANCE) {
                            long now = System.currentTimeMillis();
                            if (now - lastClickTime > CLICK_INTERVAL) {
                                lastClickTime = now;
                                fab.performClick(); // Gọi click hợp lệ
                            }
                        } else {
                            // Đã drag, tự động về cạnh gần nhất
                            int centerX = containerWidth / 2;
                            int finalX = (params.leftMargin + fabWidth / 2 < centerX)
                                    ? 0
                                    : containerWidth - fabWidth;

                            ObjectAnimator anim = ObjectAnimator.ofFloat(fab, "translationX", fab.getTranslationX(), finalX - params.leftMargin);
                            anim.setDuration(300);
                            anim.start();

                            anim.addListener(new AnimatorListenerAdapter() {
                                @Override
                                public void onAnimationEnd(Animator animation) {
                                    fab.setTranslationX(0f);
                                    params.leftMargin = finalX;
                                    fab.setLayoutParams(params);

                                    prefs.edit()
                                            .putInt(KEY_X, finalX)
                                            .putInt(KEY_Y, params.topMargin)
                                            .apply();
                                }
                            });
                        }
                        return true;
                }
                return false;
            }
        });
        // Kiểm tra và sửa vị trí nếu FAB nằm ngoài container
        container.post(() -> {
            int containerWidth = container.getWidth();
            int containerHeight = container.getHeight();
            int fabWidth = fab.getWidth();
            int fabHeight = fab.getHeight();

            boolean changed = false;

            // Giới hạn lại vị trí nếu vượt ra ngoài
            if (params.leftMargin < 0) {
                params.leftMargin = 0;
                changed = true;
            } else if (params.leftMargin > containerWidth - fabWidth) {
                params.leftMargin = containerWidth - fabWidth;
                changed = true;
            }

            if (params.topMargin < 0) {
                params.topMargin = 0;
                changed = true;
            } else if (params.topMargin > containerHeight - fabHeight) {
                params.topMargin = containerHeight - fabHeight;
                changed = true;
            }

            if (changed) {
                fab.setLayoutParams(params);

                // Lưu lại vị trí đã sửa
                prefs.edit()
                        .putInt(KEY_X, params.leftMargin)
                        .putInt(KEY_Y, params.topMargin)
                        .apply();
            }
        });

    }
}
