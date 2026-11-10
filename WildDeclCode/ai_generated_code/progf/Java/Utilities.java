package com.thomas.verdant.util;

import java.awt.geom.Path2D;
import java.awt.geom.Rectangle2D;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Supplier;

import net.minecraft.client.multiplayer.ClientLevel;
import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.core.particles.ParticleOptions;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.tags.BlockTags;
import net.minecraft.util.RandomSource;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.ai.village.poi.PoiManager;
import net.minecraft.world.entity.ai.village.poi.PoiTypes;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.LevelAccessor;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.levelgen.Heightmap;
import net.minecraft.world.phys.AABB;
import net.minecraft.world.phys.Vec3;

public class Utilities {
	public static final List<Direction> HORIZONTAL_DIRECTIONS = List.of(Direction.NORTH, Direction.EAST,
			Direction.SOUTH, Direction.WEST);
	public static final List<Direction> VERTICAL_DIRECTIONS = List.of(Direction.UP, Direction.DOWN);

	// Uses gradient descent to find the lowest point for the given property.
	public static BlockPos gradientDescent(Level level, BlockPos start, Function<BlockState, Integer> evaluate) {

		BlockPos.MutableBlockPos current = new BlockPos.MutableBlockPos().set(start);

		boolean hasFoundLower = true;
		int currentValue = Integer.MAX_VALUE;
		Direction toMoveIn = null;

		while (hasFoundLower) {
			hasFoundLower = false;
			toMoveIn = null;
			// Check each neighbor.
			for (Direction d : Direction.values()) {
				// Store the neighbor's information.
				BlockPos offset = current.relative(d);
				BlockState offsetState = level.getBlockState(offset);
				// If the neighbor has the property, get its value.
				int offsetValue = evaluate.apply(offsetState);
				// If the neighbor has a lower value than the current lowest, update
				// accordingly.
				if (offsetValue < currentValue) {
					toMoveIn = d;
					currentValue = offsetValue;
					hasFoundLower = true;
				}
			}
			// Move.
			if (toMoveIn != null) {
				current = current.move(toMoveIn, 1);
			} else {
				break;
			}
		}

		return current;
	}

	public static void placePlatform(Level level, BlockPos center, double radius, int layers,
			Supplier<BlockState> stateGetter, Function<BlockState, Boolean> isValid) {

		int iRadius = (int) Math.ceil(radius);
		double rsq = radius * radius;
		for (int i = -iRadius; i <= iRadius; i++) {
			for (int k = -iRadius; k <= iRadius; k++) {
				for (int j = -layers; j <= 0; j++) {
					if ((i * i + k * k) < (rsq + j) && isValid.apply(level.getBlockState(center.offset(i, j, k)))) {
						level.setBlockAndUpdate(center.offset(i, j, k), stateGetter.get());
					}
				}
			}
		}
	}

	public static void stackTrace() {
		System.out.println("Stack trace:");
		StackTraceElement[] stackTraces = Thread.currentThread().getStackTrace();
		for (int i = 1; i < stackTraces.length; i++) {
			System.out.println(stackTraces[i]);
		}

	}

	// Maps a value from the range 0 to 1 to the range a to b.
	public static double map(double x, double a, double b) {
		return x * (b - a) + a;
	}

	// Maps a value from the range a to b to the range 0 to 1.
	public static double unmap(double x, double a, double b) {
		return (x - a) / (b - a);
	}

	// Copied from ServerLevel, finds a lightning rod near the given position.
	public static Optional<BlockPos> findLightningRod(ServerLevel level, BlockPos pos) {
		Optional<BlockPos> optional = level.getPoiManager().findClosest((p_215059_) -> {
			return p_215059_.is(PoiTypes.LIGHTNING_ROD);
		}, (p_184055_) -> {
			return p_184055_
					.getY() == level.getHeight(Heightmap.Types.WORLD_SURFACE, p_184055_.getX(), p_184055_.getZ()) - 1;
		}, pos, 128, PoiManager.Occupancy.ANY);
		return optional.map((p_184053_) -> {
			return p_184053_.above(1);
		});
	}

