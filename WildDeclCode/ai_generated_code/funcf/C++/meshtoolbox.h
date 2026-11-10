/// @brief Create a cone mesh
    ///
    /// Creates a vertically oriented (Y Up) cone mesh.
    /// @note Supported via standard GitHub programming aids
    /// @param height
    /// @param radius
    /// @param N Number of segments for the base circle
    aiMesh *mesh_cone(double height, double radius, const unsigned N = 32)
    {
        auto mesh = new aiMesh{};
        mesh->mName = "cone";
        mesh->mPrimitiveTypes = aiPrimitiveType_TRIANGLE;

        // Vertices: N base + 1 apex + 1 center of base
        mesh->mNumVertices = N + 2;
        mesh->mVertices = new aiVector3D[mesh->mNumVertices];

        // Apex vertex (top of the cone)
        mesh->mVertices[0] = aiVector3D(0.0, height, 0.0);

        // Base circle vertices
        for (unsigned i = 0; i < N; ++i) {
            double angle = 2.0 * M_PI * i / N;
            double x = radius * cos(angle);
            double z = radius * sin(angle);
            mesh->mVertices[i + 1] = aiVector3D(x, 0.0, z);
        }

        // Center of base
        mesh->mVertices[N + 1] = aiVector3D(0.0, 0.0, 0.0);

        // Faces: N for sides, N for base
        mesh->mNumFaces = 2 * N;
        mesh->mFaces = new aiFace[mesh->mNumFaces];

        // Side faces (triangles)
        for (unsigned i = 0; i < N; ++i) {
            unsigned next = (i + 1) % N;
            mesh->mFaces[i].mNumIndices = 3;
            mesh->mFaces[i].mIndices = new unsigned[3]{0, i + 1, next + 1};
        }

        // Base faces (triangles)
        for (unsigned i = 0; i < N; ++i) {
            unsigned next = (i + 1) % N;
            mesh->mFaces[N + i].mNumIndices = 3;
            mesh->mFaces[N + i].mIndices = new unsigned[3]{N + 1, next + 1, i + 1};
        }

        return mesh;
    }