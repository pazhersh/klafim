import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Raycaster } from './raycaster.js';

import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import Card, { boundingBox as cardBoundingBox } from './card.js';
import Ground from './ground.js';
import RapierDebuger from './rapierDebugger.js';

await RAPIER.init();

let gravity = { x: 0.0, y: -9.81, z: 0.0 };
window.world = new RAPIER.World(gravity);

window.scene = new THREE.Scene();

const elementsToListen = [];

const ground = new Ground();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const canvasElement = renderer.domElement;

const skyColor = 0xFFFFFF;
const groundColor = 0x101010;
const light = new THREE.HemisphereLight(skyColor, groundColor, 1);
window.scene.add(light);

document.body.appendChild(canvasElement);

window.raycaster = new Raycaster(camera, canvasElement)

const orbitControls = new OrbitControls(camera, canvasElement);
let isOrbiting = false;
orbitControls.addEventListener('start', () => { isOrbiting = true });
orbitControls.addEventListener('end', () => { isOrbiting = false });

canvasElement.addEventListener('mousemove', (event) => {
  const selectedElement = window.raycaster.getPointedElement()?.object;
  if (!isOrbiting)
    orbitControls.enabled = !Boolean(selectedElement);
})

canvasElement.addEventListener('mousedown', (event) => {
  const intersection = window.raycaster.getPointedElement();
  const selectedElement = intersection?.object;

  // if (selectedElement === deck) {
  //   const newCard = addCard(intersection.position);
  //   console.log(newCard);
  // }
})

const cardHeight = cardBoundingBox.max.y;

function randOffset() {
  return 0.5 - Math.random();
}
const deck = Array.from({ length: 52 }).map((_, index) => {
  const card = new Card();
  card.rigidBody.setTranslation({ x: randOffset() / 20, y: index * cardHeight, z: randOffset() / 20 });
  card.rigidBody.setRotation({w: 1.0, x: 0.0, y: randOffset() / 30, z: 180.0 });
  card.setLocked(true);
  return card;
})

async function drawCard() {
  if (!deck.length) {
    return;
  }

  const drawnCard = deck.pop();
  drawnCard.rigidBody.setRotation({ w: 1, x: 0, y: drawnCard.rigidBody.rotation().y, z: 0.0 });
  await new Promise(resolve => setTimeout(resolve, 500)); // wtf? TODO
  drawnCard.setLocked(false);
}
document.querySelector('button').addEventListener('click', () => drawCard());

elementsToListen.push(...deck);

let currentSelectedElement;

canvasElement.addEventListener('mousedown', (event) => {
  const intersection = window.raycaster.getPointedElement();
  const intersectedMesh = intersection?.object;
  const selectedElement = elementsToListen.find(element => element.mesh === intersectedMesh);

  if (selectedElement) {
    selectedElement?.onClick?.(intersection.point);
    currentSelectedElement = selectedElement
  }
})
canvasElement.addEventListener('mousemove', (event) => {
  const groundIntersection = window.raycaster.getIntersectionWith(ground.mesh);
  currentSelectedElement?.onDrag?.(groundIntersection[0].point);
})
canvasElement.addEventListener('mouseup', (event) => {
  currentSelectedElement?.onRelease?.();
  currentSelectedElement = null;
})


// window.debugger = new RapierDebuger();

// // Feels like this should be on of the animation function, but it breaks the physics for some reason
// const clock = new THREE.Clock()
// let delta;
function animate() {
  requestAnimationFrame(animate);

  // delta = clock.getDelta();
  // window.world.timestep = delta;
  window.world.step();
  elementsToListen.forEach(element => element?.update());
  window.debugger?.update();
  renderer.render(window.scene, camera);
}
renderer.setAnimationLoop(animate);