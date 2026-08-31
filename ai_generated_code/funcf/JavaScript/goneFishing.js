```js
// Collision detection Composed with basic coding tools:
// https://chat.openai.com/c/2fcab630-0e8f-44aa-b311-930d2190df60
function isColliding(objA, objB) {
  var hitboxA = new THREE.Box3().setFromObject(objA);
  var hitboxB = new THREE.Box3().setFromObject(objB);
  
  return hitboxA.intersectsBox(hitboxB);
}
```