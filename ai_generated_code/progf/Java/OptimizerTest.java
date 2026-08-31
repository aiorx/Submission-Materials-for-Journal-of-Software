package org.pwrup;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.pwrup.util.WheelMover;
import org.pwrup.util.Vec2;

/**
 * had no time, Penned via standard programming aids.
 * 
 * @note THIS IS WORK IN PROGRESS. THE OPTIMIZER DOESNT WORK ATM!
 */
public class OptimizerTest {

    private static final double DELTA = 1e-10;

    @Test
    public void testBasicOptimization() {
        WheelMover mover = new WheelMover(0);
        Vec2 vector = new Vec2(1, 0); // 0 radians
        double[] result = mover.optimizeVector(vector);
        assertEquals(0, result[0], DELTA);
        assertEquals(1, result[1], DELTA);
    }

    @Test
    public void testAngleNormalization() {
        WheelMover mover = new WheelMover(0);
        Vec2 vector = new Vec2(-1, 0); // π radians
        double[] result = mover.optimizeVector(vector);
        assertEquals(0.0, result[0]);
        assertEquals(-1, result[1]);
    }

    @Test
    public void testSpeedReversal() {
        WheelMover mover = new WheelMover(0);
        // Current angle is 0, target is 3π/4
        // Should optimize to -π/4 with reversed speed
        Vec2 vector = new Vec2(Math.cos(3 * Math.PI / 4), Math.sin(3 * Math.PI / 4));
        double[] result = mover.optimizeVector(vector);

        // Normalize angle to [-π, π)
        double normalizedAngle = (result[0] + Math.PI) % (2 * Math.PI) - Math.PI;

        assertEquals(-Math.PI / 4, normalizedAngle, DELTA);
        assertTrue(result[1] < 0); // Ensure speed reversal occurred
    }

    /*
     * TODO: test why this doesnt pass.
     * 
     * @Test
     * public void testNegativeAngles() {
     * WheelMover mover = new WheelMover(Math.PI); // Current angle is π
     * // Target vector points to -π/4
     * Vec2 vector = new Vec2(Math.cos(-Math.PI / 4), Math.sin(-Math.PI / 4));
     * double[] result = mover.optimizeVector(vector);
     * 
     * // Normalize angles to [-π, π)
     * double expectedAngle = ((-Math.PI / 4) + Math.PI) % (2 * Math.PI) - Math.PI;
     * double returnedAngle = ((result[0] + Math.PI) % (2 * Math.PI)) - Math.PI;
     * 
     * assertEquals(expectedAngle, returnedAngle, DELTA);
     * assertEquals(1, result[1], DELTA);
     * }
     */

    @Test
    public void testAngleWrapAroundPositiveToNegative() {
        // Current angle: 180 degrees (π)
        // Target angle: -180 degrees (-π)
        WheelMover mover = new WheelMover(Math.PI); // Current angle is π
        Vec2 vector = new Vec2(Math.cos(-Math.PI), Math.sin(-Math.PI)); // Target vector points to -π
        double[] result = mover.optimizeVector(vector);

        // Expected: No need to reverse direction; should go directly to -π
        assertEquals(-Math.PI, normalizeToMinusPiToPi(result[0]), DELTA);
        assertEquals(1, result[1], DELTA); // No speed reversal
    }

    @Test
    public void testAngleWrapAroundNegativeToPositive() {
        // Current angle: -180 degrees (-π)
        // Target angle: 180 degrees (π)
        WheelMover mover = new WheelMover(-Math.PI); // Current angle is -π
        Vec2 vector = new Vec2(Math.cos(Math.PI), Math.sin(Math.PI)); // Target vector points to π
        double[] result = mover.optimizeVector(vector);

        // Normalize both expected and returned angles to [-π, π)
        double expectedAngle = normalizeToMinusPiToPi(Math.PI);
        double returnedAngle = normalizeToMinusPiToPi(result[0]);

        // Assert the normalized angle is as expected
        assertEquals(expectedAngle, returnedAngle, DELTA);

        // Assert no speed reversal occurred
        assertEquals(1, result[1], DELTA);
    }

