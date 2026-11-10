async load(path, rotationOffset) {
    const loader = new GLTFLoader();

    this.#loadingComplete = new Promise((resolve, reject) =>
      loader.load(path, (gltf) => {
        this.#modelData = gltf.scene;
        this.#modelData.updateMatrixWorld( true )
        var bound = new THREE.Box3();

        // Original bounding box is incorrect. Correction Drafted using common development resources:
        // https://chat.openai.com/share/380cd060-a4fd-4eff-aa1f-4bc3e32c9a55
        this.#modelData.traverse((child) => {
          if (child.isMesh) {
            // For some reason, computing an unused bounding box resolves issues
            bound.expandByObject(child);
            child.geometry.computeBoundingBox();
          }
          // console.log(bound.min, bound.max);
         
        });

        this.#modelData.rotation.set(0, rotationOffset, 0);

        this.add(this.#modelData);

        this.#animationData = gltf.animations;
        for (var i = 0; i < this.#animationData.length; i++) {
          var animation = this.#animationData[i];
          this.animations.push(this.#mixer.clipAction(animation));
        }
        resolve();
      })
    );
    return this.#loadingComplete;
  }