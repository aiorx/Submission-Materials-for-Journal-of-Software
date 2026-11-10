package test;

import java.awt.Point;
import final_project.SpriteHelper;

/**
 * Unit tests for Sprites. Much of this code has been written at least in part
 * by ChatGPT
 */
public class TestSprite {
    public static void main(String[] args) {
        testIsColliding();
        testGetRotatedRectangleCorners();
    }

    /*
     * Tests Supported via standard programming aids, and modified by me
     */
    public static boolean testIsColliding() {
        // Non-overlapping rectangles
        Point[] nonOverlappingRect1 = { new Point(0, 0), new Point(0, 2), new Point(2, 2), new Point(2, 0) };
        Point[] nonOverlappingRect2 = { new Point(3, 3), new Point(3, 5), new Point(5, 5), new Point(5, 3) };
        if (SpriteHelper.isColliding(nonOverlappingRect1, nonOverlappingRect2)) {
            System.out.println("FAILED: Non overlapping rectangles did collide");
            return false;
        }
        System.out.println("PASSED: Non overlapping rectangles did't collide");
        // Overlapping rectangles
        Point[] overlappingRect1 = { new Point(0, 0), new Point(0, 2), new Point(2, 2), new Point(2, 0) };
        Point[] overlappingRect2 = { new Point(1, 1), new Point(1, 3), new Point(3, 3), new Point(3, 1) };
        if (!SpriteHelper.isColliding(overlappingRect1, overlappingRect2)) {
            System.out.println("FAILED: Overlapping rectangles didn't collide");
            return false;
        }
        System.out.println("PASSED:  Overlapping rectangles did collide");
        // Identical rectangles
        Point[] indenticalRect1 = { new Point(0, 0), new Point(0, 2), new Point(2, 2), new Point(2, 0) };
        Point[] indenticalRect2 = { new Point(0, 0), new Point(0, 2), new Point(2, 2), new Point(2, 0) };
        if (!SpriteHelper.isColliding(indenticalRect1, indenticalRect2)) {
            System.out.println("FAILED: Identical rectangles didn't collide");
            return false;
        }
        System.out.println("PASSED: Identical rectangles did collide");

        // One rectangle inside the other
        Point[] outerRect = { new Point(0, 0), new Point(0, 4), new Point(4, 4), new Point(4, 0) };
        Point[] innerRect = { new Point(1, 1), new Point(1, 2), new Point(2, 2), new Point(2, 1) };
        if (!SpriteHelper.isColliding(innerRect, outerRect)) {
            System.out.println("FAILED: Rectangles inside each other didn't collide");
            return false;
        }
        System.out.println("PASSED: Rectangles inside each other did collide");
        return true;
    }

    public static boolean testGetRotatedRectangleCorners() {
        // Test case 1: Rotation of 0 degrees
        Point[] expectedCorners1 = { new Point(1, -1), new Point(-1, -1), new Point(-1, 1), new Point(1, 1) };
        Point[] actualCorners1 = SpriteHelper.getRotatedRectangleCorners(0, 0, 2, 2, 0);
        for (int i = 0; i < expectedCorners1.length; i++) {
            if (!expectedCorners1[i].equals(actualCorners1[i])) {
                System.out.println("FAILED: Test case 1: Corners are not as expected.");
                return false;
            }
        }
        System.out.println("PASSED: Test case 1: Corners are as expected.");

        // Test case 2: Rotation of 90 degrees
        Point[] expectedCorners2 = { new Point(1, 0), new Point(0, -1), new Point(-1, 0), new Point(0, 1) };
        Point[] actualCorners2 = SpriteHelper.getRotatedRectangleCorners(0, 0, 2, 2, 90);
        for (int i = 0; i < expectedCorners2.length; i++) {
            if (!expectedCorners2[i].equals(actualCorners2[i])) {
                System.out.println("FAILED: Test case 2: Corners are not as expected.");
                return false;
            }
        }
        System.out.println("PASSED: Test case 2: Corners are as expected.");

        // Test case 3: Rotation of 180 degrees
        Point[] expectedCorners3 = { new Point(0, 1), new Point(1, 0), new Point(0, -1), new Point(-1, 0) };
        Point[] actualCorners3 = SpriteHelper.getRotatedRectangleCorners(0, 0, 2, 2, 180);
        for (int i = 0; i < expectedCorners3.length; i++) {
            if (!expectedCorners3[i].equals(actualCorners3[i])) {
                System.out.println("FAILED: Test case 3: Corners are not as expected.");
                return false;
            }
        }
        System.out.println("PASSED: Test case 3: Corners are as expected.");

        // Test case 4: Rotation of 270 degrees
        Point[] expectedCorners4 = { new Point(-1, 0), new Point(0, 1), new Point(1, 0), new Point(0, -1) };
        Point[] actualCorners4 = SpriteHelper.getRotatedRectangleCorners(0, 0, 2, 2, 270);
        for (int i = 0; i < expectedCorners4.length; i++) {
            if (!expectedCorners4[i].equals(actualCorners4[i])) {
                System.out.println("FAILED: Test case 4: Corners are not as expected.");
                return false;
            }
        }
        System.out.println("PASSED: Test case 4: Corners are as expected.");

        // Test case 5: Large rectangle with rotation of 45 degrees
        Point[] expectedCorners5 = { new Point(11, 0), new Point(0, -11), new Point(-11, 0), new Point(0, 11) };
        Point[] actualCorners5 = SpriteHelper.getRotatedRectangleCorners(0, 0, 16, 16, 45);
        for (int i = 0; i < expectedCorners5.length; i++) {
            if (!expectedCorners5[i].equals(actualCorners5[i])) {
                System.out.println("FAILED: Test case 5: Corners are not as expected.");
                return false;
            }
        }
        System.out.println("PASSED: Test case 5: Corners are as expected.");
        return true;
    }
}