	public static List<Entity> entitiesWithinDistance(Entity notThis, double dist) {
		Vec3 pos = notThis.getEyePosition();
		AABB box = AABB.ofSize(pos, dist, dist, dist);
		return notThis.level().getEntities(notThis, box);
	}

	// Returns true if the line defined by the given position and vector
	// intersects the box, and false otherwise.
	public static boolean checkIntersect(Vec3 pointOnLine, Vec3 directionVector, AABB box) {
		double tMin = (box.minX - pointOnLine.x);
		double tMax = (box.maxX - pointOnLine.x);

		// Check if the range of the line on the X-axis intersects with the box on the
		// X-axis
		if (tMax < 0 || tMin > directionVector.x) {
			return false; // No intersection on the X-axis
		}

		tMin = (box.minY - pointOnLine.y);
		tMax = (box.maxY - pointOnLine.y);

		// Check if the range of the line on the Y-axis intersects with the box on the
		// Y-axis
		if (tMax < 0 || tMin > directionVector.y) {
			return false; // No intersection on the Y-axis
		}

		tMin = (box.minZ - pointOnLine.z);
		tMax = (box.maxZ - pointOnLine.z);

		// Check if the range of the line on the Z-axis intersects with the box on the
		// Z-axis
		return !(tMax < 0 || tMin > directionVector.z);
	}

	// Returns true if the line defined by the given position and vector
	// intersects the box in the direction the vector is pointing, and false
	// otherwise. (NOT YET IMPLEMENTED)
	public static boolean checkDirectionalIntersect(Vec3 pointOnLine, Vec3 directionVector, AABB box) {
		double tMin = (box.minX - pointOnLine.x);
		double tMax = (box.maxX - pointOnLine.x);
		System.out.println("tmin:" + tMin + " and tmax" + tMax);

		// Check if the range of the line on the X-axis intersects with the box on the
		// X-axis
		if (tMax < 0 || tMin > directionVector.x) {
			return false; // No intersection on the X-axis
		}

		tMin = (box.minY - pointOnLine.y);
		tMax = (box.maxY - pointOnLine.y);
		System.out.println("tmin:" + tMin + " and tmax" + tMax);

		// Check if the range of the line on the Y-axis intersects with the box on the
		// Y-axis
		if (tMax < 0 || tMin > directionVector.y) {
			return false; // No intersection on the Y-axis
		}

		tMin = (box.minZ - pointOnLine.z);
		tMax = (box.maxZ - pointOnLine.z);
		System.out.println("tmin:" + tMin + " and tmax" + tMax);

		// Check if the range of the line on the Z-axis intersects with the box on the
		// Z-axis
		return !(tMax < 0 || tMin > directionVector.z);
	}

	public static Entity getLookedAt(Entity looker, double range) {

		// Get entities in distance.
		List<Entity> withinDist = entitiesWithinDistance(looker, range);
		System.out.println(withinDist);
		// Filter by whether they're looked at.
		withinDist = withinDist.stream().filter((entity) -> checkDirectionalIntersect(looker.getEyePosition(),
				looker.getLookAngle(), entity.getBoundingBox())).toList();
		System.out.println(withinDist);
		// Find the closest entity from the list.
		Entity closest = null;
		double closestSqr = range * range;

		for (Entity entity : withinDist) {

			double calcDist = entity.distanceToSqr(looker);
			if (calcDist < closestSqr) {
				closestSqr = calcDist;
				closest = entity;
			}

		}

		return closest;
	}

	public static Entity closestEntityWithinLookAngle(Entity looker, double dist, double theta) {

		// Entities to pick from
		List<Entity> entities = entitiesWithinLookAngle(looker, dist, theta);

		Entity toReturn = null;
		double closestSqr = dist * dist;

		for (Entity entity : entities) {

			double calcDist = entity.distanceToSqr(looker);
			if (calcDist < closestSqr) {
				closestSqr = calcDist;
				toReturn = entity;
			}

		}

		return toReturn;
	}

