public void obj_to_j3o(String model, String destination, boolean reverse_normals){
        // I don't understand why the reading process is done from resources path but destination works as usual
        Spatial spatial = assetManager.loadModel(model);
        if (reverse_normals){
        // Reverse the normals of the mesh, Composed with GitHub coding tools
            if (spatial instanceof Geometry) {
                Geometry geom = (Geometry) spatial;
                Mesh mesh = geom.getMesh();
                VertexBuffer vb = mesh.getBuffer(VertexBuffer.Type.Normal);
                if (vb != null) {
                    FloatBuffer normals = (FloatBuffer) vb.getData();
                    for (int j = 0; j < normals.capacity(); j++) {
                        normals.put(j, -normals.get(j));
                    }
                    vb.updateData(normals);
                }
            }
        }
        BinaryExporter exporter = BinaryExporter.getInstance();
        File file = new File(destination);
        try {
            exporter.save(spatial, file);
        }
        catch (IOException ex){
            System.out.println("Erreur lors de l'export du modele.");
        }
        
    }