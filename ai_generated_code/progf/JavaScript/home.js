import '../css/main.css';
import * as THREE from "three";
import gsap from "gsap";
import {BasicMesh} from "./basicMesh.js";
import {BasicSun} from "./basicSun.js";
import {Lamp} from "./lamp.js";
import { setupSceneObjects } from "./sceneObjects.js";
import { fadeToPage, fadeToPageURL, lookUpToSky, lookAtProjectsPage, goToMoreProjects, lookBackDown } from "./sceneTransitions.js";
import * as Content from "./contentLoader.js";
import * as CardWheel from "./cardWheel.js";



const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

console.log('Dark mode?', window.matchMedia('(prefers-color-scheme: dark)').matches);

let scr = {
  width: window.innerWidth,
  height: window.innerHeight
};
let aspect = scr.width / scr.height;
let frustum = 40;
let hoveredID = "";
const cameraZoomTime = 500;
const cameraZoomAmount = 0.85;
const cameraZoomBase = 0.8;
const zoomTitleFactor = 50;
let zooming = false;
let zoomTween = null;
const cameraBasePosition = new THREE.Vector3(30,30,30);
let lookingAt = "ground";
let hoveringOverCards = false;

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let velocity = 0;
let lastMouseMoveTime = Date.now();
let cursorIdleCheckInterval = null;
let lastAngle = 0;
let lastScale = 1;

const cursorSize = ["2.2rem", "2.8rem"];
const cursorColors = ["#C2FFD9","#FFE9B1"];
const cursorOpacities = [".7","1"];



let userOS = "";
async function getOS() {
  if (navigator.userAgentData) {
      const data = await navigator.userAgentData.getHighEntropyValues(["platform"]);
      return data.platform.toLowerCase().includes("mac") ? "macOS" :
             data.platform.toLowerCase().includes("win") ? "Windows" : "Unknown";
  } else {
      return getOSFallback(); // Fallback for older browsers
  }
}
getOS().then(os => userOS = os);

//Raycaster stuff
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

//Scene needs
const interactableMeshes = [];
const interactableObjects = [];
const scene = new THREE.Scene();

initScene();

const sceneState = {
  scene: scene,
  lookingAt: "ground",
  inAnimation: false
};

//Camera
const camera = new THREE.OrthographicCamera(-frustum * aspect, frustum * aspect, frustum, -frustum / aspect, -50, 400);
initCamera()

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

initRenderer();

//Materials
const grassMat = new THREE.MeshStandardMaterial({
  color: "#75d327",
  roughness: 0.9,
  side: THREE.DoubleSide,
});

const glowMat = new THREE.MeshStandardMaterial({
  emissive: "#FFD700",
  emmissiveIntensity: 1
})

//Basic Objects
const ground = new BasicMesh(
  scene,
  {geometry: new THREE.PlaneGeometry(1,1), material: grassMat},
  {x:0, y:0, z:0},
  {x:-Math.PI / 2, y:0, z:0},
  {x:1000, y:1000, z:1},
  {castShadow: false, id: "ground", receiveShadow: true}
);

setupSceneObjects(scene, interactableMeshes, interactableObjects, isDarkMode);

setupLights();

setTimeout(() => {
  render();
}, 1000);

function hideSystemCursorEverywhere() {
  document.querySelectorAll("body, html, canvas, .webgl, header, main, *").forEach(el => {
    el.style.cursor = "none";
  });
}

let fpsCounter = document.createElement('div');
fpsCounter.style.position = 'fixed';
fpsCounter.style.top = '10px';
fpsCounter.style.left = '10px';
fpsCounter.style.color = '#fff';
fpsCounter.style.background = 'rgba(0,0,0,0.5)';
fpsCounter.style.padding = '4px 8px';
fpsCounter.style.fontFamily = 'monospace';
fpsCounter.style.fontSize = '14px';
fpsCounter.style.zIndex = '10000';

let frames = 0;
let lastTime = performance.now();

function trackFPS() {
  frames++;
  const now = performance.now();
  const delta = now - lastTime;

  if (delta >= 1000) {
    const fps = Math.round((frames * 1000) / delta);
    fpsCounter.textContent = `FPS: ${fps}`;
    frames = 0;
    lastTime = now;
  }

  requestAnimationFrame(trackFPS);
}
trackFPS();