	// theta in radians
	public static List<Entity> entitiesWithinLookAngle(Entity looker, double dist, double theta) {

		// Get entities in distance.
		List<Entity> withinDist = entitiesWithinDistance(looker, dist);

		// Check if within a certain angle of the entity's center.
		List<Entity> withinTheta = withinDist.stream().filter((entity) -> angle(looker.getLookAngle(),
				entity.getEyePosition().subtract(looker.getEyePosition())) <= theta
				|| angle(looker.getLookAngle(), entity.getPosition(1).subtract(looker.getEyePosition())) <= theta)
				.toList();
		return withinTheta;
	}

	public static double angle(Vec3 v, Vec3 u) {
		double retval = Math.acos(v.dot(u) / (v.length() * u.length()));
		return retval;
	}

	// By ChatGPT. For accessing private static constants needed for world
	// generation.
	// Uses reflection. This is usually considered an extremely bad idea, but
	// desperate times
	// call for desperate measures (although they do not always justify them).
	public static Object getPrivateStaticField(Class<?> clazz, String fieldName)
			throws NoSuchFieldException, IllegalAccessException {
		// Get the Field object for the specified field name
		Field field = clazz.getDeclaredField(fieldName);

		// Override access restrictions for private fields
		field.setAccessible(true);

		// Return the value of the static field (null for static fields)
		return field.get(null);
	}

	// By ChatGPT
	public static int pickNumberWithProbability(RandomSource random, int[] probabilities) {
		int totalWeight = 0;

		for (int weight : probabilities) {
			totalWeight += weight;
		}

		int randomNumber = random.nextInt(totalWeight);
		int cumulativeWeight = 0;

		for (int i = 0; i < probabilities.length; i++) {
			cumulativeWeight += probabilities[i];
			if (randomNumber < cumulativeWeight) {
				return i;
			}
		}

		// This should not happen, but just in case
		return probabilities.length - 1;
	}

	@SuppressWarnings("deprecation")
	public static boolean setSafe(LevelAccessor level, BlockPos pos, BlockState state) {
		if (pos == null) {
			return false;
		}
		if (level.isAreaLoaded(pos, 1) && Utilities.canReplaceBlockAt(level, pos)) {
			level.setBlock(pos, state, 3);
			return true;
		}
		return false;
	}

	@SuppressWarnings("deprecation")
	public static boolean setIfAir(LevelAccessor level, BlockPos pos, BlockState state) {
		if (pos == null) {
			return false;
		}
		if (level.isAreaLoaded(pos, 1) && level.getBlockState(pos).isAir()) {
			level.setBlock(pos, state, 3);
			return true;
		}
		return false;
	}

	@SuppressWarnings("deprecation")
	public static boolean setSafeNoFluid(LevelAccessor level, BlockPos pos, BlockState state) {
		if (pos == null) {
			return false;
		}
		if (level.isAreaLoaded(pos, 1) && Utilities.canReplaceBlockNoFluidAt(level, pos)) {
			level.setBlock(pos, state, 3);
			return true;
		}
		return false;
	}

	@SuppressWarnings("deprecation")
	public static boolean setSculkSafe(LevelAccessor level, BlockPos pos, BlockState state) {
		if (pos == null) {
			return false;
		}
		if (level.isAreaLoaded(pos, 1) && Utilities.sculkReplacableAt(level, pos)) {
			level.setBlock(pos, state, 3);
			return true;
		}
		return false;
	}

	public static boolean setSculk(LevelAccessor level, BlockPos pos) {
		return setSculkSafe(level, pos, Blocks.SCULK.defaultBlockState());
	}

