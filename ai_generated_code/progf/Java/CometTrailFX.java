package javaFX;

import javafx.animation.AnimationTimer;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.effect.DropShadow;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

import java.util.LinkedList;

/**
 * @Description: JavaFX 应用，展示带拖尾特效的小球在平面上跳动前进
 * @Author: Aided using common development resources
 */
public class CometTrailFX extends Application {

    private static final int WIDTH = 800;
    private static final int HEIGHT = 600;
    private static final int TRAIL_LENGTH = 40;
    private static final double BALL_RADIUS = 6;
    private static final double SPEED_X = 2.5;
    private static final double BOUNCE_AMPLITUDE = 60;
    private static final double BOUNCE_FREQUENCY = 3.5;

    private GraphicsContext gc;
    private double time = 0;
    private double posX = 0;
    private double centerY = HEIGHT / 2.0;
    private LinkedList<Double> trailX = new LinkedList<>();
    private LinkedList<Double> trailY = new LinkedList<>();

    @Override
    public void start(Stage primaryStage) {
        Pane root = new Pane();
        Canvas canvas = new Canvas(WIDTH, HEIGHT);
        gc = canvas.getGraphicsContext2D();

        // 可选：添加光晕效果
        DropShadow glow = new DropShadow();
        glow.setRadius(20);
        glow.setColor(Color.rgb(250, 250, 0, 0.6));
        canvas.setEffect(glow);
        root.getChildren().add(canvas);

        Scene scene = new Scene(root, WIDTH, HEIGHT, Color.BLACK);

        primaryStage.setTitle("Comet Trail FX");
        primaryStage.setScene(scene);
        primaryStage.show();

        new AnimationTimer() {
            @Override
            public void handle(long now) {
                update();
                render();
            }
        }.start();
    }

    private void update() {
        time += 0.016; // 大约60 FPS
        posX += SPEED_X;

        // 重置，使球回到左侧循环
        if (posX - BALL_RADIUS > WIDTH) {
            posX = -BALL_RADIUS;
            trailX.clear();
            trailY.clear();
        }

        // 计算跳动Y坐标（正弦波）
        double y = centerY + Math.sin(time * BOUNCE_FREQUENCY) * BOUNCE_AMPLITUDE;

        // 记录轨迹点
        trailX.addFirst(posX);
        trailY.addFirst(y);
        if (trailX.size() > TRAIL_LENGTH) {
            trailX.removeLast();
            trailY.removeLast();
        }
    }

    private void render() {
        // 清空背景
        gc.setFill(Color.BLACK);
        gc.fillRect(0, 0, WIDTH, HEIGHT);

        // 绘制拖尾：连接线段，渐变粗细和透明度
        for (int i = 1; i < trailX.size() - 1; i++) {
            double alpha = 1.0 - (i / (double) TRAIL_LENGTH);
            double lineWidth = BALL_RADIUS * alpha;
            double x1 = trailX.get(i);
            double y1 = trailY.get(i);
            double x2 = trailX.get(i + 1);
            double y2 = trailY.get(i + 1);

            gc.setStroke(Color.rgb(255, 230, 150, alpha));
            gc.setLineWidth(lineWidth);
            gc.strokeLine(x1, y1, x2, y2);
        }

        // 绘制主球
        double currentY = trailY.isEmpty() ? centerY : trailY.getFirst();
        gc.setFill(Color.YELLOW);
        gc.fillOval(posX  - BALL_RADIUS / 2, currentY  - BALL_RADIUS / 2, BALL_RADIUS, BALL_RADIUS);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
