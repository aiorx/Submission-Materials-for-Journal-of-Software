```js
function solveCollision(pt1, pt2) { // first version Supported via standard programming aids ^^
  
  const dx = pt2.x - pt1.x;
  const dy = pt2.y - pt1.y;
  const distance = Math.sqrt(dx * dx + dy * dy); // between centers

  // Calculate separation based on mass ratio (or use 0.5 for equal)
  const totalMass = pt1.mass + pt2.mass;
  const ratio1 = pt1 === mousePoint ? 0 : (pt2 === mousePoint ? 1 : pt1.mass / totalMass); // pt1 moves this much
  const ratio2 = pt2 === mousePoint ? 0 : (pt1 === mousePoint ? 1 : pt2.mass / totalMass); // pt2 moves this much

  const overlap = pt1.radius + pt2.radius - distance;
  //console.log(overlap)

  // Normalized collision vector
  const nx = dx / distance;
  const ny = dy / distance;

  // Separate the points
  const separation1 = overlap * ratio1;
  const separation2 = overlap * ratio2;

  if (!pt1.pinned) {
    pt1.x -= nx * separation1;
    pt1.y -= ny * separation1;
  }
  if (!pt2.pinned) {
    pt2.x += nx * separation2;
    pt2.y += ny * separation2;
  }

  // Apply collision damping by modifying the velocity implicit in Verlet integration
  // In Verlet, velocity = current_pos - last_pos
  if (! pt1.pinned) {
    
    // Reduce velocity by damping factor
    pt1.last_x -= (nx * separation1) * COLLISION_DAMPING;
    pt1.last_y -= (ny * separation1) * COLLISION_DAMPING;

    //pt1.color = "orange";
  }

  if (! pt2.pinned) {

    // Reduce velocity by damping factor
    pt2.last_x += (nx * separation2) * COLLISION_DAMPING;
    pt2.last_y += (ny * separation2) * COLLISION_DAMPING;

    //pt2.color = "orange";
  }
}
```