	// Function to get enclosed grid points
	public static ArrayList<BlockPos> getEnclosedGridPoints(BlockPos p1, BlockPos p2, BlockPos p3) {
		// Create a cubic spline interpolation (closed curve)

		Path2D path = new Path2D.Double();
		int x1 = p1.getX();
		int x2 = p2.getX();
		int x3 = p3.getX();
		int z1 = p1.getZ();
		int z2 = p2.getZ();
		int z3 = p3.getZ();
		int y = (p1.getY() + p2.getY() + p3.getY()) / 3;

		// Gets the center.
		int centx = (x1 + x2 + x3) / 3;
		int centz = (z1 + z2 + z3) / 3;

		// Connect the first two points with a smooth curve.
		// Gets the control point.
		int ctrlx1 = 2 * (x1 + x2) - 3 * centx;
		int ctrlz1 = 2 * (z1 + z2) - 3 * centz;
		path.moveTo(x1, z1);
		path.quadTo(ctrlx1, ctrlz1, x2, z2);

		// Connect the next two points.
		int ctrlx2 = 2 * (x2 + x3) - 3 * centx;
		int ctrlz2 = 2 * (z2 + z3) - 3 * centz;
		path.quadTo(ctrlx2, ctrlz2, x3, z3);

		// Full blob.
		int ctrlx3 = 2 * (x3 + x1) - 3 * centx;
		int ctrlz3 = 2 * (z3 + z1) - 3 * centz;
		path.quadTo(ctrlx3, ctrlz3, x1, z1);
		path.closePath();

		Rectangle2D bounds = path.getBounds2D();
		// Define the bounding box for the grid
		int minX = (int) bounds.getMinX();
		int minZ = (int) bounds.getMinY();
		int maxX = (int) bounds.getMaxX();
		int maxZ = (int) bounds.getMaxY();

		// Get the enclosed grid points
		ArrayList<BlockPos> enclosedPoints = new ArrayList<>();

		for (int x = minX; x <= maxX; x += 1.0) {
			for (int z = minZ; z <= maxZ; z += 1.0) {
				if (path.contains(x, z)) {
					enclosedPoints.add(new BlockPos(x, y, z));
				}
			}
		}

		return enclosedPoints;
	}

	public static ArrayList<int[]> getCoordinatesInRadius(int radius) {
		ArrayList<int[]> coordinatesList = new ArrayList<>();

		for (int x = -radius; x <= radius; x++) {
			for (int y = -radius; y <= radius; y++) {
				if (isWithinRadius(x, y, radius)) {
					int[] coordinates = { x, y };
					coordinatesList.add(coordinates);
				}
			}
		}

		return coordinatesList;
	}

	private static boolean isWithinRadius(int x, int y, int radius) {
		return (x * x) + (y * y) <= (radius * radius);
	}

	// Converts rgb to hex
	public static int toHexColor(int r, int g, int b) {
		r = r & 255;
		g = g & 255;
		b = b & 255;

		return (r << 16) | (g << 8) | (b);

	}

	// Returns a random horizontal direction.
	public static Direction randomHorizontalDirection(RandomSource rand) {
		return HORIZONTAL_DIRECTIONS.get(rand.nextInt(4));
	}

	// Returns a random vertical direction.
	public static Direction randomVerticalDirection(RandomSource rand) {
		return VERTICAL_DIRECTIONS.get(rand.nextInt(2));
	}

	// Returns a block position within the given radius at a random position.
	// The block position will have y=0 and x^2 + z^2 <= radius^2.
	public static BlockPos withinCircle(RandomSource rand, double radius) {
		// Ensure radius is positive.
		radius = Math.abs(radius);

		double placementRadius = radius * rand.nextDouble();
		double angle = 2 * Math.PI * rand.nextDouble();

		return new BlockPos((int) Math.round(Math.cos(angle) * placementRadius), 0,
				(int) Math.round(Math.sin(angle) * placementRadius));
	}

