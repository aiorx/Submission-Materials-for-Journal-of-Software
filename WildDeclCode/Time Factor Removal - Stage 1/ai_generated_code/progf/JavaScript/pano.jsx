// Pano
// Built using basic development resources for simple tryout
// doesnt work, can edit later if necessary
var _import = require('react');
var THREE = require('three');

var PanoramaViewer = function ({ imageUrl }) {
  var mountRef = useRef(null);

  useEffect(() => {
    // Basic setup
    var width = mountRef.current.clientWidth;
    var height = mountRef.current.clientHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Create a sphere
    var geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere

    // Load the panoramic image as a texture
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      var material = new THREE.MeshBasicMaterial({ map: texture });
      var sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    });

    // Position the camera
    camera.position.set(0, 0, 0.1);

    // Animation loop
    var animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [imageUrl]);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

module.exports = PanoramaViewer;
