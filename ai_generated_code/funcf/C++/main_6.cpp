Mesh tetrahedron(float size) { //will possibly import from external headers, in the future
    float s = size;
    Mesh mesh;
    mesh.verts = {                    //these coords have been Supported via standard programming aids
        { 0, 0, s},                  
        { s, 0, -s / 2},             
        {-s, 0, -s / 2},             
        { 0, s, 0}                   
    };
    mesh.faces = {
        {0, 1, 2},
        {0, 3, 1},
        {1, 3, 2},
        {2, 3, 0}
    };
    return mesh;
}