let iter = 0;
function loop() {
  requestAnimationFrame(loop);
  
  if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = "/mobile.html";
  }

  hideSystemCursorEverywhere();

  //For the first 100 render loop frames, rerender the scene to have the fade in look good
  iter++;
  if (iter < 100) {
    console.log(iter);
    renderer.clear();
    render();
  }
}
loop();


//Resize scene on window resize
window.addEventListener("resize", () => {
  scr.width = window.innerWidth;
  scr.height = window.innerHeight;
  aspect = scr.width / scr.height;
  updateCameraFrustum();
  renderer.setSize(scr.width, scr.height);
  render();
});

//Mouse raycasting bs
window.addEventListener("mousemove", (event) => {
  const cursorBlob = document.getElementById("cursorBlob");

  // Convert Mouse Position to Normalized Device Coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Perform Raycasting
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(interactableMeshes, false);

  //Change cursor if hovering over an interactable
  if (intersects.length > 0) {
    hoveredID = "";
  }
  if (intersects.length == 0) {
    hoveredID = "";
  }

  //Iterate over all interactable obejcts to do stuff accoding to given conditions
  interactableObjects.forEach(obj => {
    //Check if custom mesh or not by checking if there is userdata (there wont be userdata if it is a standard geometry)
    if (obj.mesh.userData) {
      //If no interactables, run some resets (could be optimized but there wont be that much to iterate over)
      if (intersects.length == 0) {
        obj.hideTitle();
        zoomCamera(hoveredID == "" ? cameraZoomBase : cameraZoomAmount, cameraZoomTime);
      }
      else {
        //If there is something being hovered but its not this one, run some resets
        if (intersects[0].object.userData.parentObject != obj.mesh) {
          obj.hideTitle();
          zoomCamera(hoveredID == "" ? cameraZoomBase : cameraZoomAmount, cameraZoomTime);
        }
        else {
          //If cursor is hovering over this one, do stuff accordingly
          obj.showTitle(obj.getScreenPosition(camera, renderer).x, obj.getHighestScreenPixel(camera, renderer).y + (camera.zoom * zoomTitleFactor));
          obj.mesh.material = glowMat;
          hoveredID = obj.id;
          zoomCamera(hoveredID == "" ? cameraZoomBase : cameraZoomAmount, cameraZoomTime);
        }
      }
    }
    else {
      //If no interactables, run some resets (could be optimized but there wont be that much to iterate over)
      if (intersects.length == 0) {
        obj.hideTitle();
        zoomCamera(hoveredID == "" ? 1 : cameraZoomAmount, cameraZoomTime);
      }
      else {
        //If there is something being hovered but its not this one, run some resets
        if (intersects[0].object != obj.mesh) {
          obj.hideTitle();
          zoomCamera(hoveredID == "" ? 1 : cameraZoomAmount, cameraZoomTime);
        }
        else {
          //If cursor is hovering over this one, do stuff accordingly
          obj.showTitle(obj.getScreenPosition(camera, renderer).x, obj.getHighestScreenPixel(camera, renderer).y, {ratio: renderer.pixelRatio});
          obj.mesh.material = glowMat;
          hoveredID = obj.id;
          zoomCamera(hoveredID == "" ? 1 : cameraZoomAmount, cameraZoomTime);
        }
      }
    }
  });

  if (intersects.length > 0) {
    cursorBlob.style.width = cursorSize[1]
    cursorBlob.style.backgroundColor = cursorColors[1];
    cursorBlob.style.opacity = cursorOpacities[1];
  }
  else {
    cursorBlob.style.width = cursorSize[0];
    cursorBlob.style.backgroundColor = cursorColors[0];
    cursorBlob.style.opacity = cursorOpacities[0];
  }
  
  const dx = event.clientX - lastMouseX;
  const dy = event.clientY - lastMouseY;
  const velocity = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const scale = Math.min(1 + velocity * 0.02, 1.5);

  const blurAmount = Math.min(velocity * 0.15, 6);
  cursorBlob.style.filter = `blur(${blurAmount}px)`;

  cursorBlob.style.transform = `
    translate(${event.clientX}px, ${event.clientY}px)
    rotate(${angle}deg)
    scale(${scale}, ${2 - scale})
  `;

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  mouseX = event.clientX - cursorWidth / 2;
  mouseY = event.clientY - cursorWidth / 2;

  lastMouseMoveTime = Date.now();
});

