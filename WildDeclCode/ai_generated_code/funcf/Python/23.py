```python
def sphere_aabb_intersect(sphere, aabb_min, aabb_max):
    sphere_center = sphere[:3]; sphere_radius = sphere[3]
    cx, cy, cz = sphere_center
    min_x, min_y, min_z = aabb_min
    max_x, max_y, max_z = aabb_max

    # Thanks chatgpt :P
    # Find the closest point on the AABB to the sphere's center
    closest_x = max(min_x, min(cx, max_x))
    closest_y = max(min_y, min(cy, max_y))
    closest_z = max(min_z, min(cz, max_z))
    closest = (closest_x, closest_y, closest_z)

    mnh = manhattan(closest, sphere_center)
    return mnh <= sphere_radius
```