	public static BlockPos withinCircle(RandomSource rand, double minRadius, double maxRadius) {
		// Ensure radius is positive.
		minRadius = Math.abs(minRadius);
		maxRadius = Math.abs(maxRadius);

		double placementRadius = Math.abs(maxRadius - minRadius) * rand.nextDouble() + Math.min(minRadius, maxRadius);
		double angle = 2 * Math.PI * rand.nextDouble();

		return new BlockPos((int) Math.round(Math.cos(angle) * placementRadius), 0,
				(int) Math.round(Math.sin(angle) * placementRadius));
	}

	// Checks if a block position is a valid respawn point.
	private static boolean isValidRespawn(Level level, BlockPos pos) throws NullPointerException {

		BlockState above = level.getBlockState(pos.above());
		BlockState at = level.getBlockState(pos);
		BlockState below = level.getBlockState(pos.below());
		// System.out.println("Column is: " + below.getBlock() + " " + at.getBlock() + "
		// " + above.getBlock());

		boolean isBottomSolid = below.isFaceSturdy(level, pos, Direction.UP);
		boolean isEmpty = at.canBeReplaced() && above.canBeReplaced();

		// System.out.println("Is the bottom solid? " + isBottomSolid);
		// System.out.println("Is it empty? " + isEmpty);
		return isBottomSolid && isEmpty;
	}

	// Gets a nearby respawn point that will be valid.
	// If there are no valid respawn points, returns null.
	// Searches from the inside out.
	public static BlockPos getNearbyRespawn(Level level, BlockPos start, int maxDistance) {

		BlockPos npos = null;
		for (int i = 0; i < maxDistance; i++) {
			npos = iterateCubeSurfaceForRespawn(i, start, level);
			if (npos != null) {
				return start.offset(npos.getX(), npos.getY(), npos.getZ());
			}
		}

		return null;
	}

	public static BlockPos iterateCubeSurfaceForRespawn(int n, BlockPos start, Level level) {

		for (int i = -n; i <= n; i++) {
			for (int j = -n; j <= n; j++) {

				if (isValidRespawn(level, start, i, -n, j)) {
					return new BlockPos(i, j, -n);
				} else if (isValidRespawn(level, start, i, n, j)) {
					return new BlockPos(i, n, j);
				} else if (isValidRespawn(level, start, -n, i, j)) {
					return new BlockPos(-n, i, j);
				} else if (isValidRespawn(level, start, n, i, j)) {
					return new BlockPos(n, i, j);
				} else if (isValidRespawn(level, start, i, j, -n)) {
					return new BlockPos(i, j, -n);
				} else if (isValidRespawn(level, start, i, j, n)) {
					return new BlockPos(i, j, n);
				}
			}
		}

		return null;

	}

	private static boolean isValidRespawn(Level level, BlockPos start, int i, int j, int k) {
		return isValidRespawn(level, new BlockPos(start.getX() + i, start.getY() + j, start.getZ() + k));
	}

	public static void addParticlesAroundEntity(Entity entity, ParticleOptions particle) {
		addParticlesAroundEntity(entity, particle, 1.0);
	}

	public static void addParticlesAroundEntity(Entity entity, ParticleOptions particle, double boxSize) {
		Level level = entity.level();
		addParticlesAroundPosition(level, entity.getEyePosition(), particle, boxSize);
	}

	public static void addParticlesAroundEntity(ServerLevel level, Entity entity, ParticleOptions particle,
			double boxSize) {
		addParticlesAroundEntity(level, entity, particle, boxSize, 5);
	}

	public static void addParticlesAroundEntity(ServerLevel level, Entity entity, ParticleOptions particle,
			double boxSize, int count) {
		addParticlesAroundPositionServer(level, entity.getEyePosition(), particle, boxSize, count);
	}

	public static void addParticlesAroundPosition(LevelAccessor level, Vec3 position, ParticleOptions particle,
			double boxSize) {
		for (int i = 0; i < 5; ++i) {
			double dx = level.getRandom().nextGaussian() * 0.02D;
			double dy = level.getRandom().nextGaussian() * 0.02D;
			double dz = level.getRandom().nextGaussian() * 0.02D;
			double x = (2.0D * level.getRandom().nextDouble() - 1.0D) * boxSize + position.x;
			double y = (2.0D * level.getRandom().nextDouble() - 1.0D) * boxSize + position.y;
			double z = (2.0D * level.getRandom().nextDouble() - 1.0D) * boxSize + position.z;
			level.addParticle(particle, x, y, z, dx, dy, dz);
		}
	}