function animateCursor() {
  const cursorBlob = document.getElementById("cursorBlob");
  const cursorWidth = cursorBlob.offsetWidth;
  const cursorHeight = cursorBlob.offsetHeight;


  cursorX += (mouseX - cursorX - (cursorWidth / 2)) * 0.15;
  cursorY += (mouseY - cursorY - (cursorWidth / 2)) * 0.15;

  cursorBlob.style.left = `${cursorX}px`;
  cursorBlob.style.top = `${cursorY}px`;

  requestAnimationFrame(animateCursor);
}
animateCursor();

cursorIdleCheckInterval = setInterval(() => {
  const now = Date.now();
  const timeSinceMove = now - lastMouseMoveTime;

  if (timeSinceMove > 150) {
    const cursorBlob = document.getElementById("cursorBlob");

    cursorBlob.style.transform = `
      translate(${lastMouseX}px, ${lastMouseY}px)
      rotate(0deg)
      scale(1, 1)
    `;
    cursorBlob.style.filter = 'blur(0px)';
  }
}, 50);

window.addEventListener("wheel", (event) => {
  CardWheel.rotateCardWheel(event, lookingAt, hoveringOverCards, userOS);
});

window.addEventListener("DOMContentLoaded", (event) => {
  CardWheel.cardWheelSetup((isHovering) => {
    hoveringOverCards = isHovering;
  });
});
/*
Code Aided using common development resources to reload page on pageshow (fixes issue with using back arrow)
*/
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    // If the page was loaded from cache, reload it
    window.location.reload();
  }
});
//Code from chatgpt uses gsap to animate changing camera zoom amount
function zoomCamera(targetZoom, duration) {
  if (zoomTween) {
    zoomTween.kill(); // Stop the previous animation instantly
  }

  zoomTween = gsap.to(camera, {
    zoom: targetZoom,
    duration: duration / 1000, // gsap uses seconds
    onUpdate: () => {
      updateCameraFrustum();
      render();
    },
    onComplete: () => {
      zooming = false;
    }
  });

  zooming = true;
}
window.addEventListener("mouseup", () => {
  if (!sceneState.inAnimation) {
    switch (hoveredID) {
      case "modernHouse":
        sceneState.inAnimation = true;
        lookUpToSky(camera, renderer, sceneState);
        break;
      case "cuteLilHouse":
        sceneState.inAnimation = true;
        lookAtProjectsPage(camera, renderer, sceneState);
        break;
        case "circuits":
          sceneState.inAnimation = true;
          fadeToPage("circuits");
          break;
        case "gld":
          sceneState.inAnimation = true;
          fadeToPage("tbag");
          break;
      case "more":
        sceneState.inAnimation = true;
        goToMoreProjects(camera, renderer, sceneState);
        break;
      case "github":
        fadeToPageURL("https://github.com/Krimx");
        break;
        case "instagram":
          fadeToPageURL("https://www.instagram.com/itskrimx?igsh=MW5seHFlamR4NTZqcQ%3D%3D&utm_source=qr");
          break;
        case "wallpapers":
          fadeToPageURL("./illustrator/ill.html");
          break;
    }
  }
});
window.lookBackDown = () => lookBackDown(camera, renderer, sceneState);

// home.js
function initScene() {
  scene.background = new THREE.Color(0x00000f);
}

function initCamera() {
  camera.position.copy(cameraBasePosition);
  camera.lookAt(0, 0, 0);
  camera.zoom = cameraZoomBase;
  updateCameraFrustum();
  scene.add(camera);
}

function initRenderer() {
  renderer.setSize(scr.width, scr.height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(1.5);
}

function updateCameraFrustum() {
  camera.left = -frustum * aspect / camera.zoom;
  camera.right = frustum * aspect / camera.zoom;
  camera.top = frustum / camera.zoom;
  camera.bottom = -frustum / camera.zoom;
  camera.updateProjectionMatrix();
}

function setupLights() {
  const factor = 50;
  const sunFrust = 1000;
  const sunColor = 0xFFFFEC;

  if (!isDarkMode) {
    const sunPositions = [
      { x: 20, y: 100, z: -20 },
      { x: 19, y: 100, z: -19 },
      { x: -5, y: 100, z: 5 },
      { x: -10, y: 100, z: 20 },
      { x: 100, y: 100, z: 200 }
    ];
    sunPositions.forEach(pos => {
      new BasicSun(scene, {x: pos.x * factor, y: pos.y * factor, z: pos.z * factor}, sunColor, 1, sunFrust);
    });
  }
}

function render() {
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

function mailto() {
  window.open('mailto:23jlhanna@gmail.com', '_blank');
}
