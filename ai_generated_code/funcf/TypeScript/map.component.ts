```typescript
private static closestPointAndDistanceToSegment(x1: number, y1: number, x2: number, y2: number, pointX: number, pointY: number): { closestPoint: { x: number, y: number }, distance: number } {
	const dx = x2 - x1;
	const dy = y2 - y1;

	// Handle case where segment is a single point
	if (dx === 0 && dy === 0) {
		return {closestPoint: {x: x1, y: y1}, distance: Math.hypot(pointX - x1, pointY - y1)};
	}

	// Compute projection scalar t
	const t = ((pointX - x1) * dx + (pointY - y1) * dy) / (dx * dx + dy * dy);

	// Clamp t to [0, 1] to restrict to the segment
	const tClamped = Math.max(0, Math.min(1, t));

	// Compute closest point on the segment
	const closestX = x1 + tClamped * dx;
	const closestY = y1 + tClamped * dy;

	return {closestPoint: {x: closestX, y: closestY}, distance: Math.hypot(pointX - closestX, pointY - closestY)};
}
```