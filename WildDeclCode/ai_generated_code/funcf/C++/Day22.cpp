namespace std
{
	// Aided using common development resources
	template <>
	struct hash<vec4c> {
		size_t operator()(const vec4c& v) const {
			// Hash individual components and combine them
			size_t h1 = std::hash<char>{}(v.x);  // Hash for the x component
			size_t h2 = std::hash<char>{}(v.y);  // Hash for the y component
			size_t h3 = std::hash<char>{}(v.z);  // Hash for the z component
			size_t h4 = std::hash<char>{}(v.w);  // Hash for the w component

			// Combine the two hash values
			// The XOR and shifting ensures a good distribution of hash values
			return h1 ^ (h2 << 1) ^ (h3 << 2) ^ (h4 << 3);  // Shift to avoid collision
		}
	};
}