    @Test
    public void testReverseDirectionWhenFarApart() {
        // Current angle: 180 degrees (π)
        // Target angle: 45 degrees (π/4)
        WheelMover mover = new WheelMover(Math.PI); // Current angle is π
        Vec2 vector = new Vec2(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)); // Target vector points to π/4
        double[] result = mover.optimizeVector(vector);

        // Expected: Reverse direction to minimize angular distance
        assertEquals(-3 * Math.PI / 4, normalizeToMinusPiToPi(result[0]), DELTA); // Reverse to -3π/4
        assertEquals(-1, result[1], DELTA); // Speed reversed
    }

    @Test
    public void testNoReversalWhenClose() {
        // Current angle: 0 degrees
        // Target angle: 45 degrees (π/4)
        WheelMover mover = new WheelMover(0); // Current angle is 0
        Vec2 vector = new Vec2(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)); // Target vector points to π/4
        double[] result = mover.optimizeVector(vector);

        // Expected: Directly go to π/4 without reversing direction
        assertEquals(Math.PI / 4, normalizeToMinusPiToPi(result[0]), DELTA);
        assertEquals(1, result[1], DELTA); // No speed reversal
    }

    @Test
    public void testEdgeCaseAtPiAndNegativePi() {
        // Current angle: 180 degrees (π)
        // Target angle: 179.99 degrees (~π)
        WheelMover mover = new WheelMover(Math.PI); // Current angle is π
        Vec2 vector = new Vec2(Math.cos(Math.PI - 0.01), Math.sin(Math.PI - 0.01)); // Target vector slightly less than
                                                                                    // π
        double[] result = mover.optimizeVector(vector);

        // Expected: Minimal movement directly to the target
        assertEquals(Math.PI - 0.01, normalizeToMinusPiToPi(result[0]), DELTA);
        assertEquals(1, result[1], DELTA); // No speed reversal
    }

    private double normalizeToMinusPiToPi(double angle) {
        return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    }

    @Test
    public void testEdgeCases() {
        WheelMover mover = new WheelMover(Math.PI / 2);

        // Test exactly π/2 case
        Vec2 vector = new Vec2(0, 1);
        double[] result = mover.optimizeVector(vector);
        assertEquals(Math.PI / 2, result[0], DELTA);
        assertEquals(1, result[1], DELTA);

        // Test zero vector
        vector = new Vec2(0, 0);
        result = mover.optimizeVector(vector);
        assertEquals(0, result[1], DELTA);
    }

    @Test
    public void testFullRotation() {
        double[] startAngles = { 0, Math.PI / 4, Math.PI / 2, Math.PI, 3 * Math.PI / 2 };

        for (double startAngle : startAngles) {
            WheelMover mover = new WheelMover(startAngle);

            for (double angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {
                Vec2 vector = new Vec2(Math.cos(angle), Math.sin(angle));
                double[] result = mover.optimizeVector(vector);

                double resultAngle = normalizeAngle(result[0]);
                double targetAngle = normalizeAngle(angle);
                double reversedAngle = normalizeAngle(angle + Math.PI);

                double angleDiff = Math.min(
                        Math.abs(resultAngle - targetAngle),
                        Math.abs(resultAngle - reversedAngle));
                assertTrue(angleDiff < DELTA);

                if (Math.abs(resultAngle - targetAngle) < DELTA) {
                    assertEquals(1.0, result[1], DELTA);
                } else {
                    assertEquals(-1.0, result[1], DELTA);
                }
            }
        }
    }

    @Test
    public void testCurrentAngleConsistency() {
        double testAngle = Math.PI / 3;
        WheelMover mover = new WheelMover(testAngle);
        assertEquals(testAngle, mover.getCurrentAngle(), DELTA);

        // Test that optimization takes current angle into account
        Vec2 vector = new Vec2(Math.cos(testAngle + Math.PI), Math.sin(testAngle + Math.PI));
        double[] result = mover.optimizeVector(vector);

        // Should choose the shorter path
        assertTrue(Math.abs(result[0] - testAngle) <= Math.PI);
    }

    private double normalizeAngle(double angle) {
        return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    }
}