	public static void addParticlesAroundPositionClient(ClientLevel level, Vec3 position, ParticleOptions particle,
			double boxSize) {
		for (int i = 0; i < 5; ++i) {
			double dx = level.random.nextGaussian() * 0.02D;
			double dy = level.random.nextGaussian() * 0.02D;
			double dz = level.random.nextGaussian() * 0.02D;
			double x = (2.0D * level.random.nextDouble() - 1.0D) * boxSize + position.x;
			double y = (2.0D * level.random.nextDouble() - 1.0D) * boxSize + position.y;
			double z = (2.0D * level.random.nextDouble() - 1.0D) * boxSize + position.z;
			level.addParticle(particle, x, y, z, dx, dy, dz);
		}
	}

	public static void addParticlesAroundPositionServer(ServerLevel level, Vec3 position, ParticleOptions particle,
			double boxSize, int count) {
		// Send to all players. Their clients can decide to render or not.
		List<ServerPlayer> players = level.getPlayers((player) -> true);

		double dx = boxSize * 2;
		double dy = boxSize * 2;
		double dz = boxSize * 2;
		double x = (2.0D * level.random.nextDouble() - 1.0D) * boxSize + position.x;
		double y = (2.0D * level.random.nextDouble() - 1.0D) * boxSize + position.y;
		double z = (2.0D * level.random.nextDouble() - 1.0D) * boxSize + position.z;
		double maxSpeed = 0;
		boolean overrideLimit = true;
		for (ServerPlayer player : players) {
			level.sendParticles(player, particle, overrideLimit, x, y, z, count, dx, dy, dz, maxSpeed);
		}
	}

	// Rotates the given x, y, z position so that z-vector is aligned with the
	// facing vector.
	public static Vec3 localCoordinates(Vec3 at, Vec3 facing, Vec3 offset) {

		// Calculate the end position of z.
		facing = facing.normalize();

		// Calculate the rotation matrix
		double[][] rotationMatrix = Matrix.calculateRotationMatrix(facing, new Vec3(0, 0, 1));

		// Calculate the final position.
		Vec3 endPos = Matrix.matToVec(Matrix.multiplyMatrix(rotationMatrix, Matrix.vecToMat(offset)));

		return at.add(endPos);
	}

	// Composed with basic coding tools
	public static class Matrix {

		public static double[][] calculateRotationMatrix(Vec3 originalVector, Vec3 targetVector) {
			// Step 1: Calculate the Axis of Rotation
			Vec3 axis = originalVector.cross(targetVector).normalize();

			// Step 2: Calculate the Angle of Rotation
			double angle = Math
					.acos(originalVector.dot(targetVector) / (originalVector.length() * targetVector.length()));

			// Step 3: Construct the Rotation Matrix
			return calculateRotationMatrix(axis, angle);
		}

		public static double[][] calculateRotationMatrix(Vec3 axis, double angle) {
			double cosTheta = Math.cos(angle);
			double sinTheta = Math.sin(angle);

			return new double[][] {
					{ cosTheta + axis.x * axis.x * (1 - cosTheta), axis.x * axis.y * (1 - cosTheta) - axis.z * sinTheta,
							axis.x * axis.z * (1 - cosTheta) + axis.y * sinTheta },
					{ axis.y * axis.x * (1 - cosTheta) + axis.z * sinTheta, cosTheta + axis.x * axis.y * (1 - cosTheta),
							axis.y * axis.z * (1 - cosTheta) - axis.x * sinTheta },
					{ axis.z * axis.x * (1 - cosTheta) - axis.y * sinTheta,
							axis.z * axis.y * (1 - cosTheta) + axis.x * sinTheta,
							cosTheta + axis.z * axis.z * (1 - cosTheta) } };
		}

