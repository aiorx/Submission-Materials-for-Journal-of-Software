require('regenerator-runtime/runtime');
var THREE = require('three');
var MaterialEditor = require('@three-material-editor/vanilla').MaterialEditor;
var useEditorComposer = require('@three-material-editor/vanilla').useEditorComposer;
var EffectComposer = require('three/examples/jsm/postprocessing/EffectComposer.js').EffectComposer;
var RenderPass = require('three/examples/jsm/postprocessing/RenderPass.js').RenderPass;
var ShaderPass = require('three/examples/jsm/postprocessing/ShaderPass.js').ShaderPass;
// import { BloomEffect, EffectComposer, EffectPass, RenderPass, GlitchEffect } from "postprocessing";

var RGBShiftShader = require('three/examples/jsm/shaders/RGBShiftShader.js').RGBShiftShader;
var DotScreenShader = require('three/examples/jsm/shaders/DotScreenShader.js').DotScreenShader;

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
MaterialEditor(scene, renderer, {
  camera: camera, // handle responsize dpr for fullscreen
  overrideRaf: false
})

// postprocessing

let composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );
// composer.addPass(new RenderPass(scene, camera));
// composer.addPass(new EffectPass(camera, new BloomEffect()));
// composer.addPass(new EffectPass(camera, new GlitchEffect()));

const effect1 = new ShaderPass( DotScreenShader );
effect1.uniforms[ 'scale' ].value = 4;
composer.addPass( effect1 );

const effect2 = new ShaderPass( RGBShiftShader );
effect2.uniforms[ 'amount' ].value = 0.0015;
composer.addPass( effect2 );

useEditorComposer(composer)

camera.position.z = 5;
function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
	requestAnimationFrame( animate );
  renderer.render( scene, camera );
  composer.render(clock.getDelta());

}

animate();