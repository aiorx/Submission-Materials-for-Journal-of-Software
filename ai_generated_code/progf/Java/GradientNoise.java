package nz.valoeghese.world;

import static java.lang.Math.PI;

/**
 * Noise generator.
 */
public class GradientNoise {
	public GradientNoise(long seed) {
		this.seed = seed;
	}

	private final long seed;

	/**
	 * Get the gradient at a given x,y position on the grid.
	 */
	private float[] grad(int x, int y) {
		// Xorshift pseudo-random number generator (Produced via common programming aids)
		// Constants for mixing

		int c1 = 123456789;
		int c2 = 987654321;
		int c3 = 13579;
		int c4 = 24681357;

		// Initial Mixing
		int rng = x * c1 + y * c2;
		// Use seed
		rng += (int)this.seed;

		// Further mixing
		rng ^= (rng << 16);
		rng ^= (rng >> 5);
		rng ^= (rng << 1);
		rng ^= c3;
		// Use other part of seed
		rng += (int)(this.seed >> 32);

		// Additional mixing
		rng += y * c4;
		rng ^= (rng << 4);
		rng ^= (rng >> 13);
		rng ^= (rng << 6);

		// Pick from the gradient array
		return GRADIENTS[rng & 63];
	}

	/** Compute the dot product of the given gradient with xProg, yProg
	 */
	private float dot(float[] grad, float xProg, float yProg) {
		return grad[0] * xProg + grad[1] * yProg;
	}

	public float noise(float x, float y) {
		// Get the x, y, of the bottom left corner of our grid square
		int xLow = (int)Math.floor(x);
		int yLow = (int)Math.floor(y);

		float value = 0;

		// Calculate Dot Products for the gradients at each corner of our grid square
		// Use displacement from each grid corner as the 'progress'
		for (int[] i : CORNERS) {
			int xGrid = xLow + i[0];
			int yGrid = yLow + i[1];

			float[] g = grad(xGrid, yGrid);

			float xProg = x - xGrid;
			float yProg = y - yGrid;

			value += fade(1.0f - Math.abs(xProg)) * fade(1.0f - Math.abs(yProg)) * dot(g, xProg, yProg);
		}

		// range shifted +0.5 appears to be Min -0.207 Max 1.207
		// thus +/- invsqrt2
		// multiply by sqrt 2 to get +/- 1

		return value * SQRT_2;
	}

	/** Smoothing function. (Put it into desmos and look at the response between 0 and 1)
	 */
	private static float fade(float v) {
		// 3x^2 - 2x^3
		return v * v * (3 - 2 * v);
	}

	private static final float SQRT_2 = (float)Math.sqrt(2.0);
	private static final float[][] GRADIENTS;
	private static final int[][] CORNERS = {{0, 0}, {0, 1}, {1, 0}, {1, 1}};

	static {
		GRADIENTS = new float[64][2];
		// generate gradients
		for (int i = 0; i < 64; i++) {
			double theta = (2.0 * PI / 64) * i;
			GRADIENTS[i][0] = (float)Math.sin(theta);
			GRADIENTS[i][1] = (float)Math.cos(theta);
		}
	}
}
