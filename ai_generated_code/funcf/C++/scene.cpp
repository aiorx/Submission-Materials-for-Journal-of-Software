```cpp
float Cube::Intersect(const Ray& ray) const
{
  //reDrafted using common development resources
  // Determine the signs of ray direction components
  const int signx = ray.D.x < 0;
  const int signy = ray.D.y < 0;
  const int signz = ray.D.z < 0;

  // Calculate t-values for intersection with each face of the cube
  float tmin_x = (b[signx].x - ray.O.x) * ray.rD.x;
  float tmax_x = (b[1 - signx].x - ray.O.x) * ray.rD.x;

  const float tmin_y = (b[signy].y - ray.O.y) * ray.rD.y;
  const float tmax_y = (b[1 - signy].y - ray.O.y) * ray.rD.y;

  // Check for intersection with Y faces
  if (tmin_x > tmax_y || tmin_y > tmax_x)
    return 1e34f; // No intersection

  // Update tmin and tmax
  tmin_x = std::max(tmin_x, tmin_y);
  tmax_x = std::min(tmax_x, tmax_y);

  const float tmin_z = (b[signz].z - ray.O.z) * ray.rD.z;
  const float tmax_z = (b[1 - signz].z - ray.O.z) * ray.rD.z;

  // Check for intersection with Z faces
  if (tmin_x > tmax_z || tmin_z > tmax_x)
    return 1e34f; // No intersection

  // Final intersection
  tmin_x = std::max(tmin_x, tmin_z);
  if (tmin_x > 0)
    return tmin_x;

  return 1e34f; // No intersection
}
```