		public static Vec3 matToVec(double[][] arr) {
			return new Vec3(arr[0][0], arr[1][0], arr[2][0]);
		}

		public static double[][] vecToMat(Vec3 vec) {
			return new double[][] { new double[] { vec.x }, new double[] { vec.y }, new double[] { vec.z } };
		}

		// Composed with basic coding tools
		public static double[][] multiplyMatrix(double[][] matrixA, double[][] matrixB) {
			int rowsA = matrixA.length;
			int colsA = matrixA[0].length;
			int colsB = matrixB[0].length;

			if (matrixB.length != colsA) {
				throw new IllegalArgumentException("Incompatible matrix dimensions for multiplication");
			}

			double[][] result = new double[rowsA][colsB];

			for (int i = 0; i < rowsA; i++) {
				for (int j = 0; j < colsB; j++) {
					for (int k = 0; k < colsA; k++) {
						result[i][j] += matrixA[i][k] * matrixB[k][j];
					}
				}
			}

			return result;

		}

	}

	public static byte max(byte a, byte b) {
		return a > b ? a : b;
	}

	public static byte min(byte a, byte b) {
		return a < b ? a : b;
	}

	public static int max(int a, int b) {
		return a > b ? a : b;
	}

	public static int min(int a, int b) {
		return a < b ? a : b;
	}

	public static float max(float a, float b) {
		return a > b ? a : b;
	}

	public static float min(float a, float b) {
		return a < b ? a : b;
	}

	public static double max(double a, double b) {
		return a > b ? a : b;
	}

	public static double min(double a, double b) {
		return a < b ? a : b;
	}

	public static boolean checkEqualStates(BlockState blockstate, BlockState target) {
		boolean isCorrectBlock = target.is(blockstate.getBlock());
		boolean doAllMatch = blockstate.getProperties().stream().map((property) -> target.hasProperty(property)
				&& target.getValue(property).equals(blockstate.getValue(property))).allMatch((bool) -> bool);
		return isCorrectBlock && doAllMatch;
	}

	public static boolean canReplaceBlock(BlockState state) {
		return !state.is(BlockTags.FEATURES_CANNOT_REPLACE);
	}

	public static boolean canReplaceBlockNoFluid(BlockState state) {
		return !state.is(BlockTags.FEATURES_CANNOT_REPLACE) && state.getFluidState().isEmpty();
	}

	public static boolean sculkReplacable(BlockState state) {
		return state.is(BlockTags.SCULK_REPLACEABLE_WORLD_GEN);
	}

	public static boolean sculkReplacableAt(LevelAccessor level, BlockPos pos) {
		return sculkReplacable(level.getBlockState(pos));
	}

	public static boolean canReplaceBlockAt(LevelAccessor level, BlockPos pos) {
		return canReplaceBlock(level.getBlockState(pos));
	}

	public static boolean canReplaceBlockNoFluidAt(LevelAccessor level, BlockPos pos) {
		return canReplaceBlockNoFluid(level.getBlockState(pos));
	}

	// Moves the given position downward to above a solid block.
	@SuppressWarnings("deprecation")
	public static BlockPos sink(LevelAccessor level, BlockPos pos) {

		BlockState state = level.getBlockState(pos);

		while (!state.isSolid()) {
			pos = pos.below();
			state = level.getBlockState(pos);
		}

		return pos.above();
	}

	// Splits argb channels into int array r g b a.
	public static int[] splitChannels(int color) {
		return new int[] { (color >> 16) & 0xFF, (color >> 8) & 0xFF, (color >> 0) & 0xFF, (color >> 24) & 0xFF };
	}

	// Reverses splitChannels
	public static int mergeChannels(int[] channels) {
		return (channels[0] << 16) + (channels[1] << 8) + (channels[2] << 0) + (channels[3] << 24);
	}
}
