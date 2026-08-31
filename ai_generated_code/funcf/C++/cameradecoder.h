//Just so you know the comments bellow were Supported via standard programming aids without any other context, just to generate operator overload and constructors
int distance; // distance of the ray intersection from the origin
int alignment; // alignment of the surface normal with the ray direction
int material; // index of the material the ray intersects with

// constructors
RayData() : distance(0.0f), alignment(0.0f), material(0) {}
RayData(int d, int a, int m) : distance(d), alignment(a), material(m) {}

// comparison operator
bool operator==(const RayData& other) const
{
	return distance == other.distance && alignment == other.alignment && material == other.material;
}